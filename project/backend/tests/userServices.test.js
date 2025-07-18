import * as userServices from '../database/services/userServices.js';
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
    let newUser2 = await authServices.registerUser({
      username: 'jan',
      email: 'jan@mail.com',
      password: 'jan',
    });
    if (!newUser2) {
      newUser = await userServices.getUserByUsername('jan');
    }
    expect(newUser).toBeDefined();
    expect(newUser.username).toBe('lena');
    expect(newUser2).toBeDefined();
    expect(newUser2.username).toBe('lena');
  });

  test('users table exists', async () => {
    const users = await userServices.getUsers();
    expect(Array.isArray(users)).toBe(true);
  });

  test('save user game results', async () => {
    const winner = await userServices.getUserByUsername('lena');
    const loser = await userServices.getUserByUsername('jan');
    await userServices.saveGameResults(winner.username, loser.username);

    expect(winner.wins).toBe(1);
    expect(winner.losses).toBe(0);
    expect(loser.losses).toBe(1);
    expect(loser.losses).toBe(1);
    expect(loser.games).toBe(1);
    expect(winner.games).toBe(1);
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

  test('can add friend', async () => {
    const username = 'lena';
    const friendName = 'jan';
    await userServices.addFriend(username, friendName);
    const user = await userServices.getUserByUsername(username);
    const friend = await userServices.getUserByEmail(friendName);
    expect(user.friends).toBeNull(friend);
  });

  test('can delete user by username', async () => {
    const username = 'lena';
    await userServices.deleteUser(username);
    const user = await userServices.getUserByUsername(username);
    expect(user).toBeNull();
  });
});
