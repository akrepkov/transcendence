import * as userServices from '../services/userServices.js';
import path from 'path';
import fs from 'fs';
import pump from 'pump';
// import jwt from 'jsonwebtoken';
// const JWT_SECRET = "" + process.env.JWT_SECRET; //using environmental variable for JWT secret
import { fileURLToPath } from 'url';
import { fileExists } from '../utils/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import {handleError} from '../utils/utils.js';


const addUserHandler = (request, reply) => {
    const { username } = request.body;
    if (!username) {
        return reply.status(400).send({ error: 'username is required' });
    }
    const userId = userServices.addUser(username);
    reply.send({ id: userId, username });
}

const getAllUsersHandler = (request, reply) => {
    const users = userServices.getUsers();  // Retrieve all users from the database
    if (!users || users.length === 0) {
        return reply.status(404).send({ error: 'No users found' });
    }
    reply.send(users);  // Send the list of users as the response
}

const deleteUserHandler = (request, reply) => {
    const { username } = request.body;
    // console.log("Deleting user with username:", username); // Debugging
    if (!username) {
        return reply.status(400).send({ error: 'username is required' });
    }
    const success = userServices.deleteUser(username)
    if (!success) {
        return reply.status(404).send({ error: 'User not found' });
    }
    reply.send({ success: true, username });
}

//automatically adds the game to the counter
const saveWinnerHandler = (request, reply) => {
    const {winner_name, loser_name } = request.body;
    if (!winner_name || !loser_name) {
        return reply.status(400).send({ error: 'Player names are required' });
    }
    const gameId = userServices.saveGameResults(player1, player2, winner_name);
    if (!gameId) {
        return reply.status(500).send({ error: 'Failed to save game results' });
    }
    reply.send({ message: 'Game results saved', gameId });
}


const uploadAvatarHandler = async (request, reply) => {
    try {
        let username = request.user.username;
        const data = await request.file();
        const filename = `avatar_${Date.now()}_${data.filename}`;
        const filepath = path.join(__dirname, '..', 'uploads', filename);
        pump(data.file, fs.createWriteStream(filepath));
        let avatarUrl = `../uploads/${filename}`;
        userServices.uploadAvatarinDatabase(avatarUrl, username);
        return (reply.code(200).send({
            success: true,
            avatar: avatarUrl
        }));
    } catch (error) {
        console.error('Upload error:', error);
        return reply.code(500).send({
            success: false,
            error: 'Upload failed'
        });
    }
}

const getAvatarHandler = async (request, reply) => {
    try {
        let username = request.user.username;
        console.log("Username in getAvatarHandler:", username); // Debugging
        let avatarFilepath = userServices.getAvatarFromDatabase(username);
        console.log("Avatar URL:", avatarFilepath); // Debugging
        const fileExistsResult = await fileExists(avatarFilepath);
        if (!fileExistsResult) {
            console.log("Avatar not found, using default avatar"); // Debugging
            avatarFilepath = "../uploads/default_avatar.jpg";
        }
        if (!avatarFilepath) {
            return reply.code(404).send({ error: 'Avatar not found' });
        }
        return reply.send({
            success: true,
            avatar: avatarFilepath
        });
    } catch (error) {
        console.error('Get avatar error:', error);
        return reply.code(500).send({
            success: false,
            error: 'Failed to retrieve avatar'
        });
    }
}

export default {
    addUserHandler,
    getAllUsersHandler,
    deleteUserHandler,
    saveWinnerHandler,
    uploadAvatarHandler,
    getAvatarHandler
};

