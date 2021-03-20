import Api from './Api'

export default {
  update (info) {
    return Api().post('locate', info)
  }
}
// Utilisation :
// Map.update({
//   lat:'vfdgrgb',
//   lon: 'vfbg'
// })
