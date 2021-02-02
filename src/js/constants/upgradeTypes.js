import { COIN_TYPE_X, COIN_TYPE_O, COIN_TYPE_SUPER_X, COIN_TYPE_SUPER_O } from './coinTypes';

export const UPGRADE_SHOP_X_BOARD_COUNT = 'xbc';
export const UPGRADE_SHOP_X_COINS_PER_WIN = 'xcpw';
export const UPGRADE_SHOP_X_GAME_SPEED = 'xgs';
export const UPGRADE_SHOP_X_CRITICAL_WIN_MULT = 'xcwm';
export const UPGRADE_SHOP_O_BOARD_SIZE = 'obs';
export const UPGRADE_SHOP_O_PICK_INITIAL_MOVES = 'opim';
export const UPGRADE_SHOP_O_SQUARE_WIN = 'osw';
export const UPGRADE_SHOP_O_LARGER_WIN_MULT = 'olwm';
export const UPGRADE_SHOP_SUPER_X_SUPER_COINS_PER_WIN = 'sxscpw';
export const UPGRADE_SHOP_SUPER_X_SUPER_BOARD_COUNT = 'sxsbc';
export const UPGRADE_SHOP_SUPER_X_CRITICAL_SUPER_WIN_MULT = 'sxcswm';
export const UPGRADE_SHOP_SUPER_O_WIN_RESET_DELAY = 'sowrd';
export const UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE = 'sosbs';
export const UPGRADE_SHOP_SUPER_O_UNLOCK_PRESTIGE = 'soup';
export const UPGRADE_SHOP_SUPER_O_SQUARE_WIN = 'sosw';
export const UPGRADE_SHOP_SUPER_O_LARGER_WIN_MULT = 'solwm';
export const UPGRADE_SHOP_STAR_GAME_SPEED = 'stgs';
export const UPGRADE_SHOP_STAR_COINS_PER_WIN = 'stcpw';
export const UPGRADE_SHOP_STAR_BOARD_COUNT = 'stbc';
export const UPGRADE_SHOP_STAR_PICK_INITIAL_MOVES = 'stpim';
export const UPGRADE_SHOP_STAR_AUTO_BUY = 'stab';
export const UPGRADE_SHOP_STAR_UNLOCK_CHALLENGES = 'stuc';
export const UPGRADE_SHOP_STAR_START_BONUS_MULTI = 'stsbm';
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
    UPGRADE_SHOP_O_SQUARE_WIN,
    UPGRADE_SHOP_O_LARGER_WIN_MULT,
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
    UPGRADE_SHOP_SUPER_O_SQUARE_WIN,
    UPGRADE_SHOP_SUPER_O_LARGER_WIN_MULT,
  ],
};

export const UPGRADE_WARNING = {
  [UPGRADE_SHOP_O_BOARD_SIZE]: 'This will increase the board size of all newly created boards.',
  [UPGRADE_SHOP_O_SQUARE_WIN]: 'This increases the required square size to win. The current size square will no longer win.', 
  [UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE]: 'This will increase the super-board size and the number of boards required per super-board.',
  [UPGRADE_SHOP_SUPER_O_SQUARE_WIN]: 'This increases the required square size to win. The current size square will no longer win.',
};

const NEW_SETTINGS_ON_RESET = <i>New settings apply on board resets.</i>;
const ADDITIONAL_WINNING_PIECES = (
  <i>
    <b>Additional winning pieces</b> are pieces beyond the first three in a single winning line.
    For example, 5 pieces in a winning line has 2 extra winning pieces, so the bonus multiplier applies twice.
  </i>
);

export const UPGRADE_EXPLANATION = {
  [UPGRADE_SHOP_O_BOARD_SIZE]: NEW_SETTINGS_ON_RESET,
  [UPGRADE_SHOP_O_PICK_INITIAL_MOVES]: NEW_SETTINGS_ON_RESET,
  [UPGRADE_SHOP_O_SQUARE_WIN]: NEW_SETTINGS_ON_RESET,
  [UPGRADE_SHOP_STAR_PICK_INITIAL_MOVES]: NEW_SETTINGS_ON_RESET,
  [UPGRADE_SHOP_O_LARGER_WIN_MULT]: ADDITIONAL_WINNING_PIECES,
  [UPGRADE_SHOP_SUPER_O_LARGER_WIN_MULT]: ADDITIONAL_WINNING_PIECES,
};
