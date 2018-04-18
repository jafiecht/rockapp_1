import React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { connect } from '@cerebral/react';
import { state, signal } from 'cerebral/tags';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
//import './marker-input.css';
import pickUp from '../../icons/rock_pick_up.png';
import putDown from '../../icons/rock_put_down.png';
import check from '../../icons/check.png';

const styles = theme => ({
  root: {
	  backgroundColor: '#1c313a',
	},
	icons: {
    height: 4*theme.spacing.unit,
    width: 4*theme.spacing.unit,
  },
	buttons: {
	  marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
	},
});

class MarkerInput extends React.Component {

  static propTypes = {
    theme: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
	};

  render() {
    const {classes, theme } = this.props;

    const currock = (this.props.rocks && this.props.rockKey) ? this.props.rocks[this.props.rockKey] : { comment: '' };

    return (
      <Drawer
        variant="persistent"
	      anchor="bottom"
	      open={this.props.editMode}
				classes={{root: classes.root}}>
        <Toolbar>
          <IconButton
					  className={classes.buttons}
					  onClick={() => this.props.doneButtonClicked({})}>
            <img src={check} className={classes.icons}/>
          </IconButton>
          <TextField
						fullWidth
	          label="Comment Below"
            value={currock.comment}
            onChange={(e) => this.props.commentInputTextChanged({value: e.target.value, id: this.props.rockKey }) }
          />
	        <IconButton
					  className={classes.buttons}
	          onClick={() => this.props.pickButtonClicked({id: this.props.rockKey, picked: !this.props.rockPickStatus})}>
            <img src={this.props.rockPickStatus ? putDown : pickUp} className={classes.icons}/>
          </IconButton>
        </Toolbar>
      </Drawer>
    );
  }
}
   
  
export default connect ({
  rockPickStatus: state`view.rock_pick_state`,
         rockKey: state`model.selected_key`,
           rocks: state`model.rocks`,
        editMode: state`view.marker_edit_mode`,
    commentValue: state`model.comment_input`,

        pickButtonClicked: signal`pickButtonClicked`,
  commentInputTextChanged: signal`commentInputTextChanged`,
               addComment: signal`addComment`,
	doneButtonClicked: signal`doneButtonClicked`
  },
  withStyles(styles)(MarkerInput)
);

