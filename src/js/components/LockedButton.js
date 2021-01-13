import Button from '@material-ui/core/Button';
import LockIcon from '@material-ui/icons/Lock';

function LockedButton({ message }) {
  return (
    <Button variant="contained" disabled startIcon={<LockIcon/>}
        style={{backgroundColor:'#333333', color:'#dddddd'}}>
      {message}
    </Button>
  );
};

export default LockedButton;