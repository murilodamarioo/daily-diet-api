import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {

  app.post('/', { preHandler: [checkSessionIdExists] }, async (request, reply) => {

    const createMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
      date: z.coerce.date()
    })

    const { name, description, isOnDiet, date } = createMealSchema.parse(request.body)

    await knex('meals').insert({
      id: crypto.randomUUID(),
      user_id: request.user?.id,
      name,
      description,
      is_on_diet: isOnDiet,
      date: date.getTime()
    })

    return reply.status(201).send()
  })

  app.put('/:id', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const userId = request.user?.id

    const updateMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      isOnDiet: z.boolean()
    })

    const { id } = paramsSchema.parse(request.params)
    const { name, description, date, isOnDiet } = updateMealSchema.parse(request.body)

    if (!name || !description) return reply.status(400).send({ message: 'Missing required fields' })

    const meal = await knex('meals').where({ id, user_id: userId }).first()

    if (!meal) return reply.status(404).send({ message: 'Meal not found' })

    await knex('meals').where({ id }).update({
      name,
      description,
      date: date.getTime(), 
      is_on_diet: isOnDiet
    })

    return reply.status(204).send()
  })

  app.get('/', { preHandler: checkSessionIdExists }, async (request, reply) => {
    const userId = request.user?.id
    
    const meals = await knex('meals').where({ user_id: userId}).select('id', 'date', 'name', 'is_on_diet')

    return reply.status(200).send({ meals })
  })

  app.get('/:id', { preHandler: checkSessionIdExists }, async (request, reply) => {
    const getMealSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getMealSchema.parse(request.params)
    
    const userId = request.user?.id
    
    const researchedMeal = await knex('meals').where({ user_id: userId, id }).first()

    if (!researchedMeal) return reply.status(404).send({ message: 'Meal not found' })

    const meal = {
      id,
      name: researchedMeal?.name,
      desccription: researchedMeal?.description,
      isOnDiet: researchedMeal?.is_on_diet,
      date: researchedMeal?.date
    }

    return reply.status(200).send({ meal })
  })

  app.get('/metrics', { preHandler: checkSessionIdExists }, async (request, reply) => {
    const userId = request.user?.id

    const totalMeals = await knex('meals').where({ user_id: request.user?.id }).orderBy('date', 'desc')
    const totalMealsOnDiet = await knex('meals').where({ user_id: userId, is_on_diet: true}).count('id', { as: 'total' }).first()
    const totalMealsOffDiet = await knex('meals').where({ user_id: userId, is_on_diet: false}).count('id', { as: 'total' }).first()

    const { bestOnDietSequence } = totalMeals.reduce((acc, meal) => {
      if (meal.is_on_diet) {
        acc.currentSequence += 1
      } else {
        acc.currentSequence = 0
      }

      if (acc.currentSequence > acc.bestOnDietSequence) {
        acc.bestOnDietSequence = acc.currentSequence
      }

      return acc
    },
    { bestOnDietSequence: 0, currentSequence: 0 })

    const metrics = {
      bestOnDietSequence,
      meals: totalMeals.length,
      mealsOnDiet: totalMealsOnDiet?.total,
      mealsOffDiet: totalMealsOffDiet?.total
    }

    return reply.status(200).send({ metrics })
  })

  app.delete('/:id', { preHandler: checkSessionIdExists }, async (request, reply) => {
    const deleteMealSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = deleteMealSchema.parse(request.params)

    const userId = request.user?.id

    const researchedMeal = await knex('meals').where({ user_id: userId, id }).first()

    if (!researchedMeal) return reply.status(404).send({ message: 'Meal not found to delete' })

    await knex('meals').where({ user_id: userId, id}).delete()

    return reply.status(204).send()
  })
}