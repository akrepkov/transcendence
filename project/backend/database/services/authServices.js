import prisma from '../prisma/prismaClient.js';
import { getRandomAvatar } from '../../utils/utils.js';

// Register a new user
export async function registerUser({ username, email, password }) {
  if (!username || !email || !password) {
    console.error('Some data is missing:');
    return null;
  }
  try {
    const existingUser = await prisma.user.findFirst({
      where: { username },
    });
    if (existingUser) {
      return null;
    }
    const filepath = await getRandomAvatar();
    return await prisma.user.create({
      data: { username, email, password, avatar: filepath },
    });
  } catch (error) {
    console.error('Error in registerUser:', error);
    return null;
  }
}

// Find user by email
export async function checkCredentials(email) {
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return null;
    }
    const { password, ...safeUser } = user;
    return safeUser;
  } catch (error) {
    console.error('Error in checkCredentials:', error);
    return null;
  }
}

// Find user by username
export async function checkUniqueUsername(username) {
  try {
    const user = await prisma.user.findFirst({ where: { username } });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error in checkUniqueUsername:', error);
    return null;
  }
}

// Get user by ID (optional helper)
export async function getUserById(userId) {
  try {
    return await prisma.user.findUnique({
      where: { userId },
      select: { username: true },
    });
  } catch (error) {
    console.error('Error in getUserById:', error);
    return null;
  }
}
