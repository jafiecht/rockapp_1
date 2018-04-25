import React from 'react';
import PropTypes from 'prop-types';
//import classNames from 'classNames';
import { withStyles, withTheme } from 'material-ui/styles';
import { AppBar, IconButton, Typography, Toolbar } from 'material-ui';
import { connect } from '@cerebral/react';
import { state, signal } from 'cerebral/tags';
import grey from 'material-ui/colors/grey';

import launcherIcon from './../../icons/launcher.png';
import addRock from './../../icons/add.png';
import findLocation from './../../icons/gps_found.ico';
import seeAll from './../../icons/eye_all_rocks.png';
import seeUnpicked from './../../icons/eye_unpicked.png';
import deleteIcon from './../../icons/delete.png';

const styles = theme => ({
  root: {
		backgroundColor: '#1c313a',
	},
	flex: {
	  flex: 1,
	},
	appIcon: {
	  [theme.breakpoints.up('xs')]: {
      marginLeft: -1.5*theme.spacing.unit,
      marginRight: 1.5*theme.spacing.unit,
		  width: 6*theme.spacing.unit,
		  height: 6*theme.spacing.unit,
		},
    [theme.breakpoints.down('xs')]: {
      marginLeft: -1*theme.spacing.unit,
      marginRight: 1*theme.spacing.unit,
		  width: 5*theme.spacing.unit,
		  height: 5*theme.spacing.unit,
		},
  },
	icon: {
    [theme.breakpoints.up('xs')]: {
      width: 5*theme.spacing.unit,
		  height: 5*theme.spacing.unit,
	  },
    [theme.breakpoints.down('xs')]: {
		  width: 4*theme.spacing.unit,
		  height: 4*theme.spacing.unit,
		},
  },
  button: {
	  [theme.breakpoints.up('xs')]: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
		},
	  [theme.breakpoints.down('xs')]: {
      marginLeft: 0*theme.spacing.unit,
      marginRight: 0*theme.spacing.unit,
		}, 
  },
});

class MenuBar extends React.Component {

  static propTypes = {
    theme: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  render() {
    const { classes, theme } =  this.props;

    const normal = (
		<div>
      <IconButton
        className={classes.button}
        onClick={() => this.props.addRockButtonClicked({lat: this.props.centerLocation.lat, lng: this.props.centerLocation.lng})}>
        <img src={addRock} className={classes.icon}/>
      </IconButton>

      <IconButton
        className={classes.button}
        onClick = {() => this.props.findLocationButtonClicked({})}>
        <img src={findLocation} className={classes.icon}/>
      </IconButton>

      <IconButton
        className={classes.button}
        onClick = {() => this.props.hideRockButtonClicked({})}>
        <img src={this.props.showAll ? seeUnpicked : seeAll} className={classes.icon}/>
      </IconButton>
			</div>
    );

    const editing = (
      <IconButton
        className={classes.button}
        onClick = {() => this.props.deleteButtonClicked({id: this.props.rockKey})}>
        <img src={deleteIcon} className={classes.icon}/>
      </IconButton>
    );

    let icons = null;
    if (this.props.editMode) {
      icons = editing
    } else {
      icons = normal
    }

    return (
      <AppBar position='static' classes={{root: classes.root}}>
        <Toolbar>
          <img src={launcherIcon} className={classes.appIcon}/>
          <Typography variant='title' color="inherit" className={classes.flex}>
            RockApp
          </Typography>
					<Typography>
            {icons}
					</Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default connect({
         showAll: state`view.show_all_rocks`,
        editMode: state`view.marker_edit_mode`,
  centerLocation: state`model.live_map_center`,
         rockKey: state`model.selected_key`,

  findLocationButtonClicked: signal`currentLocationButtonClicked`,
      hideRockButtonClicked: signal`hideRockButtonClicked`,
        deleteButtonClicked: signal`deleteButtonClicked`,
       addRockButtonClicked: signal`addRockButtonClicked`
  }, 
  withStyles(styles)(MenuBar)
);
