import React from 'react';
import Leaflet from 'leaflet';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { connect } from '@cerebral/react';
import MenuBar from '../MenuBar/';
import MapContainer from '../Map/';
import MarkerInput from '../MarkerInput/';
import './App.css';

export default connect({
  },
  props =>
  <MuiThemeProvider>
    <MenuBar />
    <MapContainer />
    <MarkerInput />
  </MuiThemeProvider>
);
  

