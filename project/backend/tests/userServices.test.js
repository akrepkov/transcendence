import * as userServices from '../database/services/userServices.js';
import * as authServices from '../database/services/authServices.js';
import * as gameServices from '../database/services/gameServices.js';
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
      newUser2 = await userServices.getUserByUsername('jan');
    }
    expect(newUser).toBeDefined();
    expect(newUser.username).toBe('lena');
    expect(newUser2).toBeDefined();
    expect(newUser2.username).toBe('jan');
  });

  test('registerting user with the same username', async () => {
    await authServices.registerUser({ username: 'lena', email: 'lena', password: 'lena' });
    const user = await userServices.getUserByUsername('lena');
    expect(user.email).toBe('lena@mail.com');
  });

  test('users table exists', async () => {
    const users = await userServices.getUsers();
    console.log(users);
    expect(Array.isArray(users)).toBe(true);
  });

  test('save user game results', async () => {
    const winner = await userServices.getUserByUsername('lena');
    const loser = await userServices.getUserByUsername('jan');
    const pong = await gameServices.savePong(winner.username, loser.username, 10, 2);
    expect(pong).toBeDefined();
    await userServices.saveGameResults('pong', winner.username, loser.username, pong);
    const updatedWinner = await prisma.user.findUnique({
      where: { username: 'lena' },
      include: { pong: true },
    });
    const updatedLoser = await prisma.user.findUnique({
      where: { username: 'jan' },
      include: { pong: true },
    });

    console.log('winner:', updatedWinner);
    console.log('loser:', updatedLoser);
    expect(updatedWinner.pongWins).toBe(1);
    expect(updatedWinner.pongLosses).toBe(0);
    expect(updatedLoser.pongLosses).toBe(1);
    expect(updatedLoser.pongWins).toBe(0);
    // Check that each user has exactly one game
    expect(updatedWinner.pong.length).toBe(1);
    expect(updatedLoser.pong.length).toBe(1);

    // Check that the saved game is the one you created
    expect(updatedWinner.pong[0].gameId).toBe(pong.gameId);
    expect(updatedLoser.pong[0].gameId).toBe(pong.gameId);
  });

  test('can add personalized avatar', async () => {
    const filepath = 'project/backend/uploads/avatars/avatar_1748704618618_apollo_baby.jpeg';
    const username = 'lena';
    const user = await userServices.uploadAvatarInDatabase(filepath, username);
    expect(user).toBeDefined();
    expect(user.avatar).toBe(filepath);
  });

  //   //   test('can retrieve avatar', async () => {
  //   //     const filepath = 'project/backend/uploads/avatars/avatar_1748704618618_apollo_baby.jpeg';
  //   //     const username = 'lena';
  //   //     const user = await userServices.getAvatarFromDatabase(username);
  //   //     console.log('avatar: ', username.avatar);
  //   //     expect(user).toBeDefined();
  //   //     expect(user.avatar).toBe(filepath);
  //   //   });

  //   test('can add friend', async () => {
  //     const username = 'lena';
  //     const friendName = 'jan';
  //     await userServices.addFriend(username, friendName);
  //     const user = await userServices.getUserByUsername(username);
  //     const friend = await userServices.getFriends(username);
  //     expect(user.friends).toBeNull(friend);
  //   });

  test('can delete user by username', async () => {
    await userServices.deleteUser('lena');
    await userServices.deleteUser('jan');
    const user1 = await userServices.getUserByUsername('lena');
    const user2 = await userServices.getUserByUsername('jan');
    expect(user1).toBeNull();
    expect(user2).toBeNull();
  });
});
