import Fastify from 'fastify'
import { prisma } from './utils/prisma'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import path from 'node:path'
import { clientGeneratorPlugin } from './plugins/generator'

const server = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>()

const start = async () => {
  server.register(clientGeneratorPlugin)
  server.register(require('@fastify/autoload'), {
    dir: path.join(__dirname, 'routes'),
  })

  await server.ready()
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
