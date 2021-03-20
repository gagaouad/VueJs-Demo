import axios from 'axios'
var url = window.location.origin
if (window.location.protocol === 'https:') { // pour le proxy
  url += '/41'
}
if (window.location.port === '8080') { // pour le mode developpement
  url = 'http://' + window.location.hostname + ':80'
}
// pour connecter vue avec Express
export default () => {
  return axios.create({
    baseURL: url
  })
}
