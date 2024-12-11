import fastify from 'fastify'
import { knex } from './database';
import { env } from './env';
import { usersRoutes } from './routes/users';

const app = fastify();

app.register(usersRoutes, {
  prefix: '/users'
})

app.listen({
  port: env.PORT,
}).then(() => {
  console.log('HTTP server running!')
})