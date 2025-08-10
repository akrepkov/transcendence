import * as userServices from '../database/services/userServices.js';
import * as authServices from '../database/services/authServices.js';
import { JWT_SECRET } from '../config.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import pump from 'pump';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as utils from '../utils/utils.js';
import path from 'path';
import { connectionManager } from '../websocket/managers/connectionManager.js';
import { Console } from 'console';
import { pipeline } from 'stream/promises';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

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
    const { username } = request.query;
    const user = await userServices.getUserByUsername(username);
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
    const { username, friendUsername } = request.body;
    if (!username || !friendUsername) {
      return reply.status(404).send({ error: 'User/Friend name not found' });
    }
    if (!(await userServices.addFriend(username, friendUsername))) {
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
    const userId = request.user.userId;
    const user = await userServices.getUserById(userId);
    const parts = request.parts();
    let username, email, password, avatarPart, oldName;
    let avatarBuf = null;
    let avatarName = null;
    let avatarMime = null;
    for await (const part of parts) {
      if (part.fieldname === 'username') {
        username = part.value;
      } else if (part.fieldname === 'password') {
        password = part.value;
      } else if (part.fieldname === 'email') {
        email = part.value;
      } else if (part.file && part.fieldname === 'avatar') {
        let totalBytes = 0;
        const chunks = [];
        for await (const chunk of part.file) {
          totalBytes += chunk.length;
          if (totalBytes >= 1 * 1024 * 1024) {
            return reply.code(418).send({ error: 'File too large' });
          }
          chunks.push(chunk);
        }
        avatarBuf = Buffer.concat(chunks);
        avatarName = part.filename;
        avatarMime = part.mimetype;
      } else {
        if (part.file) part.file.resume();
      }
    }
    if (username) {
      const existUsername = await authServices.checkUniqueUsername(username);
      if (existUsername) {
        return reply.code(500).send({ error: 'Username already in use' });
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
    if (avatarBuf) {
      await uploadAvatarHandler(
        { buffer: avatarBuf, filename: avatarName, mimetype: avatarMime },
        user.username,
      );
    }
    const updatedUser = await userServices.getUserById(userId);
    const updatedAvatar = updatedUser.avatar;
    return reply.code(200).send({ success: true, avatarUrl: updatedAvatar });
  } catch (error) {
    console.error('Error updating user', error);
    return reply.code(500).send({ error: 'Internal server error' });
  }
};

function extFrom(mimetype) {
  const ext = mimetype.includes('.') ? n.slice(n.lastIndexOf('.')).toLowerCase() : '';
  if (ext) return ext;
  const mime = (mimetype || '').toLowerCase();
  if (mime.includes('png')) return '.png';
  if (mime.includes('webp')) return '.webp';
  if (mime.includes('jpeg') || mime.includes('jpg')) return '.jpg';
  return '.jpg';
}

const uploadAvatarHandler = async (avatar, username) => {
  try {
    const ext = extFrom(avatar.mimetype);
    const safeUser = String(username).replace(/[^\w.-]+/g, '_');
    const filename = `avatar_${safeUser}_${Date.now()}${ext}`;
    const filepath = path.join(__dirname, '..', 'uploads', 'avatars', filename);
    const writeStream = fs.createWriteStream(filepath);
    await pipeline(Readable.from(avatar.buffer), fs.createWriteStream(filepath));
    const oldAvatar = await userServices.getAvatarFromDatabase(username);
    if (oldAvatar && utils.isDefaultAvatar(oldAvatar) == false) {
      const oldAbsolutePath = path.join(__dirname, '..', oldAvatar);
      try {
        await fsPromises.unlink(oldAbsolutePath);
      } catch (e) {
        if (e.code !== 'ENOENT') console.warn('unlink failed:', oldAbsolutePath, e.message);
      }
    }
    await userServices.uploadAvatarInDatabase(path.join('uploads', 'avatars', filename), username);
    return true;
  } catch (error) {
    console.error('Upload avatar error:', error);
    return false;
  }
};

const getAvatarHandler = async (request, reply) => {
  try {
    let username = request.user.username;
    let avatarFilepath = await userServices.getAvatarFromDatabase(username);
    const fileExistsResult = await utils.fileExists(avatarFilepath);
    if (!fileExistsResult) {
      console.log('Avatar not found');
      return false;
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
