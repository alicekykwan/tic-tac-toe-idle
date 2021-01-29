import * as COIN_TYPE from '../constants/coinTypes';
import * as UPGRADE_TYPE from '../constants/upgradeTypes';
import { recomputeBoardSettingsCache, recomputeSuperBoardSettingsCache } from '../game/boards'
import { COIN_STAR, COIN_SUPER_X, COIN_SUPER_O, COIN_X, COIN_O, renderRegularCoins, renderSuperCoins } from '../constants/coins';
import _ from 'lodash';
import { CHALLENGE_1_SQUARE, CHALLENGE_2_FULLBOARD, CHALLENGE_3_ERASER } from '../constants/challengeTypes';

export const INITIAL_UPGRADES = {
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
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_UNLOCK_PRESTIGE]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_GAME_SPEED]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_COINS_PER_WIN]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_BOARD_COUNT]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_PICK_INITIAL_MOVES]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_AUTO_BUY]: 0,
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_UNLOCK_CHALLENGES]: 0,
  [UPGRADE_TYPE.CURRENT_CHALLENGE]: 0,
};

export const IS_UPGRADE_PERMANENT = {
  [UPGRADE_TYPE.UPGRADE_SHOP_X_BOARD_COUNT]: false,
  [UPGRADE_TYPE.UPGRADE_SHOP_X_GAME_SPEED]: false,
  [UPGRADE_TYPE.UPGRADE_SHOP_X_COINS_PER_WIN]: false,
  [UPGRADE_TYPE.UPGRADE_SHOP_X_CRITICAL_WIN_MULT]: false,
  [UPGRADE_TYPE.UPGRADE_SHOP_O_BOARD_SIZE]: false,
  [UPGRADE_TYPE.UPGRADE_SHOP_O_PICK_INITIAL_MOVES]: false,
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_SUPER_COINS_PER_WIN]: false,
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_SUPER_BOARD_COUNT]: false,
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_CRITICAL_SUPER_WIN_MULT]: false,
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_WIN_RESET_DELAY]: false,
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE]: false,
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_UNLOCK_PRESTIGE]: false,
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_GAME_SPEED]: true,
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_COINS_PER_WIN]: true,
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_BOARD_COUNT]: true,
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_PICK_INITIAL_MOVES]: true,
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_AUTO_BUY]: true,
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_UNLOCK_CHALLENGES]: true,
  [UPGRADE_TYPE.CURRENT_CHALLENGE]: true,

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

const deductBalance = (mutableCoins, mutableSpent, cost) => {
  for (let coinType in cost) {
    mutableCoins[coinType] -= cost[coinType];
    mutableSpent[coinType] += cost[coinType];
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
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_UNLOCK_PRESTIGE]: [1000000],
};

const SHOP_STAR_UPGRADE_COSTS = {
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_GAME_SPEED]: [1, 2, 3],
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_COINS_PER_WIN]: [1, 2, 3],
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_BOARD_COUNT]: [1, 2, 3],
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_PICK_INITIAL_MOVES]: [1, 2, 3],
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_AUTO_BUY]: [1, 2, 3, 4],
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_UNLOCK_CHALLENGES]: [10, 10, 10],

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
  } else if (SHOP_STAR_UPGRADE_COSTS[upgradeType]) {
    let costs = SHOP_STAR_UPGRADE_COSTS[upgradeType];
    if (upgradeLevel < costs.length) {
      return { [COIN_TYPE.COIN_TYPE_STAR]: costs[upgradeLevel] };
    }
  }
  return null;
}

const UPGRADE_NAME = {
  [UPGRADE_TYPE.UPGRADE_SHOP_X_BOARD_COUNT]: 'Board Count',
  [UPGRADE_TYPE.UPGRADE_SHOP_X_COINS_PER_WIN]: 'Rewards per Win',
  [UPGRADE_TYPE.UPGRADE_SHOP_X_GAME_SPEED]: 'Game Speed',
  [UPGRADE_TYPE.UPGRADE_SHOP_X_CRITICAL_WIN_MULT]: 'Critical Win',
  [UPGRADE_TYPE.UPGRADE_SHOP_O_BOARD_SIZE]: 'Board Size',
  [UPGRADE_TYPE.UPGRADE_SHOP_O_PICK_INITIAL_MOVES]: 'Pick Starting Moves',
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_SUPER_COINS_PER_WIN]: 'Rewards per Super-Win',
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_SUPER_BOARD_COUNT]: 'Super Board Count',
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_CRITICAL_SUPER_WIN_MULT]: 'Super Critical Win',
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_WIN_RESET_DELAY]: 'Delay after Win',
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE]: 'Super Board Size',
  [UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_UNLOCK_PRESTIGE]: 'Unlock Prestige',
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_GAME_SPEED]: 'Game Speed',
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_COINS_PER_WIN]: 'Rewards per Win',
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_BOARD_COUNT]: 'Board Count',
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_PICK_INITIAL_MOVES]: 'Pick Starting Moves',
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_AUTO_BUY]: 'Auto Buy Upgrades',
  [UPGRADE_TYPE.UPGRADE_SHOP_STAR_UNLOCK_CHALLENGES]: 'Unlock Challenges',
};

export const getUpgradeName = (upgradeType) => {
  if (UPGRADE_NAME[upgradeType]) {
    return UPGRADE_NAME[upgradeType];
  }
  return `Unknown upgrade type: ${upgradeType}`
}

export const getUpgradeDescription = (upgradeType, upgradeLevel, upgrades) => {
  let tempUpgrades = {...upgrades, [upgradeType]: upgradeLevel};
  let tempGameSettings = {};
  updateGameSettings(tempGameSettings, tempUpgrades, /* skipUpdateCache= */ true);

  switch (upgradeType) {
    case UPGRADE_TYPE.UPGRADE_SHOP_X_BOARD_COUNT:
    case UPGRADE_TYPE.UPGRADE_SHOP_STAR_BOARD_COUNT:
      if (tempGameSettings.boardCount === 1) {
        return <span><b>{tempGameSettings.boardCount}</b> game board</span>;
      }
      return <span><b>{tempGameSettings.boardCount}</b> game boards</span>;

    case UPGRADE_TYPE.UPGRADE_SHOP_X_COINS_PER_WIN:
    case UPGRADE_TYPE.UPGRADE_SHOP_STAR_COINS_PER_WIN:
      return <span>Gain <b>{tempGameSettings.coinsPerWin}</b>&nbsp;{renderRegularCoins(false)}&nbsp;per win</span>;

    case UPGRADE_TYPE.UPGRADE_SHOP_X_GAME_SPEED:
    case UPGRADE_TYPE.UPGRADE_SHOP_STAR_GAME_SPEED:
      return <span><b>{tempGameSettings.gameSpeed}</b>x game speed</span>;

    case UPGRADE_TYPE.UPGRADE_SHOP_X_CRITICAL_WIN_MULT:
      if (tempGameSettings.criticalWinMult === 1) {
        return 'No effect';
      }
      return (
        <span>
          <b>{tempGameSettings.criticalWinMult}</b>x more&nbsp;{renderRegularCoins(false)}&nbsp;when winning in more than one way
        </span>
      );

    case UPGRADE_TYPE.UPGRADE_SHOP_O_BOARD_SIZE: {
      let {numRows, numCols} = tempGameSettings.boardSettings;
      return <span><b>{numRows}</b> by <b>{numCols}</b> board size</span>;
    }

    case UPGRADE_TYPE.UPGRADE_SHOP_O_PICK_INITIAL_MOVES:
    case UPGRADE_TYPE.UPGRADE_SHOP_STAR_PICK_INITIAL_MOVES:
      if (tempGameSettings.maxInitialMoves === 0) {
        return 'No effect';
      } else if (tempGameSettings.maxInitialMoves === 1) {
        return 'First move is no longer random';
      } else {
        return <span>First <b>{tempGameSettings.maxInitialMoves}</b> moves are no longer random</span>;
      }

    case UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_SUPER_COINS_PER_WIN:
      return <span>Gain <b>{tempGameSettings.superCoinsPerWin}</b>&nbsp;{renderSuperCoins(false)}&nbsp;per super-win</span>;

    case UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_SUPER_BOARD_COUNT:
      if (tempGameSettings.superBoardMaxCount === 1) {
        return <span>Maximum <b>{tempGameSettings.superBoardMaxCount}</b> super-board</span>;
      }
      return <span>Maximum <b>{tempGameSettings.superBoardMaxCount}</b> super-boards</span>;

    case UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_CRITICAL_SUPER_WIN_MULT:
      if (tempGameSettings.criticalSuperWinMult === 1) {
        return 'No effect';
      }
      return (
        <span>
          <b>{tempGameSettings.criticalSuperWinMult}</b>x more&nbsp;{renderSuperCoins(false)}&nbsp;when super-winning in more than one way
        </span>
      );

    case UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_WIN_RESET_DELAY:
      if (tempGameSettings.winResetDelay === 1) {
        return <span>A winning board resets after <b>{tempGameSettings.winResetDelay}</b> move</span>;
      }
      return <span>A winning board resets after <b>{tempGameSettings.winResetDelay}</b> moves</span>;

    case UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE: {
      let {numRows, numCols} = tempGameSettings.superBoardSettings;
      return <span><b>{numRows}</b> by <b>{numCols}</b> super-board size</span>;
    }

    case UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_UNLOCK_PRESTIGE:
      if (!tempGameSettings.canPrestige) {
        return 'No effect';
      }
      return <span>Unlock the <b>Prestige</b> option in the&nbsp;{COIN_STAR}&nbsp;<b>Shop</b></span>;
    
    case UPGRADE_TYPE.UPGRADE_SHOP_STAR_AUTO_BUY:
      if (tempGameSettings.autoBuyLevel === 0) {
        return <span>No effect</span>;
      } else if (tempGameSettings.autoBuyLevel === 1) {
        return <span>{COIN_X}&nbsp;<b>Shop</b> Auto Buyers Unlocked</span>;
      } else if (tempGameSettings.autoBuyLevel === 2) {
        return <span>{COIN_O}&nbsp;<b>Shop</b> Auto Buyers Unlocked</span>;
      } else if (tempGameSettings.autoBuyLevel === 3) {
        return <span>{COIN_SUPER_X}&nbsp;<b>Shop</b> Auto Buyers Unlocked</span>;
      } else {
        return <span>{COIN_SUPER_O}&nbsp;<b>Shop</b> Auto Buyers Unlocked</span>;
      };

    case UPGRADE_TYPE.UPGRADE_SHOP_STAR_UNLOCK_CHALLENGES: {
      switch (tempGameSettings.maxChallengeSelect) {
        case 0:
          return 'No effect';
        case 1:
          return 'Unlock challenges';
        case 2:
          return 'Can attempt two challenges at once';
        case 3:
          return 'Can attempt three challenges at once';
        default:
          return `Can attempt ${tempGameSettings.maxChallengeSelect} challenges at once`;
      }
    }

    default:
      return `Unknown upgrade type: ${upgradeType}`
  }
};

// Perform almost-full reconcile from upgrades to mutableGameSettings.
// Exceptions: initialMoves
export const updateGameSettings = (mgs /*mutableGameState*/, upgrades, skipUpdateCache=false) => {
  if (!mgs.hasOwnProperty('boardSettings')) {
    mgs.boardSettings = {};
  }
  if (!mgs.hasOwnProperty('superBoardSettings')) {
    mgs.superBoardSettings = {};
  }

  // X Shop upgrades
  mgs.boardCount = BASE_BOARD_COUNT + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_X_BOARD_COUNT];
  mgs.gameSpeed = BASE_GAME_SPEED + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_X_GAME_SPEED];
  mgs.coinsPerWin = BASE_COINS_PER_WIN + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_X_COINS_PER_WIN];
  mgs.criticalWinMult = BASE_CRITICAL_WIN_MULT + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_X_CRITICAL_WIN_MULT];

  // O Shop upgrades
  mgs.maxInitialMoves = upgrades[UPGRADE_TYPE.UPGRADE_SHOP_O_PICK_INITIAL_MOVES];
  let boardSize = BASE_BOARD_SIZE + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_O_BOARD_SIZE];
  let newBoardSettings = {
    numRows: boardSize,
    numCols: boardSize,
    lineWin: boardSize,
    squareWin: 0,
    requireFull: false,
    allowErase: false,
    numPlayers: 2,
  };

  // Super X Shop upgrades
  mgs.superCoinsPerWin = BASE_SUPER_COINS_PER_WIN + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_SUPER_COINS_PER_WIN];
  mgs.superBoardMaxCount = BASE_SUPER_BOARD_COUNT + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_SUPER_BOARD_COUNT];
  mgs.criticalSuperWinMult = BASE_CRITICAL_SUPER_WIN_MULT + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_SUPER_X_CRITICAL_SUPER_WIN_MULT];

  // Super O Shop upgrades
  let superBoardSize = BASE_SUPER_BOARD_SIZE + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE];
  let newSuperBoardSettings = {
    numRows: superBoardSize,
    numCols: superBoardSize,
    lineWin: superBoardSize,
    squareWin: 0,
    requireFull: false,
    numPlayers: 2,
  };
  mgs.winResetDelay = BASE_WIN_RESET_DELAY + upgrades[UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_WIN_RESET_DELAY];
  mgs.canPrestige = (upgrades[UPGRADE_TYPE.UPGRADE_SHOP_SUPER_O_UNLOCK_PRESTIGE] > 0);

  // Star Shop upgrades
  mgs.gameSpeed += upgrades[UPGRADE_TYPE.UPGRADE_SHOP_STAR_GAME_SPEED];
  mgs.coinsPerWin += upgrades[UPGRADE_TYPE.UPGRADE_SHOP_STAR_COINS_PER_WIN];
  mgs.boardCount += upgrades[UPGRADE_TYPE.UPGRADE_SHOP_STAR_BOARD_COUNT];
  mgs.maxInitialMoves += upgrades[UPGRADE_TYPE.UPGRADE_SHOP_STAR_PICK_INITIAL_MOVES];
  // TODO: set this based on automation upgrade level
  mgs.autoBuyLevel = upgrades[UPGRADE_TYPE.UPGRADE_SHOP_STAR_AUTO_BUY]
  mgs.canAutomate = {
    [COIN_TYPE.COIN_TYPE_X]: Boolean(mgs.autoBuyLevel > 0),
    [COIN_TYPE.COIN_TYPE_O]: Boolean(mgs.autoBuyLevel > 1),
    [COIN_TYPE.COIN_TYPE_SUPER_X]: Boolean(mgs.autoBuyLevel > 2),
    [COIN_TYPE.COIN_TYPE_SUPER_O]: Boolean(mgs.autoBuyLevel > 3),
  };
  mgs.maxChallengeSelect = upgrades[UPGRADE_TYPE.UPGRADE_SHOP_STAR_UNLOCK_CHALLENGES];
  mgs.startBonusMulti = 1;

  // Challenges
  let challenge = upgrades[UPGRADE_TYPE.CURRENT_CHALLENGE];
  if (challenge & CHALLENGE_1_SQUARE) {
    newBoardSettings.lineWin = 0;
    newBoardSettings.squareWin = 2;
    newSuperBoardSettings.lineWin = 0;
    newSuperBoardSettings.squareWin = 2;
  }
  if (challenge & CHALLENGE_2_FULLBOARD) {
    newBoardSettings.requireFull = true;
    newSuperBoardSettings.requireFull = true;
  }
  if (challenge & CHALLENGE_3_ERASER) {
    newBoardSettings.allowErase = true;
  }

  if (Object.entries(newBoardSettings).some(([prop,val])=>mgs.boardSettings[prop]!==val)) {
    Object.assign(mgs.boardSettings, newBoardSettings);
    // TODO: only clear initial moves on resize.
    mgs.boardSettings.initialMoves = [];
    if (!skipUpdateCache) {
      recomputeBoardSettingsCache(mgs.boardSettings);
    }
  }

  if (Object.entries(newSuperBoardSettings).some(([prop,val])=>mgs.superBoardSettings[prop]!==val)) {
    Object.assign(mgs.superBoardSettings, newSuperBoardSettings);
  }
};

// returns the new state after performing an upgrade
export const performUpgrade = (upgradeType, upgradeLevel, state) => {
  if (state.upgrades[upgradeType] !== upgradeLevel) {
    return state;
  }
  let cost = getNextUpgradeCost(upgradeType, upgradeLevel);
  if (!canPurchase(state.coins, cost)) {
    return state;
  }
  let newState = {
      ...state,
      coins: {...state.coins},
      spent: {...state.spent},
      upgrades: {...state.upgrades},
      gameSettings: _.cloneDeep(state.gameSettings)};
  deductBalance(newState.coins, newState.spent, cost);
  ++newState.upgrades[upgradeType];
  updateGameSettings(newState.gameSettings, newState.upgrades);
  return newState;
};

export const checkAutoBuyers = (state) => {
  let purchased = false;
  for (let [coinType, upgradeTypes] of Object.entries(UPGRADE_TYPE.AUTOMATABLE_UPGRADES)) {
    if (!state.gameSettings.canAutomate[coinType]) {
      continue;
    }
    for (let upgradeType of upgradeTypes) {
      let autoBuyer = state.userSettings.autoBuyers[upgradeType];
      if (!autoBuyer.on || autoBuyer.lim > 100 || autoBuyer.lim <= 0 ) {
        continue;
      }      

      let upgradeLevel = state.upgrades[upgradeType];
      let cost = getNextUpgradeCost(upgradeType, upgradeLevel);
      // adjust cost
      for (let costCoinType in cost) {
        cost[costCoinType] *= 100/autoBuyer.lim;
      }
      if (!canPurchase(state.coins, cost)) {
        continue;
      }

      if (!purchased) {
        // First time we purchase we should make mutable copies.
        purchased = true;
        state = {
            ...state,
            coins: {...state.coins},
            spent: {...state.spent},
            upgrades: {...state.upgrades}};
      }
      deductBalance(state.coins, state.spent, cost);
      ++state.upgrades[upgradeType];
    }
  }
  if (purchased) {
    // NOTE: if we reach here, we would have already made
    // at least a shallow copy of state
    state.gameSettings = _.cloneDeep(state.gameSettings);
    updateGameSettings(state.gameSettings, state.upgrades);
  }
  return state;
};
