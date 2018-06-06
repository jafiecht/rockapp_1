import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from '@cerebral/react';
import { signal } from 'cerebral/tags';

import MenuBar from '../MenuBar/';
import MapContainer from '../Map/';
import MarkerInput from '../MarkerInput/';

const styles = theme => ({
  app: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    'flex-direction': 'column',
  },
  mapPanel: {
    display: 'flex',
    'flex-direction': 'column',
    width: '100%',
    height: '100%',
  },
});

class App extends React.Component {

  componentWillMount() {
    this.props.initialize({});
  }

  render() {
    const { classes, theme } = this.props;

    return (   
      <div className={classes.app}>
        <MenuBar/>
        <div className={classes.mapPanel}>
          <MapContainer/>
          <MarkerInput/>
        </div>
      </div>
    );
  }
}

export default connect(
  {
    initialize: signal`initialize`,
  },
  withStyles(styles, { withTheme: true })(App)
);
  

