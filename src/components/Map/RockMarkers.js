import React from 'react';
import {Marker, Popup} from 'react-leaflet';
import unpickedRock from './../../icons/rock.png';
import DivIcon from 'react-leaflet-div-icon';

const mapCenter = [40.8442444, -85.09722];

export default class RockMarker extends React.Component {

  render () {
    const marker = (
      <DivIcon position={mapCenter} >
        <img src={unpickedRock} width={25} height={36} />
      </DivIcon>
    );

    return (
      <div>
        {marker}
      </div>
    );
}
}
