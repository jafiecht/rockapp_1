import React from 'react'
import { AppBar, IconButton, Typography, Toolbar } from 'material-ui';
import { connect } from '@cerebral/react';
import { state, signal } from 'cerebral/tags';
//import './MenuBar.css';
import launcherIcon from './../../icons/launcher.png';
import addRock from './../../icons/add.png';
import findLocation from './../../icons/gps_found.ico';
import seeAll from './../../icons/eye_all_rocks.png';
import seeUnpicked from './../../icons/eye_unpicked.png';
import deleteIcon from './../../icons/delete.png';


const width=40;
const height=40;

const styles = {
  root: {
    flexGrow:1,
  },
  flex: {
    flex: 1,
  },
	launchIcon: {
    marginLeft: -30,
		marginRight: 20
  },
  
};

export default connect({
         showAll: state`view.show_all_rocks`,
        editMode: state`view.marker_edit_mode`,
  centerLocation: state`model.map_center_location`,
         rockKey: state`model.selected_key`,
  findLocationButtonClicked: signal`currentLocationButtonClicked`,
      hideRockButtonClicked: signal`hideRockButtonClicked`,
        deleteButtonClicked: signal`deleteButtonClicked`,
       addRockButtonClicked: signal`addRockButtonClicked`
	
}, class MenuBar extends React.Component {
    render() {

      let normal = (
        <div>
        <IconButton
          tooltip="Add a Rock"
          tooltipPosition="bottom-left"
          onClick={() => this.props.addRockButtonClicked({lat: this.props.centerLocation.lat, lng: this.props.centerLocation.lng})}>
          <img src={addRock} width={width} height={height} />
        </IconButton>

        <IconButton
          tooltip="Find My Location"
          tooltipPosition="bottom-left"
          onClick = {() => this.props.findLocationButtonClicked({})}>
          <img src={findLocation} width={width} height={height} />
        </IconButton>

        <IconButton
          tooltip={this.props.showAll ? "See Only Unpicked Rocks" : "See All Rocks"}
          tooltipPosition="bottom-left"
          onClick = {() => this.props.hideRockButtonClicked({})}>
          <img src={this.props.showAll ? seeUnpicked : seeAll} width={width} height={height} />
        </IconButton>
        </div>
      );

      const editing = (
        <IconButton
          tooltip="Delete Rock?"
          tooltipPosition="bottom-left"
          onClick = {() => this.props.deleteButtonClicked({id: this.props.rockKey})}>
          <img src={deleteIcon} width={width} height={height}/>
        </IconButton>
      );

      let icons = null;

      if (this.props.editMode) {
        icons = editing;
      } else {
        icons = normal;
      }

      return (
        <div className={styles.root}>
          <AppBar position='static' color="inherit">
            <Toolbar>
              <IconButton className={styles.launchIcon}>
                <img src={launcherIcon}/>
              </IconButton>
              <Typography variant="title">
                RockApp
              </Typography>
							<Typography gutterBottom align="right">
              {icons}
							</Typography>
            </Toolbar>
          </AppBar>
        </div>
      );
    }
  }
);    
 
