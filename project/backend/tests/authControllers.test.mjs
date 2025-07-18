// authControllers.test.mjs
import { jest } from '@jest/globals';

jest.unstable_mockModule('bcrypt', () => ({
  compare: jest.fn(),
}));

jest.mock('../src/services/auth.js');

const { loginHandler } = await import('../src/routes/login.js');
const authServices = await import('../src/services/auth.js');
const bcrypt = await import('bcrypt');

describe('loginHandler', () => {
  let mockReply;

  beforeEach(() => {
    mockReply = {
      setCookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  test('rejects missing email/password', async () => {
    await loginHandler({ body: {} }, mockReply);
    expect(mockReply.status).toHaveBeenCalledWith(400);
  });

  test('rejects invalid credentials', async () => {
    authServices.checkCredentials.mockResolvedValue(null);
    await loginHandler({ body: { email: 'x@y.com', password: 'abc' } }, mockReply);
    expect(mockReply.status).toHaveBeenCalledWith(401);
  });

  test('authenticates valid credentials', async () => {
    authServices.checkCredentials.mockResolvedValue({ password: 'hashed', username: 'user1' });
    bcrypt.compare.mockResolvedValue(true);
    await loginHandler({ body: { email: 'x@y.com', password: 'abc' } }, mockReply);
    expect(mockReply.setCookie).toHaveBeenCalled();
    expect(mockReply.status).toHaveBeenCalledWith(200);
  });
});
