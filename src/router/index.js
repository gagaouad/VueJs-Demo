import Vue from 'vue'
import Router from 'vue-router'
import NewGame from '../components/NewGame'
import Game from '../components/Game'
import EndGame from '../components/EndGame'
import Admin from '../components/Admin'

Vue.use(Router)

export default new Router({

  //  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'NewGame', // pour les utiliser dans la vue <router-link :to="{name: 'NewGame'}">
      component: NewGame
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/Game',
      name: 'Game',
      component: Game
    },
    {
      path: '/EndGame',
      name: 'EndGame',
      component: EndGame
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    }
    // Exemple d'utilisation :
    // {
    //   path: '/article/:id(regex)',
    //   name: 'post',  // Dans la vue : <router-link :to="{name: 'post', params: {id:1}}"> si on veut cliquer avec le param 1
    //   component: Login
    // dans Login.vue pour recupérer le param il faut mettre {{ $route.params.id }}
    // },
    // {
    //   path: '/songs/create',
    //   name: 'song',
    //   component: CreateSong,
    //   children: [{
    //     path: 'b',
    //     component: AB,
    //     name: 'song.b'
    //   },
    //     {
    //       path: 'c',
    //       component: ABC,
    //       name: 'song.c'
    //     }]}
    // },
    // {
    //   path: '/songs/:songId/edit',
    //   name: 'song-edit',
    //   component: EditSong
    // },
    // {
    //   path: '*',
    //   redirect: 'songs'
    // }
  ]
})
