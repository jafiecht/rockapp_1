import React from 'react'
import { AppBar, IconButton } from 'material-ui'
import { connect } from '@cerebral/react';
import { state, signal } from 'cerebral/tags';
import './MenuBar.css';
import launcherIcon from './../../icons/launcher.png';
import addRock from './../../icons/add.png';
import findLocation from './../../icons/gps_found.png';
import seeAll from './../../icons/eye_all_rocks.png';
import seeUnpicked from './../../icons/eye_unpicked.png';
import refresh from './../../icons/refresh.png';

export default connect({
  showAll: state`view.show_all_rocks`,
  centerLocation: state`model.map_center_location`,
  rockPickStatus: state`view.rock_pick_state`,
  hideRockButtonClicked: signal`hideRockButtonClicked`,
  addRockButtonClicked: signal`addRockButtonClicked`,
}, props =>
    <AppBar
      style={{backgroundColor: '#333333'}}
      title="RockApp"
      iconElementLeft={ <img src={launcherIcon} /> }
      iconElementRight={
	<div>
          <IconButton 
            tooltip="Add a Rock"
            tooltipPosition="bottom-left">
            <img src={addRock} width={60} height={60} />
          </IconButton>
          <IconButton
            tooltip="Find Location"
            tooltipPosition="bottom-left">
            <img src={findLocation} width={60} height={60} />
          </IconButton>
          <IconButton
            tooltip="See all Rocks"
            tooltipPosition="bottom-left">
            <img src={seeAll} width={60} height={60} />
          </IconButton>
          <IconButton
            tooltip="Refresh Rocks"
            tooltipPosition="bottom-left">
            <img src={refresh} width={60} height={60} />
          </IconButton>
        </div>
      }
   />
);    
 
