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
    const response = route.schema.response as any

    const parts = route.url.split('/')
    const key = parts[1] as 'admin' | 'app' | 'user'
    const httpMethodName = route.method.toString().toLowerCase()
    const methodName = camelize((route.schema as any).summary)
    console.info(methodName, route.method, route.url)

    // process query string
    const paramsTypeModel = getTypeModelFromSchema(route.schema.params)
    let methodParamsTypeModel = paramsTypeModel
    const queryTypeModel = query ? getTypeModelFromSchema(query) : undefined
    if (query) {
      methodParamsTypeModel = { ...methodParamsTypeModel, params: queryTypeModel }
    }
    // process request body
    if (body) {
      const requestBodyTypeModel = getTypeModelFromSchema(body)
      methodParamsTypeModel = { ...methodParamsTypeModel, data: requestBodyTypeModel }
    }

    // process response body
    const should201 = Object.keys(response['201'] ?? {}).length > 0
    const responseTypeModel = getTypeModelFromSchema(should201 ? response['201'] : response['200'])
    const responseStr = getStringFromTypeModel(responseTypeModel)
    const dataSuffixStr = Object.keys(responseTypeModel).join(',') === 'data' ? '.data' : ''

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
    let httpParamsStr = ''
    if (body) {
      httpParamsStr += ', data'
    }
    if (query) {
      httpParamsStr += ', { params }'
    }

    methods[key] += `
async ${methodName}(${methosParamsStr}) {
  return (await this.http.${httpMethodName}<${responseStr}>(\`${url}\`${httpParamsStr})).data${dataSuffixStr}
}`
  }

  const relativePathPrefix = '../../../../packages/sdk-core/client/'
  fs.writeFileSync(path.join(__dirname, relativePathPrefix + 'AdminClient.ts'), adminTemplate(methods.admin))
  fs.writeFileSync(path.join(__dirname, relativePathPrefix + 'AppClient.ts'), appTemplate(methods.app))
  fs.writeFileSync(path.join(__dirname, relativePathPrefix + 'UserClient.ts'), userTemplate(methods.user))
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

  if (schema.anyOf) {
    return schema.anyOf.map((i: any) => getTypeModelFromSchema(i)).join(' | ')
  }

  if (schema.allOf) {
    return getTypeModelFromSchema({
      type: 'object',
      properties: Object.assign({}, ...schema.allOf.map((i: any) => i.properties)),
    })
  }

  if (schema.type === 'string') {
    return schema.const ? `'${schema.const}'` : 'string'
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
  if (schema.type === 'null') {
    return 'null'
  }

  if (schema.type === 'object') {
    const properties = schema.properties
    const result: any = {}
    for (let key in properties) {
      const property = properties[key]
      const isOptional = property[Symbol.for('TypeBox.Optional')] === 'Optional'
      result[isOptional ? key + '?' : key] = getTypeModelFromSchema(property)
    }
    return result
  }

  if (schema.type === 'array') {
    return [getTypeModelFromSchema(schema.items)]
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
