import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { renderAmount, COIN_STAR } from '../constants/coins';
import { COIN_TYPE_STAR } from '../constants/coinTypes';
import PrestigeButton from './PrestigeButton';

const mapStateToProps = state => {
  return {
    coins: state.coins,
    prestigeCount: state.stats.prestigeCount,
  };
};

function ConnectedPrestigeGreeting({ coins, prestigeCount }) {
  let displayedPrestigeCount = '';
  switch (prestigeCount) {
    case 0:
      displayedPrestigeCount = 'not prestiged';
      break;
    case 1:
      displayedPrestigeCount = 'prestiged once';
      break;
    case 2:
      displayedPrestigeCount = 'prestiged twice';
      break;
    default:
      displayedPrestigeCount = `prestiged ${prestigeCount} times`;
  }

  return (
    <Box display='flex' flexDirection='row' p={1}>
      <Box m={1} width='150px' textAlign='center'>
        <Typography variant='h6'>
          {COIN_STAR}&nbsp;Shop
        </Typography>
      </Box>
      <Box m={1}>
        <Typography>
          You have {renderAmount(coins[COIN_TYPE_STAR])}&nbsp;{COIN_STAR}.
        </Typography>
        <Typography>
          You have {displayedPrestigeCount}.
        </Typography>
        <PrestigeButton displayedPrestigeCount={displayedPrestigeCount} />
      </Box>
    </Box>
    );
}

const PrestigeGreeting = connect(mapStateToProps)(ConnectedPrestigeGreeting);

export default PrestigeGreeting;