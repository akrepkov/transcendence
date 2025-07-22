import prisma from '../prisma/prismaClient.js';

// Get all users (except passwords field)
export async function getUsers() {
  try {
    return await prisma.user.findMany({
      select: {
        userId: true,
        username: true,
        email: true,
        avatar: true,
        wins: true,
        losses: true,
        // games: true,
      },
    });
  } catch (error) {
    console.error('Error retrieving all users from db:', error);
    return [];
  }
}

// Save game results (increment wins/losses/games)
export async function saveGameResults(winnerName, loserName, game) {
  if (!winnerName || !loserName || !game) {
    console.log('Player and game information needed');
    return false;
  }
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
        games: { connect: { gameId: game.gameId } },
      },
    });
    await prisma.user.update({
      where: { username: loserName },
      data: {
        losses: { increment: 1 },
        games: { connect: { gameId: game.gameId } },
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
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    console.error('Error retrieving user from database:', error);
    return false;
  }
}

// find user by username
export async function getUserByUsername(username) {
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    return user;
  } catch (error) {
    console.error('Error retrieving user from database:', error);
    return false;
  }
}

// can delete user by providing the username
export async function deleteUser(username) {
  try {
    await prisma.user.delete({ where: { username } });
    return true;
  } catch (error) {
    console.error('Error in deleting User:', error);
    return null;
  }
}

//can add a friend to the user's friends field (by userId)
export async function addFriend(userName, friendName) {
  try {
    const friend = await getUserByUsername(friendName);
    const user = await getUserByUsername(userName);
    if (!friend || !user) {
      console.log('Data not found in the database');
      return false;
    }
    prisma.user.update({
      where: { username: userName },
      data: {
        friends: {
          connect: { username: friendName },
        },
      },
    });
    return true;
  } catch (error) {
    console.error('Error adding friend:', error);
    return false;
  }
}

//can return list of friends for a user
export async function getFriends(username) {
  try {
    const user = getUserByUsername(username);
    if (!user) {
      console.log('User not found in the database');
      return null;
    }
    return user.friends;
  } catch (error) {
    console.error('Error retrieving friends', error);
    return null;
  }
}

export async function getMatchHistory(username) {
  try {
    const user = getUserByUsername(username);
    if (!user) {
      console.log('User not found in the database');
      return null;
    }
    return user.games;
  } catch (error) {
    console.error('Error retrieving match history', error);
    return null;
  }
}
