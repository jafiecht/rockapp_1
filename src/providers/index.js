import { Provider } from 'cerebral'
import oada from '@oada/oada-cache'

var connections = {
  //uuid: oada.connect({domain, options, cache, token, noWebsocket})
}

function connect (payload) => {
  connections[payload.connection_id].connect(payload)
  //return something...
}

function get (payload) => {
  connections[payload.connection_id].get(payload)
  //return something...
}

function put (payload) => {
  connections[payload.connection_id].put(payload)
  //return something...
}

function post (payload) => {
  connections[payload.connection_id].post(payload)
  //return something...
}

function oadaDelete (payload) => {
  connections[payload.connection_id].del(payload)
  //return something...
}

export default oada =  Provider({
  connect,
  get,
  put,
  post,
  oadaDelete
})


