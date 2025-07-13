import prisma from '../prisma/prismaClient.js';

export async function saveGame({ winnerName, loserName }) {
  const game = prisma.game.create();

  return;
}
