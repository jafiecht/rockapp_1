import React from 'react';
import _ from 'lodash';
import { connect } from '@cerebral/react';
import {state, signal} from 'cerebral/tags';
import uuid from 'uuid';
import Leaflet from 'leaflet';
import { Map, Marker, CircleMarker, TileLayer } from 'react-leaflet';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';

import './Map.css';
import MarkerInput from '../MarkerInput';
import rockIcon from '../../icons/rock.png';
import pickedRockIcon from '../../icons/pickedRock.png';

const styles = theme => ({
  mapContainer: {
    display: 'flex',
    order: '1',
    width: '100%',
    height: '100%',
  },
  map: {
    position: 'relative',
		display: 'flex',
		width: '100%',
		height: '100%',
  },
});

class RockMap extends React.Component {
  componentDidMount() {
    this.refs.map.leafletElement.locate()
    //Get initial center of the map
    const centerLat = this.refs.map.leafletElement.getCenter().lat;
    const centerLng = this.refs.map.leafletElement.getCenter().lng;
    console.log('this.props = ', this.props);
    this.props.initSetCenter({lat:centerLat, lng:centerLng});
		
    //Get initial bounds of the map
    const bounds = this.refs.map.leafletElement.getBounds();
    this.props.boundsFound({bounds: bounds});
  }    

  render() {
    const { classes, theme } = this.props;

		const stateTreeLatitude = this.props.centerLocation.lat;
		const stateTreeLongitude = this.props.centerLocation.lng;

    //Add Current Location Marker
    const currentMarker = [];
    const currentPosition = this.props.currentLoc
      ? [this.props.currentLoc.lat, this.props.currentLoc.lng]
      : [40.1234, -86.12342];
        
    if (currentPosition[0]) {
      currentMarker.push(
        <CircleMarker
          key={uuid.v4}
          center={currentPosition}
          radius={8}
          opacity={1.0}
          color={"white"}
          weight={2}
          fillColor={'#0080ff'}
          fillOpacity={0.8}
        >
        </CircleMarker>
      );
    }
      
    //Draw the rock markers
    const unpickedRock = Leaflet.icon({
      iconUrl: rockIcon,
      iconAnchor: [18, 50]
    });

    const pickedRock = Leaflet.icon({
      iconUrl: pickedRockIcon,
      iconAnchor: [18, 50] 	     
    });

    const position = [stateTreeLatitude, stateTreeLongitude];

    const rockMarkers= [];
    if (this.props.rocks) {
      _.map(this.props.rocks, (rock,key) => {
        rockMarkers.push(
          <Marker
            key={key}
            position={[rock.location.lat, rock.location.lng]}
            draggable={true}
            icon={(rock.picked) ? pickedRock : unpickedRock}
            onDragEnd={(e) => this.props.markerDragged({id: key, lat: e.target._latlng.lat, lng: e.target._latlng.lng})}
            onClick={(e) => this.props.rockClicked({id: key})}
            opacity={this.props.showAll || (!this.props.showAll && !rock.picked) ? 1.0 : 0.0}
          >
          </Marker>
        );
      });  
    }
      
    const moveEnd = () => {
      if (!this.refs.map) return;
      this.props.mapDragged({
        lat: this.refs.map.leafletElement.getCenter().lat,
        lng: this.refs.map.leafletElement.getCenter().lng,
        bounds: this.refs.map.leafletElement.getBounds()
      });
    }
      
    return (
		
      <div className={classes.map}>
        <Map
          dragging={true}
          center={(this.props.currentToggle) ? this.props.centerLocation : position} 
          ref='map'
          zoom={'16'}           
          onLocationfound={(e) => this.props.handleLocationFound({lat:e.latlng.lat, lng:e.latlng.lng})}
          onMoveend={moveEnd}
          >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          />
          {rockMarkers}
          {currentMarker}
        </Map>
      </div>
			
    );
  }
}

RockMap.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default connect({
           rocks: state`model.rocks`,
         showAll: state`view.show_all_rocks`,
      currentLoc: state`model.current_location`,
   currentToggle: state`view.current_location_toggle`,
  centerLocation: state`model.map_center_location`,
	     zoomLevel: state`model.zoom`,

                 markerDragged: signal`markerDragged`,
           handleLocationFound: signal`handleLocationFound`,
                    mapDragged: signal`mapDragged`,
  currentLocationButtonClicked: signal`currentLocationButtonClicked`,
                   rockClicked: signal`rockClicked`,
                   boundsFound: signal`boundsFound`,
                 initSetCenter: signal`initSetCenter`,
							handleZoomChange: signal`zoomChange`,
  },
  withStyles(styles, { withTheme: true })(RockMap)
);


