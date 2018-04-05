import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from '@cerebral/react';

import MenuBar from '../MenuBar/';
import MapContainer from '../Map/';
import MarkerInput from '../MarkerInput/';

const styles = theme => ({
 app: {
    width: '100vw',
		height: '100vh',
		'background-color': 'grey',
    display: 'flex',
		'flex-direction': 'column',
  }
});

class App extends React.Component {
  render() {
    const { classes, theme } = this.props;

    return (
      
				<div className={classes.app}>
          <MenuBar/>
          <MapContainer/>
          <MarkerInput/>
				</div>
      
			);
  }
}

export default connect(
  {
  },
  withStyles(styles, { withTheme: true })(App)
);
  

