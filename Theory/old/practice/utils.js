import { leftPlayerScore, rightPlayerScore } from './gameLogic.js';
let names1 = [
  'NullPointerPrince',
  '404NotFoundYou',
  'StackOverflowed',
  'CtrlAltElite',
  'CommitCrimes',
  'RubberDuckieDev',
  'PingMePlz',
  'BrbCompiling',
  'FatalSyntax',
  'BuggedButHappy',
  'InfiniteLoopHole',
  'SegFaultyLogic',
  'ByteMeMaybe',
  'SpaghettiCoder',
  'FullSnackDev',
  'KernelSandwich',
  'BoolinDev',
  'NaNStopper',
  'DevNullius',
  'TabbyTheDebugger',
  'LootBoxLad',
  'NoScopeCSharp',
  'Lagzilla',
  'RespawnResume',
  'CacheMeOutside',
];
let names2 = [
  'AimBotany',
  'CrashTestCutie',
  'YeetCompiler',
  'PixelPuncher',
  'AFKChef',
  'TeaBagger3000',
  'CaffeineLoop',
  'RAMenNoodles',
  '404SnaccNotFound',
  'HelloWorldDomination',
  'JavaTheHutt',
  'WiFried',
  'DebuggerDuck',
  'ExceptionHunter',
  'TheRealSlimShader',
  'SyntaxTerror',
  'ClickyMcClickface',
  'BananaForScale',
  'Devzilla',
  'MrRobotoCallsHome',
  'SudoNym',
  'OopsIDidItAgain',
  'MemeDrivenDev',
  'TypoNinja',
  'BitFlipper',
];
const randomIndex = Math.floor(Math.random() * names1.length);
export const player1Name = names1[randomIndex];
export const player2Name = names2[randomIndex];
let isRunning = false;

export function getRandomColor() {
  return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
}

export function getRandomDirection() {
  const directionSign = Math.random() > 0.5 ? -1 : 1;
  return ((Math.floor(Math.random() * 90) + 20) / 100) * directionSign;
}

export function updateGameStatus() {
  const gameStatus = document.getElementById('gameStatusFrontend');
  gameStatus.innerHTML = `${leftPlayerScore} - ${rightPlayerScore}`; // Correct syntax
}

export function addPlayersNames() {
  const players = document.getElementById('players');
  players.innerHTML = `${player1Name} vs ${player2Name}`;
}

export function getIsRunning() {
  return isRunning;
}

export function setIsRunning(value) {
  isRunning = value;
}

getRandomDirection() {
  const min = GAME_CONSTS.SPEED * 0.3; // avoid too slow, e.g. 30% of speed
  const directionSign = Math.random() > 0.5 ? -1 : 1;
  const value = Math.random() * (GAME_CONSTS.SPEED - min) + min;
  return value * directionSign;
}

export const GAME_CONSTS = {
  WIDTH: 800,
  HEIGHT: 600,
  MAX_SCORE: 3,
  SPEED: 5.6,
};

this.speedX = this.getRandomDirection();
this.speedY = Math.sqrt(GAME_CONSTS.SPEED ** 2 - this.speedX ** 2);
// this.speedY = this.getRandomDirection();
console.log('Speed in reset X:', this.speedX);
console.log('Speed in reset Y:', this.speedY);
