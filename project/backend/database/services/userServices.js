import prisma from '../prisma/prismaClient.js';

// Get all users (except passwords field)
export async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      wins: true,
      losses: true,
      games: true,
    },
  });
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
