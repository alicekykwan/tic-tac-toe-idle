import { UPGRADE_SHOP_X_BOARD_COUNT, UPGRADE_SHOP_X_GAME_SPEED, UPGRADE_SHOP_X_COINS_PER_WIN } from "../constants/upgradeTypes";

export const initialUpgrades = {
  [UPGRADE_SHOP_X_BOARD_COUNT]: 0,
  [UPGRADE_SHOP_X_GAME_SPEED]: 0,
  [UPGRADE_SHOP_X_COINS_PER_WIN]: 0,
};

const BASE_BOARD_COUNT = 1;
const BASE_GAME_SPEED = 1;
const BASE_COINS_PER_WIN = 1;

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
  [UPGRADE_SHOP_X_BOARD_COUNT]: [10, 75, 250, 1000, 2500, 7500, 15000, 50000, 100000],
  [UPGRADE_SHOP_X_COINS_PER_WIN]: [10, 75, 250, 1000, 2500, 7500, 15000, 50000, 100000],
  [UPGRADE_SHOP_X_GAME_SPEED]: [10, 75, 250, 1000, 2500, 7500, 15000, 50000, 100000],
};

export const getNextUpgradeCost = (upgradeType, upgradeLevel) => {
  if (SHOP_X_UPGRADE_COSTS[upgradeType]) {
    let costs = SHOP_X_UPGRADE_COSTS[upgradeType];
    if (upgradeLevel < costs.length) {
      return { amount_x: costs[upgradeLevel] };
    }
  }
  return null;
}

const UPGRADE_NAME = {
  [UPGRADE_SHOP_X_BOARD_COUNT]: "Board Count",
  [UPGRADE_SHOP_X_COINS_PER_WIN]: "Coins per Win",
  [UPGRADE_SHOP_X_GAME_SPEED]: "Game Speed",
};

export const getUpgradeName = (upgradeType) => {
  if (UPGRADE_NAME[upgradeType]) {
    return UPGRADE_NAME[upgradeType];
  }
  return `Unknown upgrade type: ${upgradeType}`
}

export const getUpgradeDescription = (upgradeType, upgradeLevel) => {
  switch (upgradeType) {
    case UPGRADE_SHOP_X_BOARD_COUNT:
      return `${ BASE_BOARD_COUNT + upgradeLevel } total game board`;
    case UPGRADE_SHOP_X_COINS_PER_WIN:
      return `${ BASE_COINS_PER_WIN + upgradeLevel } coins per win`;
    case UPGRADE_SHOP_X_GAME_SPEED:
      return `${ BASE_GAME_SPEED + upgradeLevel }x game speed`;
    default:
      return `Unknown upgrade type: ${upgradeType}`
  }
};

const updateGameSettings = (mutableGameSettings, upgrades) => {
  mutableGameSettings.boardCount = BASE_BOARD_COUNT + upgrades[UPGRADE_SHOP_X_BOARD_COUNT];
  mutableGameSettings.gameSpeed = BASE_GAME_SPEED + upgrades[UPGRADE_SHOP_X_GAME_SPEED];
  mutableGameSettings.coinsPerWin = BASE_COINS_PER_WIN + upgrades[UPGRADE_SHOP_X_COINS_PER_WIN];
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