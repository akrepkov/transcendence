import * as userRoutes from '../routes/userRoutes.js'
import { PrismaClient } from '@prisma/client';


describe('Routes tests', () => {
  const prisma = new PrismaClient();

  afterAll(async () => {
	await prisma.$disconnect();
  });

  test('/api/auth/register', async () => {
	let username = 'lena';
	let email = 'lena@lena.com';
	let password = 'lena';
	
	expect(newUser).toBeDefined();
	expect(newUser.username).toBe('lena');
	expect(newUser2).toBeDefined();
	expect(newUser2.username).toBe('jan');
  });
});
