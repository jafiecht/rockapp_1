var stateTree = {
  model: {
    user: {},
    domain: '',
    'data_index': {
    },
    current_location: { lat: '40.428641', lng: '-86.913783' },
    live_map_center: { lat: '40.428641', lng: '-86.913783' },
		target_map_center: { lat: '40.428641', lng: '-86.913783' },
    rocks: {}, // { picked: true|false, location: { lat: '40.123', lng: '-86.123' }, comments: '' }
    selected_key: '',
    map_bounds: {},
    comment_input: '',
		zoom: '16',
  },
  view: {
    rock_pick_state: false,
    current_location_state: false,
    marker_edit_mode: false,
    current_location_toggle: false,
    show_all_rocks: true,
  }
}; 

export default stateTree; 
