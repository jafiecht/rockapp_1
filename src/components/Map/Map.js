import React from 'react';
import {Map, TileLayer, Marker} from 'react-leaflet';
import RockMarker from './RockMarkers.js';

const tiles = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const attr = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
const mapCenter = [40.8442444, -85.09722];
const zoomLevel = 18;

export default class FieldMap extends React.Component {
  render() {
    return (
      <Map style={{height: "100%"}} center={mapCenter} zoom={zoomLevel}>
        <TileLayer
          url={tiles}
          attribution={attr}
        />
	<RockMarker /> 
      </Map>
    )
  }
}
