
import { createMuiTheme } from '@material-ui/core/styles';


export const THEME_TYPE = {
  NORMAL: 'normal',
};

export const THEME_ELEMENT = {
  MAIN: 'main',
  HEADER: 'header',
  SHOP_X: 'shopx',
  SHOP_O: 'shopo',
  BOARD: 'board',
};

const COLOR_X = '#b09ce4';
const COLOR_O = '#ffab91';
const COLOR_WIN = '#ffc107';

const THEMES_BY_TYPE_THEN_ELEMENT = {
  [THEME_TYPE.NORMAL]: {
    [THEME_ELEMENT.MAIN]: createMuiTheme({
      palette: {
        background: {
          default: '#696969',
        },
      },
    }),
    [THEME_ELEMENT.HEADER]: createMuiTheme({
      palette: {
        background: {
          default: '#424242',
        },
        text: {
          primary: '#ccc',
        },
        primary: {
          main: '#b2ebf2',
          contrastText: '#000',
        },
        secondary: {
          main: '#888',
          contrastText: '#000',
        },
      },
    }),
    [THEME_ELEMENT.BOARD]: createMuiTheme({
      palette: {
        text: {
          win: COLOR_WIN,
          x: COLOR_X,
          o: COLOR_O,
          empty: '#000'
        },
        background: {
          default: '#303030',
        },
      },
    }),
    [THEME_ELEMENT.SHOP_X]: createMuiTheme({
      palette: {
        text: {
          primary: '#ddd'
        },
        background: {
          default: '#504874',
        },
        primary: {
          main: '#b09ce4',
          contrastText: '#000',
        },
      },
    }),
    [THEME_ELEMENT.SHOP_O]: createMuiTheme({
      palette: {
        text: {
          primary: '#ddd'
        },
        background: {
          default: '#8D6E63',
        },
        primary: {
          main: COLOR_O,
          contrastText: '#000',
        },
      },
    }),
  },
};

export const getTheme = (themeType, themeElement) => {
  return THEMES_BY_TYPE_THEN_ELEMENT[themeType][themeElement];
}