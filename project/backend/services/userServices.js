import db from '../database/index.js';
// import {handleError} from '../utils/utils.js';

// Function to insert a user
export function addUser(username) {
  const checkUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (checkUser) {
    console.log('User already exists:', checkUser);
    return;
  }
  const stmt = db.prepare('INSERT INTO users (username) VALUES (?)');
  const info = stmt.run(username);
  return info.lastInsertRowid;
}

// Function to get all users
export function getUsers() {
  return db.prepare('SELECT * FROM users').all();
}

// NOT USING RIGHT NOW, MIGHT BE NEEDED FOR COMMUNICATION BETWEEN TABLES??????
// Function to get a user by ID
// export function getUserById(id) {
//     return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
// }

export function getUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

export function deleteUser(username) {
  const stmt = db.prepare('DELETE FROM users WHERE username = ?');
  const info = stmt.run(username);
  console.log('Delete result:', info);
  return info.changes > 0;
}

//Not working yet
export function saveGameResults(winner_name, loser_name) {
  const winner = db.prepare('SELECT * FROM users WHERE username = ?').get(winner_name);
  const loser = db.prepare('SELECT * FROM users WHERE username = ?').get(loser_name);
  if (!winner || !loser) {
    console.log('Player not found in the database');
    return;
  }
  const stmt = db.prepare('UPDATE users SET wuins = wins + 1 where username = ?').run(winner_name);
  const stmt2 = db
    .prepare('UPDATE users SET losses = losses + 1 where username = ?')
    .run(loser_name);
  const stmt3 = db
    .prepare('UPDATE users SET games = games + 1 where username = (?, ?)')
    .run(winner_name, loser_name);
  if (!stmt || !stmt2 || !stmt3) {
    console.log('Failed to update game results');
    return;
  }
  return info.lastInsertRowid;
}

export function uploadAvatarinDatabase(filepath, username) {
  const checkUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!checkUser) {
    console.log("User doesn't exist:", username);
    return;
  }
  const stmt = db.prepare('UPDATE users SET avatar = ? WHERE username = ?');
  stmt.run(filepath, username);
}

export function getAvatarFromDatabase(username) {
  const checkUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!checkUser) {
    console.log("User doesn't exist:", username);
    return;
  }
  const stmt = db.prepare('SELECT avatar FROM users WHERE username = ?');
  const info = stmt.get(username);
  return info.avatar;
}
