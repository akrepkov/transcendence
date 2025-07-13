import prisma from '../prisma/prismaClient.js';

// Register a new user
export async function registerUser({ username, email, password }) {
  // Check if the user does not exist already
  const existingUser = await prisma.user.findUnique({
    where: {
      OR: [{ username }, { email }],
    },
  });
  if (existingUser) {
    return null;
  }
  // Create the user
  return prisma.user.create({
    data: { username, email, password },
  });
}

// Find user by email
export async function checkCredentials({ email }) {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return null;
  }
  return user;
}

// Find user by username
export async function checkUniqueUsername(username) {
  const user = await prisma.user.findFirst({ where: { username } });
  if (!user) return null;
  return user;
}

// Get user by ID (optional helper)
export async function getUserById(userId) {
  return prisma.user.findUnique({ where: { userId } });
}
