import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/bullAdapter'
import { FastifyAdapter } from '@bull-board/fastify'
import fastify from 'fastify'

import { processAvatarJob } from './queue/avatar'
import { init } from './utils/init'
import { avatarQueue, fullSyncAvatar } from './utils/queue'

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

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
