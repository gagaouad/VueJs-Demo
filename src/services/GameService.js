import Api from './Api'

export default {
  new (data) {
    return Api().post('newGame', data)
  },
  waitOtherPlayer (data) {
    return Api().post('waitOtherPlayer', data)
  },
  waitSecondPlayer () {
    return Api().get('waitSecondPlayer')
  },
  quit (data) {
    return Api().post('quit', data)
  },
  posAdverse (data) {
    return Api().post('posAdverse', data)
  },
  adminMessage (data) {
    return Api().post('AdminMessage', data)
  }
}
// Utilisation :
// GameService.new({
//   pseudo:'abc'
// })
