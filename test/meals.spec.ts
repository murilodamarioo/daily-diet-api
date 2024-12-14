import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { execSync } from 'child_process'
import { app } from '../src/app'
import request from 'supertest'
import { date } from 'zod'
import knex from 'knex'


describe('Meals routes', () => {
  // wait application to be ready before running tests
  beforeAll(async () => {
    await app.ready()
  })

  // close application after tests
  afterAll(async () => {
    await app.close()
  })

  // run migrations before each test -> reset database
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new meal', async () => {
    const userResponse = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john@email.com'
    }).expect(201)

    const cookies = userResponse.get('Set-Cookie');
    expect(cookies).toBeDefined();

    await request(app.server).post('/meals')
    .set('Cookie', cookies)
    .send({
      name: 'Breakfast',
      description: "It's a breakfast",
      isOnDiet: true,
      date: new Date(),
    })
    .expect(201)
  })

  it('should be able to list all meals', async () => {
    const userResponse = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john@email.com'
    }).expect(201)


    const cookies = userResponse.get('Set-Cookie');
    expect(cookies).toBeDefined();

    await request(app.server)
    .post('/meals')
    .set('Cookie', cookies)
    .send({
      name: 'Breakfast',
      description: "It's a breakfast",
      isOnDiet: true,
      date: new Date(),
    })
    .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Lunch',
        description: "It's a lunch",
        isOnDiet: true,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day after
      })
      .expect(201)
    
    const mealsResponse = await request(app.server)
    .get('/meals')
    .set('Cookie', cookies)
    .expect(200)

    expect(mealsResponse.body.meals).toHaveLength(2)
  })
})