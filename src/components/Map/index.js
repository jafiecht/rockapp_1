import React from 'react';
import Paper from 'material-ui/Paper';
import FieldMap from './Map.js';

const style = {
  height: 300,
  margin: 20,
  textAlign: 'center',
};

export default class MapContainer extends React.Component {
  render() {
    return (
      <Paper style={style} zDepth={3}>
	<FieldMap />
      </ Paper>
    );
  }
}

