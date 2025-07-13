import { loginHandler } from '../src/routes/login.js';
import * as authServices from '../src/services/auth.js';
import bcrypt from 'bcrypt';

jest.unstable_mockModule('bcrypt', () => ({
  compare: jest.fn(),
}));

jest.mock('../src/services/auth.js');

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
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    await loginHandler({ body: { email: 'x@y.com', password: 'abc' } }, mockReply);
    expect(mockReply.setCookie).toHaveBeenCalled();
    expect(mockReply.status).toHaveBeenCalledWith(200);
  });
});
