import * as fsPromises from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//handleError() expects an Error object (or at least something with .message)
export function handleError(reply, error, statusCode = 500) {
  console.error('\x1b[31mError: %s\x1b[0m', error);
  reply.status(statusCode).send({ error: error.message || 'Internal Server Error' });
}

export async function fileExists(filePath) {
  try {
    let avatarFilepath = path.resolve(__dirname, filePath);
    // console.log("Checking file path:", filePath); // Debugging
    const stats = await fsPromises.stat(avatarFilepath); // Await fs.promises.stat() to get file stats
    // console.log("File stats:", stats); // Debugging
    return stats.isFile(); // Return true if it's a file
  } catch (err) {
    console.error('Error checking file:', err); // Debugging
    return false; // Return false if the file doesn't exist or another error occurs
  }
}

export async function getRandomAvatar() {
  const avatarDir = path.join(__dirname, '..', 'uploads', 'default');
  const files = fs.readdirSync(avatarDir);
  if (files.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * files.length);
  return path.join('/uploads', 'default', files[randomIndex]);
}

export async function isDefaultAvatar(avatarPath) {
  if (typeof avatarPath !== 'string') return false;
  return path.basename(avatarPath).startsWith('default_');
}
