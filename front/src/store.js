import Vue from "vue";
import Vuex from "vuex";
import axios from "./axios-auth";
import globalAxios from 'axios'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('access_token') || null,
    name:  localStorage.getItem('name') || null,
    email : localStorage.getItem('email') || null,
  },
  mutations: {
    authUser(state, appData) {
      state.token = appData.token
      state.name = appData.name
      state.email = appData.email
    },
    destroyToken(state, token){
      state.token = null
    }
  },
  actions: {
    signup({ commit }, authData) {
      axios
        .post("/user/register", {
          last_name: authData.last_name,
          first_name: authData.first_name,
          email: authData.email,
          password: authData.password
        })
        .then(res => console.log(res))
        .catch(error => console.log(error));
    },
    login({ commit }, authData) {

      return new Promise((resolve, reject)=>{

        axios.post("/user/login", {
            email: authData.email,
            password: authData.password
          })
          .then(res => {
            console.log(res.data)
            let appData = {
              token : res.data.token,
              name : res.data.Name,
              email : res.data.User

            }
            localStorage.setItem('access_token', appData.token )
            localStorage.setItem('name', appData.name )
            localStorage.setItem('email', appData.email )
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + appData.token
            commit("authUser", appData);
            resolve(res)

          })
          .catch(error => {
            console.log(error)
            reject(error)
          });

      })

    },
    destroyToken(context){
        console.log(context)
       // localStorage.removeItem('access_token')
        localStorage.clear();
        context.commit('destroyToken')
    }
  },
  getters: {
    loggedIn(state){
      return state.token !== null
    }
  }
});
