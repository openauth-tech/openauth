import Fastify from 'fastify'
import qs from 'qs'
import jwt from '@fastify/jwt'
import { prisma } from './utils/prisma'
import { JWT_PRIVATE_KEY, JWT_PUBLIC_KEY } from './constants/env'
import { init } from './utils/init'
import cors from '@fastify/cors'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import path from 'node:path'

init()

const server = Fastify({
  logger: true,
  querystringParser: (str) => qs.parse(str),
}).withTypeProvider<TypeBoxTypeProvider>()

server.setErrorHandler((error, request, reply) => {
  console.error(error)
  return reply.status(error.statusCode ?? 500).send({ message: error.message })
})

const start = async () => {
  await server.register(cors, {})
  await server.register(require('fastify-metrics'), {
    endpoint: '/metrics',
    routeMetrics: {
      enabled: true,
      routeBlacklist: ['/metrics', '/docs'],
    },
  })
  await server.register(require('@fastify/swagger'))
  await server.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  })

  server.register(jwt, {
    secret: {
      private: JWT_PRIVATE_KEY,
      public: JWT_PUBLIC_KEY,
    },
    sign: { algorithm: 'EdDSA' },
  })
  server.register(require('@fastify/autoload'), {
    dir: path.join(__dirname, 'routes'),
  })

  await server.ready()
  await server.listen({ port: 5566, host: '0.0.0.0' })
}

start()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })

// graceful shutdown
const listeners = ['SIGINT', 'SIGTERM']
listeners.forEach((signal) => {
  process.on(signal, async () => {
    await server.close()
    process.exit(0)
  })
})
