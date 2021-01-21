import * as COIN_TYPE from '../constants/coinTypes';

export const COIN_X = <span className='coin'>X</span>;
export const COIN_O = <span className='coin'>O</span>;
export const COIN_T = <span className='tri'>△</span>;
export const COIN_SUPER_X = <span className='coin'>X²</span>;
export const COIN_SUPER_O = <span className='coin'>O²</span>;
export const COIN_SUPER_T = <span className='tri'>△²</span>;
export const COIN_STAR = <span className='star'>★</span>;

const RENDER_COIN = {
  [COIN_TYPE.COIN_TYPE_X]: COIN_X,
  [COIN_TYPE.COIN_TYPE_O]: COIN_O,
  [COIN_TYPE.COIN_TYPE_T]: COIN_T,
  [COIN_TYPE.COIN_TYPE_SUPER_X]: COIN_SUPER_X,
  [COIN_TYPE.COIN_TYPE_SUPER_O]: COIN_SUPER_O,
  [COIN_TYPE.COIN_TYPE_SUPER_T]: COIN_SUPER_T,
  [COIN_TYPE.COIN_TYPE_STAR]: COIN_STAR,
};

const REGULAR_COINS2 = <span>{COIN_X}&nbsp;or&nbsp;{COIN_O}</span>;
const REGULAR_COINS3 = <span>{COIN_X},&nbsp;{COIN_O}, or&nbsp;{COIN_T}</span>;
const SUPER_COINS2 = <span>{COIN_SUPER_X}&nbsp;or&nbsp;{COIN_SUPER_O}</span>;
const SUPER_COINS3 = <span>{COIN_SUPER_X},&nbsp;{COIN_SUPER_O}, or&nbsp;{COIN_SUPER_T}</span>;

export const renderCoin = (coinType) => {
  return RENDER_COIN[coinType] || '?';
};

export const renderRegularCoins = (unlockTri) => {
  return unlockTri ? REGULAR_COINS3 : REGULAR_COINS2;
};

export const renderSuperCoins = (unlockTri) => {
  return unlockTri ? SUPER_COINS3 : SUPER_COINS2;
};