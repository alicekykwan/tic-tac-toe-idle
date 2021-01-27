import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
  const { children, ...other } = props;
  return (
    <div role='tabpanel' {...other}>
      <Box p={1}>
        {children}
      </Box>
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
};

export default TabPanel;