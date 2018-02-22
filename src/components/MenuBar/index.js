import React from 'react'
import { AppBar, IconButton } from 'material-ui'
import { connect } from '@cerebral/react';
import { state, signal } from 'cerebral/tags';
import './MenuBar.css';
import launcherIcon from './../../icons/launcher.png';
import addRock from './../../icons/add.png';
import findLocation from './../../icons/gps_found.ico';
import seeAll from './../../icons/eye_all_rocks.png';
import seeUnpicked from './../../icons/eye_unpicked.png';

export default connect({
                  showAll: state`view.show_all_rocks`,

findLocationButtonClicked: signal`currentLocationButtonClicked`,
    hideRockButtonClicked: signal`hideRockButtonClicked`,
     addRockButtonClicked: signal`addRockButtonClicked`
	,
}, props =>
    <AppBar
      style={{backgroundColor: '#333333'}}
      title="RockApp"
      iconElementLeft={ <img src={launcherIcon} /> }
      iconElementRight={
	<div>
          <IconButton 
            tooltip="Add a Rock"
            tooltipPosition="bottom-left"
	    onClick={() => props.addRockButtonClicked({})}>
            <img src={addRock} width={40} height={40} />
          </IconButton>

          <IconButton
            tooltip="Find Location"
            tooltipPosition="bottom-left"
	    onClick = {() => props.findLocationButtonClicked({})}>
            <img src={findLocation} width={40} height={40} />
          </IconButton>

          <IconButton
            tooltip={props.showAll ? "See Unpicked Rocks" : "See All Rocks"}
            tooltipPosition="bottom-left"
	    onClick = {() => props.hideRockButtonClicked({})}>
            <img src={props.showAll ? seeUnpicked : seeAll} width={40} height={40} />
          </IconButton>
        </div>
      }
   />
);    
 
