import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { knex } from '../database'
import { formatDate } from '../utils/format-date'

export async function mealsRoutes(app: FastifyInstance) {

  app.post('/', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
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

  app.get('/', { preHandler: checkSessionIdExists }, async (request, reply) => {
    const userId = request.user?.id
    
    const meals = await knex('meals').where({ user_id: userId}).select('date', 'name', 'is_on_diet')

    return reply.status(200).send({ meals })
  })

  app.get('/:id', { preHandler: checkSessionIdExists }, async (request, reply) => {
    const getMealSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getMealSchema.parse(request.params)
    
    const userId = request.user?.id
    
    const researchedMeal = await knex('meals').where({ user_id: userId, id }).first()

    const meal = {
      name: researchedMeal?.name,
      desccription: researchedMeal?.description,
      isOnDiet: researchedMeal?.is_on_diet,
      date: researchedMeal?.date
    }

    return reply.status(200).send({ meal })
  })
}