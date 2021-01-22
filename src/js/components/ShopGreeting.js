import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { renderCoin, renderAmount, COIN_X, COIN_O, COIN_SUPER_X, COIN_SUPER_O, COIN_STAR } from '../constants/coins';
import { COIN_TYPE_X, COIN_TYPE_O, COIN_TYPE_SUPER_X, COIN_TYPE_SUPER_O, COIN_TYPE_STAR } from '../constants/coinTypes';

const getShopDescription = (coinType) => {
  switch (coinType) {
    case COIN_TYPE_X:
      return (
        <Typography>
          Earn&nbsp;{COIN_X}&nbsp;whenever&nbsp;{COIN_X}&nbsp;wins on a board.
        </Typography>
      );
    case COIN_TYPE_O:
      return (
        <Typography>
          Earn&nbsp;{COIN_O}&nbsp;whenever&nbsp;{COIN_O}&nbsp;wins on a board.
        </Typography>
      );
    case COIN_TYPE_SUPER_X:
      return (
        <Typography>
          Earn&nbsp;{COIN_SUPER_X}&nbsp;whenever&nbsp;{COIN_X}&nbsp;wins on a super-board.
        </Typography>
      );
      case COIN_TYPE_SUPER_O:
        return (
          <Typography>
            Earn&nbsp;{COIN_SUPER_O}&nbsp;whenever&nbsp;{COIN_O}&nbsp;wins on a super-board.
          </Typography>
        );
      case COIN_TYPE_STAR:
        return [
          <Typography key={1}>
            Earn&nbsp;{COIN_STAR}&nbsp;whenever you prestige.
          </Typography>,
          <Typography key={2}>
            The&nbsp;{COIN_STAR}&nbsp;Shop upgrades are permanent.
          </Typography>
        ];
    default:
      return '';
  }
};

const mapStateToProps = state => {
  return {
    coins: state.coins
  };
};

function ConnectedShopGreeting({ coins, coinType }) {
  const coin = renderCoin(coinType);
  return (
    <Box display='flex' flexDirection='row' p={1}>
      <Box m={1} width='150px' textAlign='center'>
        <Typography variant='h6'>
          {coin}&nbsp;Shop
        </Typography>
      </Box>
      <Box m={1}>
        <Typography>
          You have {renderAmount(coins[coinType])}&nbsp;{coin}.
        </Typography>
        {getShopDescription(coinType)}
      </Box>
    </Box>
    );
}

const ShopGreeting = connect(mapStateToProps)(ConnectedShopGreeting);

export default ShopGreeting;