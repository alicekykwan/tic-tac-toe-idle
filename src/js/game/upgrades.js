import * as UPGRADE_TYPE from "../constants/upgradeTypes";
import { recomputeBoardSettingsCache } from '../game/boards'

export const initialUpgrades = {
  [UPGRADE_TYPE.UPGRADE_SHOP_X_BOARD_COUNT]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_X_GAME_SPEED]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_X_COINS_PER_WIN]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_X_CRITICAL_WIN_MULTIPLIER]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_O_BOARD_SIZE]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_O_PICK_INITIAL_MOVES]: 0
};

const BASE_BOARD_COUNT = 1;
const BASE_GAME_SPEED = 1;
const BASE_COINS_PER_WIN = 1;
const BASE_CRITICAL_WIN_MULTIPLIER = 1;
const BASE_BOARD_SIZE = 3;
 

export const canPurchase = (coins, cost) => {
  if (cost === null) {
    return false;
  }
  if (cost.amount_x && coins.amount_x < cost.amount_x) {
    return false;
  }
  if (cost.amount_o && coins.amount_o < cost.amount_o) {
    return false;
  }
  return true;
};

const deductBalance = (mutableCoins, cost) => {
  if (cost.amount_x) {
    mutableCoins.amount_x -= cost.amount_x;
  }
  if (cost.amount_o) {
    mutableCoins.amount_o -= cost.amount_o;
  }
}

// TODO: Balance
const SHOP_X_UPGRADE_COSTS = {
  [UPGRADE_TYPE.UPGRADE_SHOP_X_BOARD_COUNT]: [10, 75, 250, 1000, 2500, 7500, 15000, 50000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000],
  [UPGRADE_TYPE.UPGRADE_SHOP_X_COINS_PER_WIN]: [10, 75, 250, 1000, 2500, 7500, 15000, 50000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000],
  [UPGRADE_TYPE.UPGRADE_SHOP_X_GAME_SPEED]: [10, 75, 250, 1000, 2500, 7500, 15000, 50000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000],
  [UPGRADE_TYPE.UPGRADE_SHOP_X_CRITICAL_WIN_MULTIPLIER]: [10, 75, 250, 1000, 2500, 7500, 15000, 50000, 100000]
};

const SHOP_O_UPGRADE_COSTS = {
  [UPGRADE_TYPE.UPGRADE_SHOP_O_BOARD_SIZE]: [100, 750, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
  [UPGRADE_TYPE.UPGRADE_SHOP_O_PICK_INITIAL_MOVES]: [10, 75, 250, 1000, 2500, 7500, 15000, 50000, 100000]
};

export const getNextUpgradeCost = (upgradeType, upgradeLevel) => {
  if (SHOP_X_UPGRADE_COSTS[upgradeType]) {
    let costs = SHOP_X_UPGRADE_COSTS[upgradeType];
    if (upgradeLevel < costs.length) {
      return { amount_x: costs[upgradeLevel] };
    }
  } else if (SHOP_O_UPGRADE_COSTS[upgradeType]) {
    let costs = SHOP_O_UPGRADE_COSTS[upgradeType];
    if (upgradeLevel < costs.length) {
      return {amount_o: costs[upgradeLevel]}
    }
  }
  return null;
}

const UPGRADE_NAME = {
  [UPGRADE_TYPE.UPGRADE_SHOP_X_BOARD_COUNT]: "Board Count",
  [UPGRADE_TYPE.UPGRADE_SHOP_X_COINS_PER_WIN]: "Coins per Win",
  [UPGRADE_TYPE.UPGRADE_SHOP_X_GAME_SPEED]: "Game Speed",
  [UPGRADE_TYPE.UPGRADE_SHOP_X_CRITICAL_WIN_MULTIPLIER]: "Critical Win",
  [UPGRADE_TYPE.UPGRADE_SHOP_O_BOARD_SIZE]: "Board Size",
  [UPGRADE_TYPE.UPGRADE_SHOP_O_PICK_INITIAL_MOVES]: "Pick Starting Moves"
};

export const getUpgradeName = (upgradeType) => {
  if (UPGRADE_NAME[upgradeType]) {
    return UPGRADE_NAME[upgradeType];
  }
  return `Unknown upgrade type: ${upgradeType}`
}

export const getUpgradeDescription = (upgradeType, upgradeLevel) => {
  switch (upgradeType) {
    case UPGRADE_TYPE.UPGRADE_SHOP_X_BOARD_COUNT:
      let gameBoards = BASE_BOARD_COUNT + upgradeLevel;
      if (gameBoards === 1) {
        return <span><b>{gameBoards}</b> game board</span>;
      }
      return <span><b>{gameBoards}</b> game boards</span>;
    case UPGRADE_TYPE.UPGRADE_SHOP_X_COINS_PER_WIN:
      return <span>Gain <b>{BASE_COINS_PER_WIN + upgradeLevel}</b> coins per win</span>;
    case UPGRADE_TYPE.UPGRADE_SHOP_X_GAME_SPEED:
      return <span><b>{BASE_GAME_SPEED + upgradeLevel}</b>x game speed</span>;
    case UPGRADE_TYPE.UPGRADE_SHOP_X_CRITICAL_WIN_MULTIPLIER:
      let criticalWinMultiplier = BASE_CRITICAL_WIN_MULTIPLIER + upgradeLevel;
      if (criticalWinMultiplier === 1) {
        return 'No effect'
      }
      return (
        <span>
          <b>{criticalWinMultiplier}</b>x more coins when winning in more than one way
        </span>
      );
    case UPGRADE_TYPE.UPGRADE_SHOP_O_BOARD_SIZE:
      let boardSize = BASE_BOARD_SIZE + upgradeLevel;
      return <span><b>{boardSize}</b> by <b>{boardSize}</b> board size</span>
    case UPGRADE_TYPE.UPGRADE_SHOP_O_PICK_INITIAL_MOVES:
      if (upgradeLevel === 0) {
        return 'No effect';
      } else if (upgradeLevel === 1) {
        return 'First move is no longer random';
      } else {
        return <span>First <b>{upgradeLevel}</b> moves are no longer random</span>;
      }
    default:
      return `Unknown upgrade type: ${upgradeType}`
  }
};

export const updateGameSettings = (mutableGameSettings, upgrades) => {
  mutableGameSettings.boardCount = BASE_BOARD_COUNT + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_X_BOARD_COUNT];
  mutableGameSettings.gameSpeed = BASE_GAME_SPEED + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_X_GAME_SPEED];
  mutableGameSettings.coinsPerWin = BASE_COINS_PER_WIN + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_X_COINS_PER_WIN];
  mutableGameSettings.criticalWinMultiplier = BASE_CRITICAL_WIN_MULTIPLIER + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_X_CRITICAL_WIN_MULTIPLIER];
  if (mutableGameSettings.boardSettings.numRows !== BASE_BOARD_SIZE + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_O_BOARD_SIZE] ||
      mutableGameSettings.boardSettings.numCols !== BASE_BOARD_SIZE + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_O_BOARD_SIZE]) {
    mutableGameSettings.boardSettings.numRows = BASE_BOARD_SIZE + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_O_BOARD_SIZE];
    mutableGameSettings.boardSettings.numCols = BASE_BOARD_SIZE + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_O_BOARD_SIZE];
    mutableGameSettings.boardSettings.initialMoves = [];
    recomputeBoardSettingsCache(mutableGameSettings.boardSettings);
  }
}

export const performUpgrade = (upgradeType, upgradeLevel, mutableState) => {
  let { upgrades, coins, gameSettings } = mutableState;
  if (upgrades[upgradeType] !== upgradeLevel) {
    return false;
  }
  let cost = getNextUpgradeCost(upgradeType, upgradeLevel);
  if (!canPurchase(coins, cost)) {
    return false;
  }
  deductBalance(coins, cost);
  ++upgrades[upgradeType];
  updateGameSettings(gameSettings, upgrades);
}