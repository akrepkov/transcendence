import { PrismaClient } from '@prisma/client';
import Fastify from 'fastify';
import userRoutes from '../routes/userRoutes.js';
import * as userServices from '../database/services/userServices.js';
import cookie from '@fastify/cookie';

describe('User Routes', () => {
	let fastify;
	let authCookie;
	const prisma = new PrismaClient();
	beforeAll(async () => {
		fastify = Fastify();
		fastify.register(cookie);
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
	expect(response.statusCode).toBe(201);
	expect(body.message).toBe('Registration successful');
  });

    test('POST /api/auth/login', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        username: 'lena',
        password: 'lena'
      },
	cookies: {
		token: authCookie
		}
    });
    expect(response.statusCode).toBe(200);
    const body = await JSON.parse(response.body);
	authCookie = body.token;
	// console.log("cookie after login: ", authCookie);
	// console.log("body: ", body.message);
    expect(body.message).toBe('Login successful');
  });

//     test('POST add_friend', async () => {
//     const response = await fastify.inject({
//       method: 'POST',
//       url: '/api/add_friend',
//       payload: {
//         username: 'lena',
//         friendUsername: 'djoyke',
//       },
// 	  	cookies: {
// 		token: authCookie
// 		}
//     });
// 	console.log("status code ", response.statusCode);
// 	const user = await userServices.getUserByUsername('lena');
// 	const friend = await userServices.getUserByUsername('djoyke');
// 	console.log("lena's friends: ", user.friends[0]);
//     expect(response.statusCode).toBe(200);
//     expect(user.friends[0].username).toBe(friend.username);
//   });

    test('GET /api/view_user_profile', async () => {
	const response = await fastify.inject({
      method: 'GET',
      url: '/api/view_user_profile?username=lena',
	  cookies: {
		token: authCookie
		}
	});
    const body = await JSON.parse(response.body);
	const user = await userServices.getUserByUsername(body.username);
	console.log("user: ", user);
    expect(response.statusCode).toBe(200);
    expect(user.username).toBe('lena');
  });

    test('PATCH update_user_profile', async () => {
	// console.log("cookie in test PATCH: ", authCookie);
	const oldUser = await userServices.getUserByUsername('lena');
    const response = await fastify.inject({
      method: 'PATCH',
      url: '/api/update_user_profile',
      payload: {
        username: 'lenacik',
        password: 'lenacik',
      },
	  cookies: {
		token: authCookie
	  }
    });
    const body = await JSON.parse(response.body);
	// console.log("body: ", body);
	const updatedUser = await userServices.getUserByUsername('lenacik');
	const findOldUser = await userServices.getUserByUsername('lena');
	// console.log("updatedUser: ", updatedUser);
    expect(updatedUser).toBeDefined();
    expect(findOldUser).toBeNull();
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
});


await userServices.deleteUser('lena');
await userServices.deleteUser('lenacik');
