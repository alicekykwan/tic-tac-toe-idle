import * as COIN_TYPE from '../constants/coinTypes';
import * as UPGRADE_TYPE from '../constants/upgradeTypes';
import { recomputeBoardSettingsCache } from '../game/boards'

export const initialUpgrades = {
  [UPGRADE_TYPE.UPGRADE_SHOP_X_BOARD_COUNT]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_X_GAME_SPEED]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_X_COINS_PER_WIN]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_X_CRITICAL_WIN_MULT]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_O_BOARD_SIZE]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_O_PICK_INITIAL_MOVES]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_SUPER_COINS_PER_WIN]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_SUPER_BOARD_COUNT]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_CRITICAL_SUPER_WIN_MULT]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_WIN_RESET_DELAY]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE]: 0,
};

const BASE_BOARD_COUNT = 1;
const BASE_GAME_SPEED = 1;
const BASE_COINS_PER_WIN = 1;
const BASE_CRITICAL_WIN_MULT = 1;
const BASE_BOARD_SIZE = 3;
const BASE_SUPER_COINS_PER_WIN = 1;
const BASE_SUPER_BOARD_COUNT = 1;
const BASE_CRITICAL_SUPER_WIN_MULT = 1;
const BASE_WIN_RESET_DELAY = 1;
const BASE_SUPER_BOARD_SIZE = 3;
 

export const canPurchase = (coins, cost) => {
  if (cost === null || cost.locked) {
    return false;
  }
  for (let coinType in cost) {
    if (!coins[coinType] || coins[coinType] < cost[coinType]) {
      return false;
    }
  }
  return true;
};

const deductBalance = (mutableCoins, cost) => {
  for (let coinType in cost) {
    mutableCoins[coinType] -= cost[coinType];
  }
}

// TODO: Balance
const SHOP_X_UPGRADE_COSTS = {
  [UPGRADE_TYPE.UPGRADE_SHOP_X_BOARD_COUNT]: [10, 75, 250, 1000, 2500, 7500, 15000, 50000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000],
  [UPGRADE_TYPE.UPGRADE_SHOP_X_COINS_PER_WIN]: [10, 75, 250, 1000, 2500, 7500, 15000, 50000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000],
  [UPGRADE_TYPE.UPGRADE_SHOP_X_GAME_SPEED]: [10, 75, 250, 1000, 2500, 7500, 15000, 50000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000],
  [UPGRADE_TYPE.UPGRADE_SHOP_X_CRITICAL_WIN_MULT]: [10, 75, 250, 1000, 2500, 7500, 15000, 50000, 100000]
};

const SHOP_O_UPGRADE_COSTS = {
  [UPGRADE_TYPE.UPGRADE_SHOP_O_BOARD_SIZE]: [100, 750, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
  [UPGRADE_TYPE.UPGRADE_SHOP_O_PICK_INITIAL_MOVES]: [10, 75, 250, 1000, 2500, 7500, 15000, 50000, 100000],
};

const SHOP_SUPER_X_UPGRADE_COSTS = {
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_SUPER_COINS_PER_WIN]: [100, 750, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_SUPER_BOARD_COUNT]: [100, 750, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_CRITICAL_SUPER_WIN_MULT]: [100, 750, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
};

const SHOP_SUPER_O_UPGRADE_COSTS = {
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_WIN_RESET_DELAY]: [100, 750, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE]: [100, 750, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
};

export const getNextUpgradeCost = (upgradeType, upgradeLevel) => {
  if (SHOP_X_UPGRADE_COSTS[upgradeType]) {
    let costs = SHOP_X_UPGRADE_COSTS[upgradeType];
    if (upgradeLevel < costs.length) {
      return { [COIN_TYPE.COIN_TYPE_X]: costs[upgradeLevel] };
    }
  } else if (SHOP_O_UPGRADE_COSTS[upgradeType]) {
    let costs = SHOP_O_UPGRADE_COSTS[upgradeType];
    if (upgradeLevel < costs.length) {
      return { [COIN_TYPE.COIN_TYPE_O]: costs[upgradeLevel] };
    }
  } else if (SHOP_SUPER_X_UPGRADE_COSTS[upgradeType]) {
    let costs = SHOP_SUPER_X_UPGRADE_COSTS[upgradeType];
    if (upgradeLevel < costs.length) {
      return { [COIN_TYPE.COIN_TYPE_SUPER_X]: costs[upgradeLevel] };
    }
  } else if (SHOP_SUPER_O_UPGRADE_COSTS[upgradeType]) {
    let costs = SHOP_SUPER_O_UPGRADE_COSTS[upgradeType];
    if (upgradeLevel < costs.length) {
      return { [COIN_TYPE.COIN_TYPE_SUPER_O]: costs[upgradeLevel] };
    }
  }
  return null;
}

const UPGRADE_NAME = {
  [UPGRADE_TYPE.UPGRADE_SHOP_X_BOARD_COUNT]: 'Board Count',
  [UPGRADE_TYPE.UPGRADE_SHOP_X_COINS_PER_WIN]: 'Coins per Win',
  [UPGRADE_TYPE.UPGRADE_SHOP_X_GAME_SPEED]: 'Game Speed',
  [UPGRADE_TYPE.UPGRADE_SHOP_X_CRITICAL_WIN_MULT]: 'Critical Win',
  [UPGRADE_TYPE.UPGRADE_SHOP_O_BOARD_SIZE]: 'Board Size',
  [UPGRADE_TYPE.UPGRADE_SHOP_O_PICK_INITIAL_MOVES]: 'Pick Starting Moves',
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_SUPER_COINS_PER_WIN]: 'Super Coins per Win',
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_SUPER_BOARD_COUNT]: 'Super Board Count',
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_CRITICAL_SUPER_WIN_MULT]: 'Super Critical Win',
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_WIN_RESET_DELAY]: 'Delay after Win',
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE]: 'Super Board Size',
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
      let coinsPerWin = BASE_COINS_PER_WIN + upgradeLevel;
      if (coinsPerWin === 1) {
        return <span>Gain <b>{coinsPerWin}</b> coin per win</span>;
      }
      return <span>Gain <b>{coinsPerWin}</b> coins per win</span>;
    case UPGRADE_TYPE.UPGRADE_SHOP_X_GAME_SPEED:
      return <span><b>{BASE_GAME_SPEED + upgradeLevel}</b>x game speed</span>;
    case UPGRADE_TYPE.UPGRADE_SHOP_X_CRITICAL_WIN_MULT:
      let criticalWinMult = BASE_CRITICAL_WIN_MULT + upgradeLevel;
      if (criticalWinMult === 1) {
        return 'No effect'
      }
      return (
        <span>
          <b>{criticalWinMult}</b>x more coins when winning in more than one way
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
    case UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_SUPER_COINS_PER_WIN:
      let superCoinsPerWin = BASE_SUPER_COINS_PER_WIN + upgradeLevel;
      if (superCoinsPerWin === 1) {
        return <span>Gain <b>{superCoinsPerWin}</b> super-coin per super-win</span>;
      }
      return <span>Gain <b>{superCoinsPerWin}</b> super-coins per super-win</span>;
    case UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_SUPER_BOARD_COUNT:
      let superBoardMaxCount = BASE_SUPER_COINS_PER_WIN + upgradeLevel;
      if (superBoardMaxCount === 1) {
        return <span>Maximum <b>{superBoardMaxCount}</b> super-board</span>;
      }
      return <span>Maximum <b>{superBoardMaxCount}</b> super-boards</span>;
    case UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_CRITICAL_SUPER_WIN_MULT:
      let criticalSuperWinMult = BASE_CRITICAL_SUPER_WIN_MULT + upgradeLevel;
      if (criticalSuperWinMult === 1) {
        return 'No effect'
      }
      return (
        <span>
          <b>{criticalSuperWinMult}</b>x more super-coins when super-winning in more than one way
        </span>
      );
    case UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_WIN_RESET_DELAY:
      let winResetDelay = BASE_WIN_RESET_DELAY + upgradeLevel;
      if (winResetDelay === 1) {
        return <span>A winning board resets after <b>{winResetDelay}</b> move</span>;
      }
      return <span>A winning board resets after <b>{winResetDelay}</b> moves</span>;
    case UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE:
      let superBoardSize = BASE_SUPER_BOARD_SIZE + upgradeLevel;
      return <span><b>{superBoardSize}</b> by <b>{superBoardSize}</b> super-board size</span>
    
    default:
      return `Unknown upgrade type: ${upgradeType}`
  }
};

export const updateGameSettings = (mutableGameSettings, upgrades) => {
  // X Shop upgrades
  mutableGameSettings.boardCount = BASE_BOARD_COUNT + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_X_BOARD_COUNT];
  mutableGameSettings.gameSpeed = BASE_GAME_SPEED + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_X_GAME_SPEED];
  mutableGameSettings.coinsPerWin = BASE_COINS_PER_WIN + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_X_COINS_PER_WIN];
  mutableGameSettings.criticalWinMult = BASE_CRITICAL_WIN_MULT + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_X_CRITICAL_WIN_MULT];

  // O Shop upgrades
  if (mutableGameSettings.boardSettings.numRows !== BASE_BOARD_SIZE + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_O_BOARD_SIZE] ||
      mutableGameSettings.boardSettings.numCols !== BASE_BOARD_SIZE + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_O_BOARD_SIZE]) {
    // Clear initial moves whenever board resizes.
    mutableGameSettings.boardSettings.numRows = BASE_BOARD_SIZE + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_O_BOARD_SIZE];
    mutableGameSettings.boardSettings.numCols = BASE_BOARD_SIZE + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_O_BOARD_SIZE];
    mutableGameSettings.boardSettings.initialMoves = [];
    recomputeBoardSettingsCache(mutableGameSettings.boardSettings);
  }

  // Super X Shop upgrades
  mutableGameSettings.superCoinsPerWin = BASE_SUPER_COINS_PER_WIN + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_SUPER_COINS_PER_WIN];
  mutableGameSettings.superBoardMaxCount = BASE_SUPER_BOARD_COUNT + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_SUPER_BOARD_COUNT];
  mutableGameSettings.criticalSuperWinMult = BASE_CRITICAL_SUPER_WIN_MULT + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_CRITICAL_SUPER_WIN_MULT];

  // Super O Shop upgrades
  mutableGameSettings.superBoardSettings.numRows = BASE_SUPER_BOARD_SIZE + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE];
  mutableGameSettings.superBoardSettings.numCols = BASE_SUPER_BOARD_SIZE + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE];
  mutableGameSettings.winResetDelay = BASE_WIN_RESET_DELAY + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_WIN_RESET_DELAY];
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
