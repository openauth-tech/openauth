import fastifyPlugin from 'fastify-plugin'
import { FastifyError, FastifyInstance, FastifyPluginOptions, RouteOptions } from 'fastify'
import * as fs from 'node:fs'
import path from 'node:path'

type RouteData = RouteOptions & { path: string }

export const clientGeneratorPlugin = fastifyPlugin(
  function (instance: FastifyInstance, options: FastifyPluginOptions, done: (error?: FastifyError) => void): void {
    const routes: RouteData[] = []
    instance.addHook('onRoute', (route) => {
      routes.push(route)
    })
    instance.addHook('onReady', (done) => {
      generateClient(routes)
      done()
    })
    done()
  },
  { name: 'openauth-client-generator', fastify: '4.x' }
)

function generateClient(routes: RouteData[]) {
  const methods = { admin: '', app: '', user: '' }

  for (let route of routes) {
    if (!route.schema || !['GET', 'POST', 'PATCH', 'DELETE'].includes(route.method.toString())) {
      continue
    }
    const query = route.schema.querystring
    const body = route.schema.body

    const parts = route.url.split('/')
    const key = parts[1] as 'admin' | 'app' | 'user'
    const httpMethodName = route.method.toString().toLowerCase()
    const methodName = camelize((route.schema as any).summary)
    console.info(methodName, route.method, route.url)

    // process query string
    const paramsTypeModel = getTypeModelFromSchema(route.schema.params)
    let methodParamsTypeModel = paramsTypeModel
    if (query) {
      const queryTypeModel = getTypeModelFromSchema(query)
      methodParamsTypeModel = { ...methodParamsTypeModel, params: queryTypeModel }
    }
    // process request body
    if (body) {
      const requestBodyTypeModel = getTypeModelFromSchema(body)
      methodParamsTypeModel = { ...methodParamsTypeModel, data: requestBodyTypeModel }
    }

    // process response body
    const bodyTypeModel = getTypeModelFromSchema((route.schema.response as any)['200'])
    const bodyStr = getStringFromTypeModel(bodyTypeModel)

    // process method params
    const methosParamsStr = Object.keys(methodParamsTypeModel)
      .map((key) => `${key}: ${getStringFromTypeModel(methodParamsTypeModel[key])}`)
      .join(', ')

    // build URL
    let url = route.url
    for (let key of Object.keys(paramsTypeModel)) {
      url = url.replace(`:${key}`, `\${${key}}`)
    }

    // http params
    const httpParamsStr = query ? '{ params }' : body ? 'data' : ''

    methods[key] += `
async ${methodName}(${methosParamsStr}) {
  return (await this.http.${httpMethodName}<${bodyStr}>(\`${url}\`${httpParamsStr ? ', ' + httpParamsStr : ''})).data
}`
  }

  fs.writeFileSync(
    path.join(__dirname, '../../../../packages/sdk-core/client/AdminClient.ts'),
    adminTemplate(methods.admin)
  )
  fs.writeFileSync(path.join(__dirname, '../../../../packages/sdk-core/client/AppClient.ts'), appTemplate(methods.app))
  fs.writeFileSync(
    path.join(__dirname, '../../../../packages/sdk-core/client/UserClient.ts'),
    userTemplate(methods.user)
  )
}

const adminTemplate = (methods: string) => `
import { BaseClient } from './BaseClient.ts'

export class AdminClient extends BaseClient {
  ${methods}
}
`

const appTemplate = (methods: string) => `
import { BaseClient } from './BaseClient.ts'

export class AppClient extends BaseClient {
  ${methods}
}
`

const userTemplate = (methods: string) => `
import { BaseClient } from './BaseClient.ts'

export class UserClient extends BaseClient {
  ${methods}
}
`

function camelize(str: string) {
  return str
    .replace(/^\w|[A-Z]|\b\w/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}

function getTypeModelFromSchema(schema: any): any {
  if (!schema) {
    return {}
  }
  console.log(JSON.stringify(schema))

  if (schema.type === 'string') {
    return 'string'
  }
  if (schema.type === 'integer') {
    return 'number'
  }
  if (schema.type === 'number') {
    return 'number'
  }
  if (schema.type === 'boolean') {
    return 'boolean'
  }

  if (schema.type === 'object') {
    const properties = schema.properties
    const result: any = {}
    for (let key in properties) {
      result[key] = getTypeModelFromSchema(properties[key])
    }
    return result
  }

  if (schema.type === 'array') {
    return [getTypeModelFromSchema(schema.items)]
  }

  if (schema.anyOf) {
    return schema.anyOf.map((i: any) => i.type).join(' | ')
  }

  throw new Error(`Unsupported schema type: ${schema.type}`)
}

function getStringFromTypeModel(typeModel: any): string {
  if (!typeModel) {
    return ''
  }

  if (typeof typeModel === 'string') {
    return typeModel
  }

  // array
  if (Array.isArray(typeModel)) {
    return `${getStringFromTypeModel(typeModel[0])}[]`
  }

  // object
  const result = []
  for (let key in typeModel) {
    result.push(`${key}: ${getStringFromTypeModel(typeModel[key])}`)
  }
  return `{ ${result.join(', ')} }`
}
