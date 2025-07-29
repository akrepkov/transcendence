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
        pongWins: true,
        pongLosses: true,
        snakeWins: true,
        snakeLosses: true,
        friends: true,
        friendsOf: true,
      },
    });
  } catch (error) {
    console.error('Error retrieving all users from db:', error);
    return [];
  }
}

// Save game results (increment wins/losses/games)
export async function saveGameResults(pongOrSnake, winnerName, loserName, game) {
  if (!pongOrSnake || !winnerName || !loserName || !game) {
    console.error('Player and game information needed');
    return false;
  }
  try {
    const winner = await prisma.user.findUnique({ where: { username: winnerName } });
    const loser = await prisma.user.findUnique({ where: { username: loserName } });
    if (!winner || !loser) {
      console.error('Player not found in the database');
      return false;
    }
    switch (pongOrSnake) {
      case 'pong':
        await prisma.user.update({
          where: { username: winnerName },
          data: {
            pongWins: { increment: 1 },
            pong: { connect: { gameId: game.gameId } },
          },
        });
        await prisma.user.update({
          where: { username: loserName },
          data: {
            pongLosses: { increment: 1 },
            pong: { connect: { gameId: game.gameId } },
          },
        });
        break;
      case 'snake':
        await prisma.user.update({
          where: { username: winnerName },
          data: {
            snakeWins: { increment: 1 },
            snake: { connect: { gameId: game.gameId } },
          },
        });
        await prisma.user.update({
          where: { username: loserName },
          data: {
            snakeLosses: { increment: 1 },
            snake: { connect: { gameId: game.gameId } },
          },
        });
        break;
    }
    return true;
  } catch (error) {
    console.error('Error saving player scores:', error);
    return false;
  }
}

// Update username
export async function updateUsername(user, newName) {
  try {
    await prisma.user.update({
      where: { userId: user.userId },
      data: { username: newName },
    });
    return true;
  } catch (error) {
    console.error('Error updating username', error);
    return false;
  }
}

// Update email
export async function updateEmail(user, newEmail) {
  try {
    await prisma.user.update({
      where: { userId: user.userId },
      data: { email: newEmail },
    });
    return true;
  } catch (error) {
    console.error('Error updating email', error);
    return false;
  }
}

// Update avatar for a user
export async function uploadAvatarInDatabase(filepath, username) {
  try {
    const user = await prisma.user.update({
      where: { username: username },
      data: { avatar: filepath },
    });
    return true;
  } catch (error) {
    console.error('Error updating avatar in database:', error);
    return false;
  }
}

// Get avatar for a user
export async function getAvatarFromDatabase(username) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
      select: { avatar: true },
    });
    return user?.avatar;
  } catch (error) {
    console.error('Error retrieving avatar from database:', error);
    return false;
  }
}

// find user by username
export async function getUserByUsername(username) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        friends: true,
        friendsOf: true,
      },
    });
    return user;
  } catch (error) {
    console.error('Error retrieving user from database:', error);
    return false;
  }
}

// can delete user by providing the username
export async function deleteUser(username) {
  if (!username) {
    console.error('No username input');
    return false;
  }
  try {
    await prisma.user.delete({ where: { username: username } });
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
    await prisma.user.update({
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

//can return list of friends for a user
export async function getFriendsOf(username) {
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      console.log('User not found in the database');
      return null;
    }
    return user.friendsOf;
  } catch (error) {
    console.error('Error retrieving friends of', error);
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
    return user.pong, user.snake;
  } catch (error) {
    console.error('Error retrieving match history', error);
    return null;
  }
}
