import _ from 'lodash';
import uuid from 'uuid';
import { set, toggle, debounce } from 'cerebral/operators';
import { props, state } from 'cerebral/tags';
import { setStorage, getStorage } from '@cerebral/storage/operators';

export const showEdit = [
  set(state`model.selected_key`, props`id`),
  set(state`view.marker_edit_mode`, true),
];

export const addRockLoc = [
  ({state,props}) => {
    const id = uuid.v4()
    state.set(`model.rocks.${id}`, {
      picked: false,
      comment: '',
      location: {lat: props.lat, lng: props.lng}
    })
  },
];

export const setNewRockLoc = [ 
  ({state,props}) => state.set(`model.rocks.${props.id}.location`, { lat: props.lat, lng: props.lng }),
];

export const setRockPicked = [
  ({state,props}) => state.set(`model.rocks.${props.id}.picked`, props.picked),
  set(state`view.rock_pick_state`, props`picked`),
];

export const hidePickedMarker = [
  toggle(state`view.show_all_rocks`),
];

export const getCurrentLocation = [
  ({state,props}) => state.set('model.current_location', { lat: props.lat, lng: props.lng }),
  //I'm not sure we need the current location available toggle, but I could be wrong.
	set(state`view.current_location_state`, true),
];

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

//I don't think I need zoom tracking...
/*export const updateZoom = [
  set(state`model.zoom`, props`zoom`),
];*/

export const inputTextChanged = [
  set(state`model.rocks.${props`id`}.comment`, props`value`)
];

/*export const addCommentText = [
  ({state,props}) => state.set(state`model.rocks.${props.id}.comments`, props.text),
];*/

export const deleteRock = [
  set(state`view.marker_edit_mode`, false),
  ({state,props}) => state.unset(`model.rocks.${props.id}`),
  set(state`model.selected_key`, '')
];

export const finishEdit = [
  set(state`view.marker_edit_mode`, false),
  set(state`model.selected_key`, '')
];

function setMapCenter({props, state}) {
  state.set('model.live_map_center', { lat: props.lat, lng: props.lng });
};
