import * as userServices from '../database/services/userServices.js';
import * as gameServices from '../database/services/gameServices.js';
import * as authServices from '../database/services/authServices.js';
import { PrismaClient } from '@prisma/client';

describe('Prisma direct database tests', () => {
  const prisma = new PrismaClient();

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('can insert a new user', async () => {
    let newUser = await authServices.registerUser({
      username: 'lena',
      email: 'lena@mail.com',
      password: 'lena',
    });
    if (!newUser) {
      newUser = await userServices.getUserByUsername('lena');
    }
    expect(newUser).toBeDefined();
    expect(newUser.username).toBe('lena');
  });

  test('users table exists', async () => {
    // Try to query users table; if it doesn't exist, this will throw
    const users = await userServices.getUsers();
    expect(Array.isArray(users)).toBe(true);
  });

  test('can fetch user by email', async () => {
    const email = 'lena@mail.com';
    const user = await userServices.getUserByEmail(email);
    expect(user).toBeDefined();
    expect(user.email).toBe('lena@mail.com');
  });

  test('can add personalized avatar', async () => {
    const filepath = 'project/backend/uploads/avatars/avatar_1748704618618_apollo_baby.jpeg';
    const username = 'lena';
    const user = await userServices.uploadAvatarInDatabase(filepath, username);
    expect(user).toBeDefined();
    expect(user.avatar).toBe(filepath);
  });

  //   test('can retrieve avatar', async () => {
  //     const filepath = 'project/backend/uploads/avatars/avatar_1748704618618_apollo_baby.jpeg';
  //     const username = 'lena';
  //     const user = await userServices.getAvatarFromDatabase(username);
  //     console.log('avatar: ', username.avatar);
  //     expect(user).toBeDefined();
  //     expect(user.avatar).toBe(filepath);
  //   });

  test('can delete user by username', async () => {
    const username = 'lena';
    await userServices.deleteUser(username);
    const user = await userServices.getUserByUsername(username);
    expect(user).toBeNull();
  });
});
