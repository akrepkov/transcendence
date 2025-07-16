import prisma from '../prisma/prismaClient.js';

// Get all users (except passwords field)
export async function getUsers() {
  try {
    return prisma.user.findMany({
      select: {
        userId: true,
        username: true,
        email: true,
        avatar: true,
        wins: true,
        losses: true,
        games: true,
      },
    });
  } catch (error) {
    console.error('Error retrieving all users from db:', error);
    return [];
  }
}

// Save game results (increment wins/losses/games)
export async function saveGameResults(winnerName, loserName) {
  try {
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
  } catch (error) {
    console.error('Error saving player scores:', error);
    return false;
  }
}

// Update avatar for a user
export async function uploadAvatarInDatabase(filepath, username) {
  try {
    const user = await prisma.user.update({
      where: { username },
      data: { avatar: filepath },
    });
    return user;
  } catch (error) {
    console.error('Error updating avatar in database:', error);
    return false;
  }
}

// Get avatar for a user
export async function getAvatarFromDatabase(username) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { avatar: true },
    });
    return user?.avatar;
  } catch (error) {
    console.error('Error retrieving avatar from database:', error);
    return false;
  }
}

// find user by email
export async function getUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({ email });
    return user;
  } catch (error) {
    console.error('Error retrieving user from database:', error);
    return false;
  }
}

// upload avatar path to the db
export async function uploadAvatarinDatabase(avatarUrl, username) {
  try {
    const user = await prisma.user.findUnique({ username });
    user.avatar = avatarUrl;
    return true;
  } catch (error) {
    console.error('Error saving avatar:', error);
    return false;
  }
}
