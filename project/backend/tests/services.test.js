import * as userServices from './userServices.js';
import * as gameServices from './gameServices.js';
import * as authServices from './authServices.js';

describe('userServices', () => {
  test('getUsers returns an array', async () => {
    const users = await userServices.getUsers();
    expect(Array.isArray(users)).toBe(true);
  });

  test('saveGameResults returns true for valid users', async () => {
    // Make sure these users exist in your test DB!
    const result = await userServices.saveGameResults('winnerUsername', 'loserUsername');
    expect(result).toBe(true);
  });

  test('uploadAvatarInDatabase updates avatar path', async () => {
    const username = 'testuser'; // Make sure this user exists
    const filepath = '/uploads/avatars/testuser.png';
    const user = await userServices.uploadAvatarInDatabase(filepath, username);
    expect(user.avatar).toBe(filepath);
  });

  test('getAvatarFromDatabase returns avatar path', async () => {
    const username = 'testuser'; // Make sure this user exists and has an avatar
    const avatar = await userServices.getAvatarFromDatabase(username);
    expect(typeof avatar).toBe('string');
    expect(avatar).toMatch(/\.png$/);
  });
});
