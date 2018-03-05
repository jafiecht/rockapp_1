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

const width=40;
const height=40;

export default connect({
   showAll: state`view.show_all_rocks`,
  editMode: state`view.marker_edit_mode`,

  findLocationButtonClicked: signal`currentLocationButtonClicked`,
      hideRockButtonClicked: signal`hideRockButtonClicked`,
       addRockButtonClicked: signal`addRockButtonClicked`
	,
}, class MenuBar extends React.Component {
    render() {

      const normal = (
        <div>
	        <IconButton
	          tooltip="Add a Rock"
	           tooltipPosition="bottom-left"
	           OnClick={() => this.addRockButtonClicked({})}>
	           <img src={addRock} width={width} height={height} />
	        </IconButton>

	        <IconButton
            tooltip="Find My Location"
            tooltipPosition="bottom-left"
	          onClick = {() => this.findLocationButtonClicked({})}>
            <img src={findLocation} width={width} height={height} />
          </IconButton>

          <IconButton
            tooltip={this.showAll ? "See Only Unpicked Rocks" : "See All Rocks"}
            tooltipPosition="bottom-left"
            onClick = {() => this.hideRockButtonClicked({})}>
              <img src={this.showAll ? seeUnpicked : seeAll} width={width} height={height} />
          </IconButton>
        </div>
      );

      const editing = (
        <div>
          <IconButton
            tooltip="Delete Rock?"
            tooltipPosition="bottom-left">
            <img src={launcherIcon} width={width} height={height}/>
          </IconButton>
        </div>
      );

      return (
       <AppBar
         style={{backgroundColor: '#333333'}}
         title="RockApp"
         iconElementLeft={ <img src={launcherIcon}/> }
         iconElementRight={this.editMode ? editing : normal}
       />
      );
    }
  }
);    
 
