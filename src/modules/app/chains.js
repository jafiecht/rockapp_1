import * as oada from '../oada/sequences';
import _ from 'lodash';
import uuid from 'uuid';
import axios from 'axios';
import { sequence } from 'cerebral';
import { set, toggle, debounce, when} from 'cerebral/operators';
import { props, state } from 'cerebral/tags';
import { setStorage, getStorage } from '@cerebral/storage/operators';
var Promise = require('bluebird');

//So, since this is an early work of mine, pretty much everything 
//happens here in Chains. Sorry about that:(

const = setupTree: {'*':{}}

/*//Define our fetch function, which I think is important
export const fetch = [
  ({props}) => ({
    path: '/bookmarks/rocks',
    setupTree: {'*':{}},
  }),
  oada.fetchTree,
  when(state`oada.bookmarks.rocks`), {
    true: [mapOadaToRecords],
    false: [
      ({props}) => ({
        contentType: 'application/vnd.oada.rocks.1+json',
        path: '/bookmarks/rocks',
        data: {},
        uuid: uuid()
      }),
      oada.createResourceAndLink
    ],
  },
]*/

function mapOadaToRecords({state, props}) {
  state.set('model.rocks', {});
  let rocks = state.get('oada.bookmarks.rocks');
  return Promise.map(Object.keys(rocks || {}), (key) => {
    //ignore reserved keys used by oada
    if (key.charAt(0) !== '_') state.set(`model.rocks.${key}`, rocks[key])
    return
  }).then(() => {return})
}

//This lets the app know that a marker has been selected for editing
export const showEdit = [
  set(state`model.selected_key`, props`id`),
  set(state`view.marker_edit_mode`, true),
];

//When a new rock is added, this function creates the rock instance
export const addRockLoc = [
  createRock,
  ({props, state}) => ({
    data: props.rock,
    contentType: 'application/vnd.oada.rocks.1+json',
    path: 'bookmarks/rocks/',
    linkToId: true
  }),
  //oada.createResourceAndLink,
  //fetch,
  oada.put
];

function createRock({props, state}) {
  var rockId = uuid.v4();
  var rock = {
    "picked": false, 
    "comment":'',
    "location": {
      "lat": props.lat,
      "lng": props.lng
    }    
  };
  return {id: rockId, rock, uuid: rockId}
};

//When a rock is moved, this updates the location
export const setNewRockLoc = [
  ({state, props}) => ({
    data: {    
      "picked": state.get(`model.rocks.${props.id}.picked`), 
      "comment": state.get(`model.rocks.${props.id}.comment`),
      "location": {
        "lat": props.lat,
        "lng": props.lng
      } 
    },
    contentType: 'application/vnd.oada.rocks.1+json',
    path: 'bookmarks/rocks/'+props.id,
  }),
  oada.put,
  mapOadaToRecords,
];

//This function toggles a rock's picked status locally. Changes are committed at the end of the edit
export const setRockPicked = [
  ({state, props}) => state.set(`model.rocks.${props.id}.picked`, props.picked),
];

//This function toggles between seeing all rocks and seeing unpicked
export const hidePickedMarker = [
  toggle(state`view.show_all_rocks`),
];

//This sets the current user location in the state
export const getCurrentLocation = [
  ({state,props}) => state.set('model.current_location', { lat: props.lat, lng: props.lng }),
  set(state`view.current_location_state`, true),
];

//This tells the map to center on the user
export const showCurrentLocation = [
  //By changing target_map_center, we force our map to redraw. However, if 
  //the variable hasn't changed since last we set it, the map will not redraw.
  //Ergo, if we stayed in the same place, but moved the map, we can't force
  //the map to center on our location. By changing the variable to an abitrary value
  //for 1 millisecond, we force the map to redraw regardless. 
  set(state`model.target_map_center`, { lat: 43.645224, lng: -115.9932984 }),
  debounce(1),
  {
    continue: [set(state`model.target_map_center`, state`model.current_location`)],
    discard: [],
  },
];

//This tracks the leaflet map center. Tricky, since leaflet maintains it's own state.
export const getMapCenter = [
  setMapCenter,
  set(state`model.map_bounds`, props`bounds`),
];

//This and setBounds below set the map stats at initial mount
export const initSetMapCenter = [
  setMapCenter,
];

export const setBounds = [
  set(state`model.map_bounds`, props`bounds`),
];

//This tracks the comment changes locally. Changes are commited at the end of editing below.
export const inputTextChanged = [
  set(state`model.rocks.${props`id`}.comment`, props`value`)
];

//Yup, it just deletes rock instances.
export const deleteRock = [
  ({state, props}) => ({
    path: '/bookmarks/rocks/'+props.id,
  }),
  oada.oadaDelete,
  set(state`view.marker_edit_mode`, false),
  set(state`model.selected_key`, ''),
  //fetch,
  mapOadaToRecords,
];

//When the user finishes editing, this sets everything back to normal and commits the comment
export const finishEdit = [
  ({state, props}) => ({
    data: {    
      "picked": state.get(`model.rocks.${props.id}.picked`), 
      "comment": state.get(`model.rocks.${props.id}.comment`),
      "location": {
        "lat": props.lat,
        "lng": props.lng
      } 
    },
    contentType: 'application/vnd.oada.rocks.1+json',
    path: 'bookmarks/rocks/'+props.id,
  }),
  oada.put,
  set(state`view.marker_edit_mode`, false),
  set(state`model.selected_key`, ''),
  mapOadaToRecords,
];


//When the app boots up, we'll load all the rock data in our database
export const initialize = [
  //oada.connect,
  //fetch,
  //oada.configureCache,
  //oada.configureWS,
];

//Used above several times
function setMapCenter({props, state}) {
  state.set('model.live_map_center', { lat: props.lat, lng: props.lng });
};

function setMapCenter({props, state}) {
  state.set('model.live_map_center', { lat: props.lat, lng: props.lng });
};
