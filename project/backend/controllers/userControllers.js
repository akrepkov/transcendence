import * as userServices from '../database/services/userServices.js';
import { JWT_SECRET } from '../config.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import pump from 'pump';

// Returns all users registered in the db
const getAllUsersHandler = async (request, reply) => {
  try {
    const users = await userServices.getUsers();
    if (!users || users.length === 0) {
      return reply.status(404).send({ error: 'No users found' });
    }
    reply.send(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return reply.code(500).send({ error: 'Internal server error' });
  }
};

const getUserProfileHandler = async (request, reply) => {
  try {
    const { userName } = request.body;
    const user = userServices.getUserByUsername(username);
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }
    reply.send(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return reply.code(500).send({ error: 'Internal server error' });
  }
};

const addFriendHandler = async (request, reply) => {
  try {
    if (!userName || !friendUsername) {
      return reply.status(404).send({ error: 'User/Friend name not found' });
    }
    if (!(await userServices.addFriend(userName, friendUsername))) {
      return reply.status(404).send({ error: 'Error adding friend' });
    }
    return reply.code(200).send({ success: true });
  } catch (error) {
    console.error('Adding friend error:', error);
    return reply.code(500).send({ error: 'Internal server error' });
  }
};

const updateUserHandler = async (request, reply) => {
  try {
    const { username, email, password, avatar } = request.body;
    const user = request.user;
    if (username) {
      await userServices.updateUsername(user, username);
      const user = await userServices.getUserByUsername(username);
      let userId = user.userId;
      let username = user.username;
      const sessionId = crypto.randomBytes(32).toString('hex');
      const token = jwt.sign({ userId, username, sessionId }, JWT_SECRET, { expiresIn: '1h' });
      reply.setCookie('token', token, {
        httpOnly: true, //The cookie cannot be accessed via JavaScript
        secure: true, //The cookie will only be sent over HTTPS connections.
        sameSite: 'Strict', //The cookie will only be sent for requests originating from the same site.
        path: '/', // Cookie is available on all routes
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //After this time, the browser will automatically remove the cookie.
      });
    }
    if (email) {
      await userServices.updateEmail(user, email);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await userServices.updatePassword(user, hashedPassword);
    }
    if (avatar) {
      await uploadAvatarHandler(request, reply);
    }
    const updatedUser = await userServices.getUserByUsername(username);
    return reply.code(200).send({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating user', error);
    return reply.code(500).send({ error: 'Internal server error' });
  }
};

const uploadAvatarHandler = async (request, reply) => {
  try {
    let username = request.user.username;
    const data = await request.file();
    const filename = `avatar_${Date.now()}_${data.filename}`;
    const filepath = path.join(__dirname, '..', 'uploads', filename);
    pump(data.file, fs.createWriteStream(filepath));
    let avatarUrl = `../uploads/avatars/${filename}`;
    userServices.uploadAvatarinDatabase(avatarUrl, username);
    return reply.code(200).send({
      success: true,
      avatar: avatarUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return reply.code(500).send({
      success: false,
      error: 'Upload failed',
    });
  }
};

const getAvatarHandler = async (request, reply) => {
  try {
    let username = request.user.username;
    let avatarFilepath = userServices.getAvatarFromDatabase(username);
    const fileExistsResult = await fileExists(avatarFilepath);
    if (!fileExistsResult) {
      console.log('Avatar not found, using default avatar');
      avatarFilepath = '../uploads/default_avatar.jpg';
    }
    if (!avatarFilepath) {
      return reply.code(404).send({ error: 'Avatar not found' });
    }
    return reply.send({
      success: true,
      avatar: avatarFilepath,
    });
  } catch (error) {
    console.error('Get avatar error:', error);
    return reply.code(500).send({ success: false, error: 'Failed to retrieve avatar' });
  }
};

export default {
  getAllUsersHandler,
  getUserProfileHandler,
  updateUserHandler,
  addFriendHandler,
  uploadAvatarHandler,
  getAvatarHandler,
  deleteFriendHandler,
};
