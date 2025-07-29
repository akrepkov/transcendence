import { PrismaClient } from '@prisma/client';
import Fastify from 'fastify';
import userRoutes from '../routes/userRoutes.js';
import * as userServices from '../database/services/userServices.js';

await userServices.deleteUser('lena');

describe('User Routes', () => {
  let fastify;
  const prisma = new PrismaClient();
  beforeAll(async () => {
    fastify = Fastify();
    await userRoutes(fastify); // register your routes
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
	await prisma.$disconnect();
  });


  test('POST /api/auth/register', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        username: 'lena',
        email: 'lena@lena.com',
        password: 'lena'
      }
    });
	const body = await JSON.parse(response.body);
	if(response.statusCode == 500)
		expect(body.message).toBe('Username is already in use');
	else {
		expect(response.statusCode).toBe(201);
		expect(body.message).toBe('Registration successful');
	}
  });

  	test('POST /api/auth/logout', async() => {
		const response = await fastify.inject({
			method: 'POST',
			url: '/api/auth/logout',
			payload: {
				username: 'lena',
			}
		});
		const body = await JSON.parse(response.body);
		expect(body.message).toBe('Logged out successfully');
	})

    test('POST /api/auth/login', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        username: 'lena',
        password: 'lena'
      }
    });
    expect(response.statusCode).toBe(200);
    const body = await JSON.parse(response.body);
	const cookie = body.token;
	console.log("cookie: ", cookie);
	console.log("body: ", body.message);
    expect(body.message).toBe('Login successful');
  });

    test('PATCH update_user_profile', async () => {

	const oldUser = await userServices.getUserByUsername('lena');
    const response = await fastify.inject({
      method: 'PATCH',
      url: '/api/update_user_profile',
      payload: {
        username: 'lenacik',
        password: 'lenacik'
      },
	  cookies: {
		token: cookie
	  }
    });

    const body = await JSON.parse(response.body);
	const updatedUser = await userServices.getUserByUsername('lenacik');
	console.log("updatedUser: ", updatedUser);
    expect(updatedUser).toBeDefined();
    expect(oldUser).toBeNull();
  });

});
