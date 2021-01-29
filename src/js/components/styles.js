import { makeStyles } from '@material-ui/core/styles';

export const useShopTabStyles = makeStyles((theme) => ({
  root: {
  },
  tabs: {
    paddingTop: '16px',
    paddingBottom: '16px',
    width: '150px',
    minWidth: '150px',
    borderRight: `2px solid ${theme.palette.divider}`,
  },
  indicator: {
    fontWeight: 'bold',
  }
}));

export const useErrorButtonStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#f50057',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#d32f2f',
    },
  },
}));
