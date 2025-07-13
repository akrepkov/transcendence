import * as userServices from '../database/services/userServices.js';
import path from 'path';
import fs from 'fs';
import pump from 'pump';
// import {handleError} from '../utils/utils.js';
// import jwt from 'jsonwebtoken';
// const JWT_SECRET = "" + process.env.JWT_SECRET; //using environmental variable for JWT secret
import { fileURLToPath } from 'url';
import { fileExists } from '../utils/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Returns all users registered in the db
const getAllUsersHandler = (request, reply) => {
  const users = userServices.getUsers(); // Retrieve all users from the database
  if (!users || users.length === 0) {
    return reply.status(404).send({ error: 'No users found' });
  }
  reply.send(users); // Send the list of users as the response
};

//automatically adds the game to the counter, records winner and looser
const saveWinnerHandler = (request, reply) => {
  const { winnerName, loserName } = request.body;
  if (!winnerName || !loserName) {
    return reply.status(400).send({ error: 'Player names are required' });
  }

  const gameId = gameServices.saveGame(winnerName, loserName);

  if (!userServices.saveGameResults(winnerName, loserName) || !gameId) {
    return reply.status(500).send({ error: 'Failed to save game results' });
  }

  reply.send({ message: 'Game results saved', gameId });
};

const uploadAvatarHandler = async (request, reply) => {
  try {
    let username = request.user.username;
    const data = await request.file();
    const filename = `avatar_${Date.now()}_${data.filename}`;
    const filepath = path.join(__dirname, '..', 'uploads', filename);
    pump(data.file, fs.createWriteStream(filepath));
    let avatarUrl = `../uploads/${filename}`;
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
    // console.log("Username in getAvatarHandler:", username); // Debugging
    let avatarFilepath = userServices.getAvatarFromDatabase(username);
    // console.log("Avatar URL:", avatarFilepath); // Debugging
    const fileExistsResult = await fileExists(avatarFilepath);
    if (!fileExistsResult) {
      console.log('Avatar not found, using default avatar'); // Debugging
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
    return reply.code(500).send({
      success: false,
      error: 'Failed to retrieve avatar',
    });
  }
};

export default {
  addUserHandler,
  getAllUsersHandler,
  deleteUserHandler,
  saveWinnerHandler,
  uploadAvatarHandler,
  getAvatarHandler,
};
