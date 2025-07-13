import db from '../index.js';
import bcrypt from 'bcrypt';
// import {handleError} from '../utils/utils.js';

//get(email) in sqlite3 is asynchronous,it returns promise, need await
export async function checkCredentials(email) {
  const user = await db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return null; // Return null if no user is found
  }
  // console.log("Type of function: ",typeof user.then); // Will be 'function' if it's a Promise and needs await
  return user;
}

export async function checkUniqueUsername(username) {
  const user = await db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) {
    return null; // Return null if no user is found
  }
  // console.log("Type of function: ",typeof user.then); // Will be 'function' if it's a Promise and needs await
  return user;
}
//bcrypt is asynchronous, I have to use await
export async function registerInDatabase(email, password, username) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const stmt = db.prepare('INSERT INTO users (email, password, username) VALUES (?, ?, ?)');
  const info = stmt.run(email, hashedPassword, username);
  return info;
}

// Export the database instance for direct use if needed
export default db;

//if use better-sqlite - everything should be async
