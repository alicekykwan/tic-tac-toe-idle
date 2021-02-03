
import { createMuiTheme } from '@material-ui/core/styles';
import { COLOR_X, COLOR_O, COLOR_STAR, COLOR_T } from '../constants/colors';

export const THEME_TYPE = {
  NORMAL: 'normal',
};

export const THEME_ELEMENT = {
  MAIN: 'main',
  HEADER: 'header',
  SHOP_X: 'shopx',
  SHOP_O: 'shopo',
  BOARD: 'board',
  SETTINGS: 'settings',
  CHALLENGE: 'challenge',
  SHOP_T: 'shopt',
};

const GLOBAL_FONT = {
  'fontFamily': '"Itim", cursive',
  'fontSize': 16,
};

const THEMES_BY_TYPE_THEN_ELEMENT = {
  [THEME_TYPE.NORMAL]: {
    [THEME_ELEMENT.MAIN]: createMuiTheme({
      palette: {
        background: {
          default: '#696969',
        },
      },
      typography: GLOBAL_FONT,
    }),
    [THEME_ELEMENT.HEADER]: createMuiTheme({
      palette: {
        background: {
          default: '#424242',
        },
        text: {
          primary: '#cccccc',
        },
        primary: {
          main: '#424242',
          contrastText: '#000000',
        },
        secondary: {
          main: '#888888',
          contrastText: '#000000',
        },
      },
      typography: GLOBAL_FONT,
    }),
    [THEME_ELEMENT.SETTINGS]: createMuiTheme({
      palette: {
        text: {
          primary: '#000000',
          secondary: '#333333',
        },
        background: {
          default: '#bbdefb',
          paper: '#e3f2fd',
        },
        primary: {
          main: '#bbdefb',
          contrastText: '#000000',
        },
      },
      typography: GLOBAL_FONT,
    }),
    [THEME_ELEMENT.SHOP_X]: createMuiTheme({
      palette: {
        text: {
          primary: '#000000',
          secondary: '#333333',
        },
        background: {
          default: '#504874',
          paper: '#7d73a3',
        },
        primary: {
          main: COLOR_X,
          contrastText: '#000000',
        },
      },
      typography: GLOBAL_FONT,
    }),
    [THEME_ELEMENT.SHOP_O]: createMuiTheme({
      palette: {
        text: {
          primary: '#000000',
          secondary: '#333333',
        },
        background: {
          default: '#8d6e63',
          paper: '#be9c91',
        },
        primary: {
          main: COLOR_O,
          contrastText: '#000000',
        },
      },
      typography: GLOBAL_FONT,
    }),
    [THEME_ELEMENT.SHOP_T]: createMuiTheme({
      palette: {
        text: {
          primary: '#000000',
          secondary: '#333333',
        },
        background: {
          default: '#ca56cb',
          paper: '#ffbbff',
        },
        primary: {
          main: COLOR_T,
          contrastText: '#000000',
        },
      },
      typography: GLOBAL_FONT,
    }),
    [THEME_ELEMENT.SHOP_STAR]: createMuiTheme({
      palette: {
        text: {
          primary: '#000000',
          secondary: '#333333',
        },
        background: {
          default: '#cabf45',
          paper: '#ffffa8',
        },
        primary: {
          main: COLOR_STAR,
          contrastText: '#000000',
        },
      },
      typography: GLOBAL_FONT,
    }),
    [THEME_ELEMENT.CHALLENGE]: createMuiTheme({
      palette: {
        text: {
          primary: '#000000',
          secondary: '#333333',
        },
        background: {
          default: '#cabf45',
          paper: '#ffffa8',
        },
        primary: {
          main: COLOR_STAR,
          contrastText: '#000000',
        },
        secondary: {
          main: '#a2cf6e',
          contrastText: '#000000',
        },
      },
      typography: GLOBAL_FONT,
      overrides: {
        MuiToggleButton: {
          root: {
            '&$selected': {
              color: '#000000',
            },
          },
        },
      },
    }),
  },
};

export const getTheme = (themeType, themeElement) => {
  return THEMES_BY_TYPE_THEN_ELEMENT[themeType][themeElement];
}