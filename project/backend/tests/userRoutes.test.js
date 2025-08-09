import { PrismaClient } from '@prisma/client';
import Fastify from 'fastify';
import userRoutes from '../routes/userRoutes.js';
import * as userServices from '../database/services/userServices.js';
import cookie from '@fastify/cookie';
import FormData from 'form-data';
import fs from 'fs';
import util from 'util';
import fastifyMultipart from '@fastify/multipart';


await userServices.deleteUser('lena');

describe('User Routes', () => {
	let fastify;
	let authCookie;
	const prisma = new PrismaClient();
	beforeAll(async () => {
		fastify = Fastify();
		fastify.register(cookie);
		fastify.register(fastifyMultipart);
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
	console.log("cookie after login: ", authCookie);
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
	console.log('Response body:\n', JSON.stringify(body, null, 2));
	const user = await userServices.getUserByUsername(body.username);
    expect(response.statusCode).toBe(200);
    expect(user.username).toBe('lena');
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

// TEST UPDATE USER PROFILE (AVATAR UPLOAD)
// curl -X PATCH https://localhost:3000/api/update_user_profile \
//   -F "avatar=@/Users/mbp14/Downloads/loki_mad.webp" \              
//  -H "cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzMCwic2Vzc2lvbklkIjoiNTJmZjQ0OWNkYzIzYmFiYjZjOGFiOWM5ZjVkNzRiY2NiMmJiNmU2OTMyNjhhODE2NDc5ZjQwOWZmNWFmNTE5ZiIsImlhdCI6MTc1NDc0NjU5MywiZXhwIjoxNzU0NzUwMTkzfQ.KAgFGavQWfl4mzyL_BNtJiPhTykRhzO1x-jj70EIxhI" -k



//  curl -X GET https://localhost:3000/api/view_user_profile?username=lena -H "Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzMCwic2Vzc2lvbklkIjoiNTJmZjQ0OWNkYzIzYmFiYjZjOGFiOWM5ZjVkNzRiY2NiMmJiNmU2OTMyNjhhODE2NDc5ZjQwOWZmNWFmNTE5ZiIsImlhdCI6MTc1NDc0NjU5MywiZXhwIjoxNzU0NzUwMTkzfQ.KAgFGavQWfl4mzyL_BNtJiPhTykRhzO1x-jj70EIxhI" -k
