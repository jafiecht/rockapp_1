import React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { connect } from '@cerebral/react';
import { state, signal } from 'cerebral/tags';
import Drawer from 'material-ui/Drawer';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
//import './marker-input.css';
import pickUp from '../../icons/rock_pick_up.png';
import putDown from '../../icons/rock_put_down.png';

const height=40;
const width=40;

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

  }, class MarkerInput extends React.Component {
    

    render() {
     const currock = (this.props.rocks && this.props.rockKey) ? this.props.rocks[this.props.rockKey] : { comment: 'No Dice :(' };
      const rocksTest = (this.props.rocks) ? 'Got Rocks' : 'No Rocks';
      const keyTest = (this.props.rockKey) ? 'Got Key' : 'No Key';
			console.log('this.props = ', this.props);
			console.log('logical = ', !!(this.props.rockKey));
			console.log('keytest = ', keyTest);

      const drawer = (
        <Drawer
          variant="persistent"
	  anchor="bottom"
	  open={this.props.editMode}>
          <Toolbar>
            <Button variant="raised" onClick={() => this.props.doneButtonClicked({})}>
              Finish
            </Button>
            <TextField
	      label="Comment Below"
              value={currock.comment}
              onChange={(e) => this.props.commentInputTextChanged({value: e.target.value, id: this.props.rockKey }) }
            />
	    <IconButton
	      onClick={() => this.props.pickButtonClicked({id: this.props.rockKey, picked: !this.props.rockPickStatus})}>
              <img src={this.props.rockPickStatus ? putDown : pickUp} height={height} width={width} />
            </IconButton>
          </Toolbar>
        </Drawer>
      );
      
      return (
        <div>
          {drawer}
        </div>
      );
    }
  }
   
  
);
