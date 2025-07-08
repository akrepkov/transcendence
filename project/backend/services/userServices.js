import prisma from '../../prisma/prismaClient.js';

// Add a new user
export async function addUser({ username, email, password }) {
  // You may want to hash the password before saving!
  return prisma.user.create({
    data: { username, email, password },
  });
}

// Get all users
export async function getUsers() {
  return prisma.user.findMany();
}

// Get user by email
export async function getUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

// Delete user by username
export async function deleteUser(username) {
  const deleted = await prisma.user.deleteMany({
    where: { username },
  });
  return deleted.count > 0;
}

// Save game results (increment wins/losses/games)
export async function saveGameResults(winnerName, loserName) {
  const winner = await prisma.user.findUnique({ where: { username: winnerName } });
  const loser = await prisma.user.findUnique({ where: { username: loserName } });
  if (!winner || !loser) {
    console.log('Player not found in the database');
    return;
  }
  await prisma.user.update({
    where: { username: winnerName },
    data: {
      wins: { increment: 1 },
      games: { increment: 1 },
    },
  });
  await prisma.user.update({
    where: { username: loserName },
    data: {
      losses: { increment: 1 },
      games: { increment: 1 },
    },
  });
  return true;
}

// Update avatar for a user
export async function uploadAvatarInDatabase(filepath, username) {
  const user = await prisma.user.update({
    where: { username },
    data: { avatar: filepath },
  });
  return user;
}

// Get avatar for a user
export async function getAvatarFromDatabase(username) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { avatar: true },
  });
  return user?.avatar;
}
