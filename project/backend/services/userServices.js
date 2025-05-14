import db from '../database/index.js';
// import {handleError} from '../utils/utils.js';

// Function to insert a user
export function addUser(username) {
    const checkUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (checkUser) {
        console.log("User already exists:", checkUser);
        return ;
    }
    const stmt = db.prepare('INSERT INTO users (username) VALUES (?)');
    const info = stmt.run(username);
    return info.lastInsertRowid;
}

// Function to get all users
export function getUsers() {
    return db.prepare('SELECT * FROM users').all();
    
}

// Function to get a user by ID
export function getUserById(id) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

export function getUserByEmail(email){
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

export function addPlayers(player1, player2) {
    console.log('In userServices players:', player1, player2);
    const info1 = addUser(player1);
    const info2 = addUser(player2);
    return [info1, info2];
}


export function deleteUser(username) {
    const stmt = db.prepare('DELETE FROM users WHERE username = ?');
    const info = stmt.run(username);
    console.log("Delete result:", info);
    return info.changes > 0;
}


//Not working yet
export function saveGameResults(player1, player2, winner_name) {
    const user1 = db.prepare('SELECT * FROM users WHERE username = ?').get(player1);
    const user2 = db.prepare('SELECT * FROM users WHERE username = ?').get(player2);

    if (!user1 || !user2) {
        console.log("One or both players not found in the database");
        return;
    }
    const winner = db.prepare('SELECT * FROM users WHERE username = ?').get(winner_name);
    if (!winner) {
        console.log("Winner not found in the database");
        return;
    }
    const stmt = db.prepare('INSERT INTO games (player1_id, player2_id) VALUES (?, ?)');
    const info = stmt.run(user1.id, user2.id);
    return info.lastInsertRowid;
}


export function uploadAvatarinDatabase(filepath, username) {
    const checkUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!checkUser) {
        console.log("User doesn't exist:", username);
        return ;
    }
    const stmt = db.prepare('UPDATE users SET avatar = ? WHERE username = ?');
    stmt.run(filepath, username);
}

export function getAvatarFromDatabase(username) {
    const checkUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!checkUser) {
        console.log("User doesn't exist:", username);
        return ;
    }
    const stmt = db.prepare('SELECT avatar FROM users WHERE username = ?');
    const info = stmt.get(username);
    return info.avatar;
}
