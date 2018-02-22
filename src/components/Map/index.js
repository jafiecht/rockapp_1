import React from 'react';
import _ from 'lodash';
import { connect } from '@cerebral/react';
import {state, signal} from 'cerebral/tags';
import uuid from 'uuid';
import Leaflet from 'leaflet';
import { Map, Marker, CircleMarker, TileLayer } from 'react-leaflet';
import Paper from 'material-ui/Paper';
import './Map.css';
import MarkerInput from '../MarkerInput';

const style = {
  height: 400,
  margin: 20,
  textAlign: 'center',
};

export default connect({
           rocks: state`model.rocks`,
         showAll: state`view.show_all_rocks`,
      currentLoc: state`model.current_location`,
   currentToggle: state`view.current_location_toggle`,
  centerLocation: state`model.map_center_location`,

                 markerDragged: signal`markerDragged`,
           handleLocationFound: signal`handleLocationFound`,
                    mapDragged: signal`mapDragged`,
  currentLocationButtonClicked: signal`currentLocationButtonClicked`,
                   rockClicked: signal`rockClicked`,
                   boundsFound: signal`boundsFound`,
                 initSetCenter: signal`initSetCenter` 
  },

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
      const rockIcon = Leaflet.icon({
        iconUrl: 'rock,.png',
        iconAnchor: [18, 50]
      });
      
      //I'll add the picked rock Icon later

      const position = [40.4286882, -86.9137644];
      const rockMarkers= [];
      if (this.props.rocks) {
        _.map(this.props.rocks, (rock,key) => {
          rockMarkers.push(
            <Marker
              key={key}
              position={[rock.location.lat, rock.location.lng]}
              draggable={true}
              icon={(rock.picked) ? rockIcon : rockIcon}
              onDragEnd={(e) => this.props.markerDragged({id: key, lat: e.target._latlng.lat, lng: e.target_latlng.lng})}
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
        <Paper style={style} zDepth={3}>
          <Map
            style={{height: "100%"}}
            dragging={true}
            center={(this.props.currentToggle) ? this.props.centerLocation : position} 
            ref='map'
            zoom={15}            
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
        </ Paper>
      );
    }
  }
);
