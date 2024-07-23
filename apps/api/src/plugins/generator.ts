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
  let adminMethods = ''
  let appMethods = ''
  let userMethods = ''

  for (let route of routes) {
    if (!route.schema || !['GET', 'POST', 'PATCH', 'DELETE'].includes(route.method.toString())) {
      continue
    }
    const parts = route.url.split('/')
    const params = (route.schema.params as any)?.required ?? []
    const name = camelize((route.schema as any).summary)
    console.info(name, route.method, route.url, JSON.stringify(params))

    let methods = { admin: adminMethods, app: appMethods, user: userMethods }[parts[1]]
    methods += `
async ${name}(appId: string, params: PageParams) {
  return (await this.http.get<{ data: User[]; meta: PageMeta }>(\`/admin/apps//users\`, { params })).data
}`
  }

  // fs.writeFileSync(
  //   path.join(__dirname, '../../../../packages/sdk-core/client/AdminClient.ts'),
  //   adminTemplate(adminMethods)
  // )
  fs.writeFileSync(path.join(__dirname, '../../../../packages/sdk-core/client/AppClient.ts'), appTemplate(appMethods))
  // fs.writeFileSync(
  //   path.join(__dirname, '../../../../packages/sdk-core/client/UserClient.ts'),
  //   userTemplate(userMethods)
  // )
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
