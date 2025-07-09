import prisma from '../../prisma/prismaClient.js';
import bcrypt from 'bcrypt';

// Register a new user
export async function registerUser({ username, email, password }) {
  const existingUser = await prisma.user.findUnique({
    where: {
      OR: [{ username }, { email }],
    },
  });
  if (existingUser) {
    return 418;
  }
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  return prisma.user.create({
    data: { username, email, password: hashedPassword },
  });
}

// Authenticate user (login)
export async function authenticateUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  // Optionally, remove password before returning user object
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Get user by ID (optional helper)
export async function getUserById(userId) {
  return prisma.user.findUnique({ where: { userId } });
}
