import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { knex } from '../database'
import { formatDate } from '../utils/format-date'

export async function mealsRoutes(app: FastifyInstance) {

  app.post('/', { preHandler: [checkSessionIdExists] },async (request, reply) => {
    const createMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
      date: z.coerce.date()
    })


    const { name, description, isOnDiet, date } = createMealSchema.parse(request.body)

    const dateFormated = formatDate(date)

    await knex('meals').insert({
      id: crypto.randomUUID(),
      user_id: request.user?.id,
      name,
      description,
      is_on_diet: isOnDiet,
      date: dateFormated
    })

    return reply.status(201).send()
  })

  app.get('/', { preHandler: checkSessionIdExists }, (request, reply) => {
   
  })
}