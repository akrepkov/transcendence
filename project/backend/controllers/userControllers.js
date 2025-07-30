import * as userServices from '../database/services/userServices.js';
import * as authServices from '../database/services/authServices.js';
import { JWT_SECRET } from '../config.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import pump from 'pump';
import fs from 'fs';
import * as utils from '../utils/utils.js';
import path from 'path';
import { connectionManager } from '../websocket/managers/connectionManager.js';

// Returns all users registered in the db (userId and username only)
const getAllUsersHandler = async (request, reply) => {
  try {
    const users = await userServices.getUsers();
    if (!users || users.length === 0) {
      return reply.status(404).send({ error: 'No users found' });
    }
    const safeUsers = users.map((user) => ({
      userId: user.userId,
      username: user.username,
    }));
    reply.send(safeUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return reply.code(500).send({ error: 'Internal server error' });
  }
};

// return user information, excluding email and password
const getUserProfileHandler = async (request, reply) => {
  try {
    const { userName } = request.body;
    const user = userServices.getUserByUsername(userName);
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }
    const { password, email, ...safeUser } = user;
    reply.send(safeUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return reply.code(500).send({ error: 'Internal server error' });
  }
};

// add a Friend (full match on name)
const addFriendHandler = async (request, reply) => {
  try {
    const { userName, friendUsername } = request.body;
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
    const requestUserId = request.user.userId;
    const user = await userServices.getUserById(requestUserId);
    console.log('userID: ', user);
    if (username) {
      const existUsername = await authServices.checkUniqueUsername(username);
      if (existUsername) {
        return handleError(reply, new Error('Username is already in use'), 500);
      }
      await userServices.updateUsername(user, username);
      await connectionManager.updateUsernameInConnections(user.userId, username);
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
    const updatedUser = await userServices.getUserById(user.userId);
    const { password: pwd, email: mail, ...safeUser } = updatedUser;
    console.log('updatedUser in code', safeUser);
    return reply.code(200).send({ success: true, user: safeUser });
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
    const fileExistsResult = await utils.fileExists(avatarFilepath);
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
  //   deleteFriendHandler,
};
