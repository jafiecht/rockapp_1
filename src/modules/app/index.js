import { Module } from 'cerebral';
import stateTree from './stateTree.js';
import StorageModule from '@cerebral/storage';
import oada from '../../providers/oada';
import oadaMod from '../../modules/oada';

import { addRockLoc } from './chains';
import { setNewRockLoc } from './chains';
import { setRockPicked } from './chains';
import { hidePickedMarker } from './chains';
import { getCurrentLocation } from './chains';
import { showCurrentLocation } from './chains';
import { getMapCenter } from './chains';
import { showEdit } from './chains';
import { setBounds } from './chains';
import { inputTextChanged } from './chains';
//import { addCommentText } from './chains';
import { deleteRock } from './chains';
import { displayDomainModal } from './chains';
import { initSetMapCenter } from './chains';
import { finishEdit } from './chains';
//import { updateZoom } from './chains';
import { initialize } from './chains';


export default Module(m => {
  return {
    state: stateTree,

    signals: {
      addRockButtonClicked: addRockLoc,
      markerDragged: setNewRockLoc,
      pickButtonClicked: setRockPicked,
      hideRockButtonClicked: hidePickedMarker,
      handleLocationFound: getCurrentLocation,
      currentLocationButtonClicked: showCurrentLocation,
      mapDragged: getMapCenter,
      initSetCenter: initSetMapCenter,
      rockClicked: showEdit,
      boundsFound: setBounds,
      commentInputTextChanged: inputTextChanged,
      //addComment: addCommentText,
      deleteButtonClicked: deleteRock,
      doneButtonClicked: finishEdit,
      //zoomChange: updateZoom,
      initialize: initialize,
    },
    modules: {
      oada: oadaMod
    },
    providers :{
      oada
    },
    /*modules: {
      storage: StorageModule({
        target: localStorage,
	json: true,
	sync: {
          'rocks':'model.rocks',
          //'model': 'model',
          //'view': 'view',
        },
        prefix: 'localStorage',
      })
    },*/
  };
});
