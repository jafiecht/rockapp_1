import React from 'react';
import { connect } from '@cerebral/react';
import { state, signal } from 'cerebral/tags';
import Drawer from 'material-ui/Drawer';
//import './marker-input.css';
import launcher from '../../icons/launcher.png';

export default connect ({
  rockPickStatus: state`view.rock_pick_state`,
         rockKey: state`model.selected_key`,
           rocks: state`model.rocks`,
        editMode: state`view.marker_edit_mode`,
	showAll: state`view.show_all_rocks`,

        pickButtonClicked: signal`pickButtonClicked`,
  commentInputTextChanged: signal`commentInputTextChanged`,
               addComment: signal`addComment`,
      deleteButtonClicked: signal`deleteButtonClicked`
  }, class MarkerInput extends React.Component {
    render() {
      const drawer = (
        <Drawer
	  variant="persistent"
	  anchor="bottom"
	  open={this.props.showAll}
	>
          <img src={launcher} />
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
