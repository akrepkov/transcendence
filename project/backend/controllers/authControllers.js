import * as authServices from '../database/services/authServices.js';
import * as userServices from '../database/services/userServices.js';
import { handleError } from '../utils/utils.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { JWT_SECRET } from '../config.js';

const loginHandler = async (request, reply) => {
  const { username, password } = request.body;
  if (!username || !password) {
    return handleError(reply, new Error('Username and password are required'), 400);
  }
  const user = await authServices.checkUniqueUsername(username);
  if (!user) {
    return handleError(reply, new Error('Invalid credentials'), 401);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return handleError(reply, new Error('Invalid credentials'), 401);
  }
  let userId = user.userId;
  const sessionId = crypto.randomBytes(32).toString('hex');
  const token = jwt.sign({ userId, username, sessionId }, JWT_SECRET, { expiresIn: '1h' });
  // Set the JWT in an HTTP-only cookie
  reply.setCookie('token', token, {
    httpOnly: true, // Ensures it's not accessible via JavaScript
    secure: true,
    sameSite: 'Strict', // Prevents cross-site request forgery attacks
    path: '/', // Cookie is available on all routes
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });
  return reply.status(200).send({
    message: 'Login successful',
    username: user.username,
  });
};

const registerHandler = async (request, reply) => {
  const { email, password, username } = request.body;
  console.log('Incoming data:', { email, username, password });

  if (!email || !password || !username) {
    return handleError(reply, new Error('Email, username and password are required'), 400);
  }
  const existUsername = await authServices.checkUniqueUsername(username);
  if (existUsername) {
    return handleError(reply, new Error('Username or email is already in use'), 500);
  }
  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
  try {
    const registerUser = await authServices.registerUser({
      email,
      password: hashedPassword,
      username,
    });
    if (!registerUser) {
      return handleError(reply, new Error('Registration failed'), 500);
    }
    let userId = registerUser.userId;
    const sessionId = crypto.randomBytes(32).toString('hex');
    const token = jwt.sign({ userId, username, sessionId }, JWT_SECRET, { expiresIn: '1h' });
    // Set the JWT in an HTTP-only cookie
    reply.setCookie('token', token, {
      httpOnly: true, // Ensures it's not accessible via JavaScript
      secure: true,
      sameSite: 'Strict', // Prevents cross-site request forgery attacks
      path: '/', // Cookie is available on all routes
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    return reply.status(201).send({ message: 'Registration successful' });
  } catch (err) {
    console.error('Registration error:', err);
    return handleError(reply, new Error('Registration failed'), 500);
  }
};

const logoutHandler = async (request, reply) => {
  console.log('Logout request received');
  reply.clearCookie('token', { path: '/' });
  reply.send({ message: 'Logged out successfully' });
};

const authenticate = async (request, reply) => {
  const token = await request.cookies.token;
  if (!token) {
    return handleError(reply, new Error('Unauthorized: No token'), 401);
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    request.user = payload; //attach info to request, so when i continue with routes i can access user email : request.user.email (I had this info passed when created the token)
  } catch (err) {
    return handleError(reply, err, 401);
  }
};

const verificationHandler = async (request, reply) => {
  const token = await request.cookies.token;
  if (!token) {
    // console.log("No token in verificationHandler");
    return handleError(reply, new Error('Unauthorized: No token'), 401);
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log("Decoded in verificationHandler: ", decoded);
    const user = await authServices.checkCredentials(decoded.email);
    if (!user) {
      return handleError(reply, new Error('Invalid credentials'), 401);
    }
    let username = user.username;
    reply.send({ user: decoded, username });
  } catch (err) {
    return handleError(reply, err, 401);
  }
};

const getUserFromRequest = async (request, reply) => {
  try {
    const token = await request.cookies.token;
    if (!token) {
      return handleError(reply, new Error('Unauthorized: No token'), 401);
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log("EMAIL in getUserFromRequest: ", decoded.email);
    let user = userServices.getUserByEmail(decoded.email);
    if (!user) {
      return handleError(reply, new Error('Invalid credentials'), 401);
    }
    request.user = user; // Attach user to request object
  } catch (error) {
    console.error('getUserFromRequest:', error);
    return handleError(reply, error, 401);
  }
};

const authenticateSocketConnection = (request, socket) => {
  const token = request.cookies.token;
  if (!token) {
    console.log('No token found in socket connection');
    socket.close(1008, 'No token provided');
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Succes decoding token for the socket connection, decoded token: ', decoded);
    return decoded;
  } catch (error) {
    console.error('%c Token verification failed, with error: ', 'color:red', error.message);
    socket.close(1008, 'Invalid token: ' + error.name + ': ' + error.message);
    return;
  }
};

export default {
  loginHandler,
  registerHandler,
  logoutHandler,
  verificationHandler,
  authenticate,
  getUserFromRequest,
  authenticateSocketConnection,
};

// Plan:

// 4. Handle JWT Expiration:
// Since your JWT expires in 1 hour (expiresIn: '1h'), you'll want to handle token expiration
// on the frontend. After the token expires, you can prompt the user to log in again or implement
// a refresh token mechanism to extend their session.

// Refresh Tokens: A refresh token is a long-lived token that is used to obtain a new JWT when
// the original expires. You can implement this by issuing a refresh token alongside the access token (JWT)
// and store the refresh token in the database.
