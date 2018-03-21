import React from 'react';
import Leaflet from 'leaflet';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createMuiTheme } from 'material-ui/styles';
import grey from 'material-ui/colors/grey';
import deepOrange from 'material-ui/colors/deepOrange';
import { connect } from '@cerebral/react';
import MenuBar from '../MenuBar/';
import MapContainer from '../Map/';
import MarkerInput from '../MarkerInput/';
//import './App.css';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

export default connect({
  },
  props =>
  <MuiThemeProvider theme={theme}>
    <MenuBar />
    <MapContainer />
    <MarkerInput />
  </MuiThemeProvider>
);
  

