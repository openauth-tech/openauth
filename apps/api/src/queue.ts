import { init } from './utils/init'
import { avatarQueue, fullSyncAvatar } from './utils/queue'

import { BullAdapter } from '@bull-board/api/bullAdapter'
import { createBullBoard } from '@bull-board/api'
import { FastifyAdapter } from '@bull-board/fastify'

import fastify from 'fastify'
import { processAvatarJob } from './queue/avatar'

init()

async function run() {
  avatarQueue.process(processAvatarJob).catch(console.error)
  fullSyncAvatar().catch(console.error)

  const app = fastify()
  const serverAdapter = new FastifyAdapter()
  createBullBoard({
    queues: [new BullAdapter(avatarQueue)],
    serverAdapter,
  })

  app.register(serverAdapter.registerPlugin())

  await app.listen({ host: '0.0.0.0', port: 5567 })
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})