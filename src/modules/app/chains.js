import _ from 'lodash';
import uuid from 'uuid';
import axios from 'axios';
import { sequence } from 'cerebral';
import { set, toggle, debounce} from 'cerebral/operators';
import { props, state } from 'cerebral/tags';
import { setStorage, getStorage } from '@cerebral/storage/operators';

//This lets the app know that a marker has been selected for editing
export const showEdit = [
  set(state`model.selected_key`, props`id`),
  set(state`view.marker_edit_mode`, true),
];

const deleteLocalRocks = [
 set(state`model.rocks`, {}),
];

//Pretty Much Anytime a rock changes, we put the change to the server
const putRockToServer = [
  // First, put the new resource to the server
  ({props}) => axios({
    method: 'PUT',
    url: 'https://localhost/resources/'+props.id,
    headers: {
      "Authorization": "Bearer def",
      "Content-Type": "application/json"
    },
    data: {
      "picked": props.picked,
      "comment": props.comment,
      "location": {
        "lat": props.lat,
        "lng": props.lng 
      }
    }
  }),
  // Then, link to this resource from /bookmarks/rocks
  ({props}) => axios({
    method: 'PUT',
    url: 'https://localhost/bookmarks/rocks/'+props.id,
    headers: {
      "Authorization": "Bearer def",
      "Content-Type": "application/json"
    },
    data: {
      "_id": 'resources/'+props.id,
      "_rev": ''   
    }
  }),
];

//When a new rock is added, this function creates the rock instance
export const addRockLoc = [
  () => ({id: uuid.v4(), picked: false, comment:''}),
  putRockToServer,
  deleteLocalRocks,
  getServerData,
  getServerRock,
];

//When a rock is moved, this updates the location
export const setNewRockLoc = [
  ({state, props}) => ({picked: state.get(`model.rocks.${props.id}.picked`), comment: state.get(`model.rocks.${props.id}.comment`)}),
  putRockToServer,
  deleteLocalRocks,
  getServerData,
  getServerRock,
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
  //I'm not sure we need the current location available toggle, but I could be wrong.
  set(state`view.current_location_state`, true),
];

//This tells the map to center on the user
export const showCurrentLocation = [
  //By changing target_map_center, we force our map to redraw. However, if 
  //the variable hasn't changed since last we set it, the map will not redraw.
  //Ergo, if we stayed in the same place, but moved the map, we can't force
  //the map to center on our location. By changing the variable to an abitrary value
  //for 1 millisecond, we force the map to redraw regardless. 
  set(state`model.target_map_center`, { lat: 43.64074, lng: -115.993081 }),
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
  //Remove the link to this resource at /bookmarks/rocks
  ({props}) => axios({
    method: 'DELETE',
    url: 'https://localhost/bookmarks/rocks/'+props.id,
    headers: {
      "Authorization": "Bearer def",
    }
  }),
  getServerData,
  deleteLocalRocks,
  set(state`view.marker_edit_mode`, false),
  set(state`model.selected_key`, ''),
  getServerRock,
];

//When the user finishes editing, this sets everything back to normal and commits the comment
export const finishEdit = [
  ({state, props}) => ({lat: state.get(`model.rocks.${props.id}.location.lat`), lng: state.get(`model.rocks.${props.id}.location.lng`), comment: state.get(`model.rocks.${props.id}.comment`), picked: state.get(`model.rocks.${props.id}.picked`)}),
  putRockToServer,
  getServerData,
  deleteLocalRocks,
  set(state`view.marker_edit_mode`, false),
  set(state`model.selected_key`, ''),
  getServerRock,
];


//When the app boots up, we'll load all the rock data in our database
export const initialize = [
  getServerData,
  getServerRock,
  ];

//Used above several times
function setMapCenter({props, state}) {
  state.set('model.live_map_center', { lat: props.lat, lng: props.lng });
};

//Just what it sounds like.
function getServerData({props, state}) {
  //First, we call for the rocks bookmark
  return axios({
    method: 'GET',
    url: 'https://localhost/bookmarks/rocks', 
    headers: {
      Authorization: "Bearer def"
    }
  })
    .then(function (response) {
       //We save the response to the state tree
       state.set('oada.rocks', response.data)
       console.log('success')
    })
    .catch(function (error) {
      //Print the error to the console
      console.log(error)
      
      //If the error is 404, create resource. We parallel put to resources and bookmarks
      if (error.response.status == 404) {
        const id = uuid.v4()

        axios({
          method: 'PUT',
          url: 'https://localhost/resources/'+id,
          headers: {
            "Authorization": "Bearer def",
            "Content-Type": "application/json"
          },
          data: {}
        })

         axios({
          method: 'PUT',
          url: 'https://localhost/bookmarks/rocks',
          headers: {
            "Authorization": "Bearer def",
            "Content-Type": "application/json"
          },
          data: {
            "_id": 'resources/'+id,
            "_rev": ''   
          }
        })
        //Run it again!   
        getServerData({props, state})  
      } 
    })
};

//This function iterates over the rock id's and pulls them in fresh
function getServerRock({state}) {
  //Do we have any rock id's?
  if (state.get('oada.rocks')) {
 
    //Get a list of keys and only use those that don't start w/ _
    Object.keys(state.get('oada.rocks')).forEach((key) => {
      if (key.charAt(0) !== '_')  {
        axios({
          method: 'GET',
          url: 'https://localhost/bookmarks/rocks/'+key,
          headers: {
            Authorization: "Bearer def"
          }
        })
          .then(function (response) {
            //We save the response to the state tree
            state.set('oada.rocks.'+key, response.data)
            state.set('model.rocks.'+key, response.data)
          }).catch(function (error) {
            console.log(error)
          })
      }
    })
  }
};

function setMapCenter({props, state}) {
  state.set('model.live_map_center', { lat: props.lat, lng: props.lng });
};

