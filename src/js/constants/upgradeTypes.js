import { COIN_TYPE_X, COIN_TYPE_O, COIN_TYPE_SUPER_X, COIN_TYPE_SUPER_O } from './coinTypes';

export const UPGRADE_SHOP_X_BOARD_COUNT = 'xbc';
export const UPGRADE_SHOP_X_COINS_PER_WIN = 'xcpw';
export const UPGRADE_SHOP_X_GAME_SPEED = 'xgs';
export const UPGRADE_SHOP_X_CRITICAL_WIN_MULT = 'xcwm';
export const UPGRADE_SHOP_O_BOARD_SIZE = 'obs';
export const UPGRADE_SHOP_O_PICK_INITIAL_MOVES = 'opim';
export const UPGRADE_SHOP_SUPER_X_SUPER_COINS_PER_WIN = 'sxscpw';
export const UPGRADE_SHOP_SUPER_X_SUPER_BOARD_COUNT = 'sxsbc';
export const UPGRADE_SHOP_SUPER_X_CRITICAL_SUPER_WIN_MULT = 'sxcswm';
export const UPGRADE_SHOP_SUPER_O_WIN_RESET_DELAY = 'sowrd';
export const UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE = 'sosbs';
export const UPGRADE_SHOP_SUPER_O_UNLOCK_PRESTIGE = 'soup';
export const UPGRADE_SHOP_STAR_GAME_SPEED = 'stgs';
export const UPGRADE_SHOP_STAR_COINS_PER_WIN = 'stcpw';
export const UPGRADE_SHOP_STAR_BOARD_COUNT = 'stbc';
export const UPGRADE_SHOP_STAR_PICK_INITIAL_MOVES = 'stpim';
export const UPGRADE_SHOP_STAR_AUTO_BUY = 'stab';
export const UPGRADE_SHOP_STAR_UNLOCK_CHALLENGES = 'stuc';
export const CURRENT_CHALLENGE = 'cc';

export const AUTOMATABLE_UPGRADES = {
  [COIN_TYPE_X]: [
    UPGRADE_SHOP_X_BOARD_COUNT,
    UPGRADE_SHOP_X_COINS_PER_WIN,
    UPGRADE_SHOP_X_GAME_SPEED,
    UPGRADE_SHOP_X_CRITICAL_WIN_MULT,
  ],
  [COIN_TYPE_O]: [
    UPGRADE_SHOP_O_BOARD_SIZE,
    UPGRADE_SHOP_O_PICK_INITIAL_MOVES,
  ],
  [COIN_TYPE_SUPER_X]: [
    UPGRADE_SHOP_SUPER_X_SUPER_COINS_PER_WIN,
    UPGRADE_SHOP_SUPER_X_SUPER_BOARD_COUNT,
    UPGRADE_SHOP_SUPER_X_CRITICAL_SUPER_WIN_MULT,
  ],
  [COIN_TYPE_SUPER_O]: [
    UPGRADE_SHOP_SUPER_O_WIN_RESET_DELAY,
    UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE,
    UPGRADE_SHOP_SUPER_O_UNLOCK_PRESTIGE,
  ],
};

export const UPGRADE_WARNING = {
  [UPGRADE_SHOP_O_BOARD_SIZE]: 'This will increase the board size of all newly created boards.',
  [UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE]: 'This will increase the super-board size and the number of boards required per super-board.',
};

export const UPGRADE_CONFIRMATION = {
  [UPGRADE_SHOP_O_BOARD_SIZE]: 'confirmBoardSize',
  [UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE]: 'confirmSuperBoardSize',
};