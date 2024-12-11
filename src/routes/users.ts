import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance) {

  app.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string().email({ message: 'Invalid email address' })
    })

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = crypto.randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
    }

    const { name, email } = createUserSchema.parse(request.body)

    const userExists = await knex('users').where({ email }).first()

    if (userExists) {
      return reply.status(400).send({ message: 'User already exists' })
    }

    await knex('users').insert({
      id: crypto.randomUUID(),
      session_id: sessionId,
      name,
      email
    })

    return reply.status(201).send()
  })
}