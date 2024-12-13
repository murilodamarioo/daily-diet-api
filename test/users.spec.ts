import { it, expect, test, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { execSync } from 'child_process'
import { app } from '../src/app'
import request from 'supertest'

describe('Users routes', () => {
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

  it('should be able to create a new user', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john@email.com'
    })

    expect(response.statusCode).toEqual(201)
  })

  it('should not be able to create a user with same email', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john@email.com'
    })

    const response = await request(app.server).post('/users').send({
      name: 'John Lenon',
      email: 'john@email.com'
    })

    expect(response.statusCode).toEqual(400)
  })
})