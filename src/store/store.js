import decode from 'jwt-decode'
import axios from 'axios'
import VueAxios from 'vue-axios'

const state = {
    token: '',
    maxPersonas: 5,
    userDetails: {},
    ownerDetails: {},
    associateDetails: {},
    businessDetails: {},
    selectedBusiness: {},
    listBusiness: [],
    listAssociates: []
}
const mutations = {
    setSelectedBusiness(state, payload){
        state.selectedBusiness = payload
    },
    setListBusiness(state, payload){
        state.listBusiness = payload
    },
    setListAssociates(state, payload){
        state.listAssociates = payload
    },
    addListBusiness(state, payload){
        state.listBusiness.push(payload)
    },
    addListAssociates(state, payload){
        state.listAssociates.push(payload)
    },
    updateListBusiness(state, payload){
        Object.assign(state.listBusiness[payload.index], {
            nombreC: payload.nombreC,
            direccionC: payload.direccionC
        })
    },
    updateListAssociates(state, payload){
        console.log(payload)
        Object.assign(state.listAssociates[payload.index], {
            nombre: payload.nombre,
            email: payload.email,
            telefono: payload.telefono
        })
    },
    deleteListBusiness(state, payload){
        state.listBusiness.splice(payload, 1)
    },
    deleteListAssociates(state, payload){
        state.listAssociates.splice(payload, 1)
    },
    obtenerUsuario(state, payload){
        state.token = payload;
        if(payload === ''){
          state.userDetails = {}
          state.ownerDetails = {}
          state.associateDetails = {}
          state.businessDetails = {}
          state.listBusiness = []
          state.listAssociates = []
        }else{
          let tokendetails = decode(payload)
          if(tokendetails.data.role == "USER"){
            axios.get('/get-user/' + tokendetails.data.userID)
              .then(res => {
                console.log(res.data)
                state.userDetails = res.data
                this.$router.push("/Home")
              })
              .catch(e => {
                console.log(e.response)
              })
          } else if(tokendetails.data.role == "OWNER"){
            axios.get('/get-owner/' + tokendetails.data.ownerID)
              .then(res => {
                console.log(res.data)
                state.ownerDetails = res.data
                axios.get('/get-business/' + tokendetails.data.ownerID)
                    .then(res => {
                        console.log(res.data)
                        state.businessDetails = res.data
                        state.selectedBusiness = res.data
                        axios.get('/get-list-business/' + tokendetails.data.ownerID)
                        .then(res => {
                            state.listBusiness = res.data
                            axios.get('/get-list-associates/' + tokendetails.data.ownerID)
                            .then(res => {
                                state.listAssociates = res.data
                                this.$router.push("/HomeB")
                            })
                            .catch(e => {
                                console.log(e.response)
                            })
                        })
                        .catch(e => {
                            console.log(e.response)
                        })
                    })
                    .catch(e => {
                        console.log(e.response)
                    })
              })
              .catch(e => {
                console.log(e.response)
              })
          } else if(tokendetails.data.role == "ASSOCIATE"){
            axios.get('/get-associate/' + tokendetails.data.associateID)
            .then(res => {
              console.log(res.data)
              state.associateDetails = res.data
              axios.get('/get-business/' + tokendetails.data.ownerID)
                  .then(res => {
                      console.log(res.data)
                      state.businessDetails = res.data
                      state.selectedBusiness = res.data
                      axios.get('/get-list-business/' + tokendetails.data.ownerID)
                      .then(res => {
                        state.listBusiness = res.data
                        this.$router.push("/HomeA")
                      })
                      .catch(e => {
                          console.log(e.response)
                      })
                  })
                  .catch(e => {
                      console.log(e.response)
                  })
            })
            .catch(e => {
              console.log(e.response)
            })
          }
        }
    },
    changeMaxPersonas(state, payload){
        state.maxPersonas = payload
    },
    setUserDetails (state, payload) {
        state.userDetails = payload
    },
    updateUserDetails (state, payload) {
        Object.assign(state.userDetails, payload)
    },
    setOwnerDetails (state, payload) {
        state.ownerDetails = payload
    },
    updateOwnerDetails (state, payload) {
        Object.assign(state.ownerDetails, payload)
    },
    setAssociateDetails (state, payload) {
        state.associateDetails = payload
    },
    updateAssociateDetails (state, payload) {
        Object.assign(state.associateDetails, payload)
    },
    setBusinessDetails (state, payload) {
        state.businessDetails = payload
    },
    updateBusinessDetails (state, payload) {
        Object.assign(state.businessDetails, payload)
    },
    updateSelectedBusinessDetails (state, payload ){
        Object.assign(state.selectedBusiness, payload)
    }
}
const actions = {
    setUser({commit}, payload){
        commit('setUserDetails', payload)
    },
    updateUser({commit}, payload){
        commit('updateUserDetails', payload)
    },
    setOwner({commit}, payload){
        commit('setOwnerDetails', payload)
    },
    updateOwner({commit}, payload){
        commit('updateOwnerDetails', payload)
    },
    setAssociate({commit}, payload){
        commit('setAssociateDetails', payload)
    },
    updateAssociate({commit}, payload){
        commit('updateAssociateDetails', payload)
    },
    setBusiness({commit}, payload){
        commit('setBusinessDetails', payload)
    },
    setSelectedBusinessDetails({commit}, payload){
        commit('setSelectedBusiness', payload)
    },
    updateSelectedBusiness({commit}, payload){
        commit('updateSelectedBusinessDetails', payload)
    },
    updateBusiness({commit}, payload){
        commit('updateBusinessDetails', payload)
    },
    guardarUsuario({commit}, payload){
        localStorage.setItem('token', payload.token);
        commit('obtenerUsuario', payload.token)
    },
    cerrarSesion({commit}){
        commit('obtenerUsuario', '');
        localStorage.removeItem('token');
        this.$router.push('/');
    },
    leerToken({commit}){
        const gettoken = localStorage.getItem('token');
        if(gettoken){
          commit('obtenerUsuario', gettoken);
        }else{
          commit('obtenerUsuario', '');
        }
    },
    cambiarMaxPersonas({commit}, payload){
        commit('changeMaxPersonas', payload)
    },
    setListBusinessDetails ({commit}, payload) {
        commit('setListBusiness', payload)
    },
    setListAssociatesDetails ({commit}, payload) {
        commit('setListAssociates', payload)
    },
    addListBusinessDetails ({commit}, payload) {
        commit('addListBusiness', payload)
    },
    addListAssociatesDetails ({commit}, payload) {
        commit('addListAssociates', payload)
    },
    updateListBusinessDetails ({commit}, payload) {
        commit('updateListBusiness', payload)
    },
    updateListAssociatesDetails ({commit}, payload) {
        commit('updateListAssociates', payload)
    },
    deleteListBusinessDetails ({commit}, payload) {
        commit('deleteListBusiness', payload)
    },
    deleteListAssociatesDetails ({commit}, payload) {
        commit('deleteListAssociates', payload)
    }
}
const getters = {
    estaActivo: state => !!state.token,
    maxPersonas: state => {
        return state.maxPersonas
    },
    userDetails: state => {
        return state.userDetails
    },
    ownerDetails: state => {
        return state.ownerDetails
    },
    businessDetails: state => {
        return state.businessDetails
    },
    associateDetails: state => {
        return state.associateDetails
    },
    listBusiness: state => {
        return state.listBusiness
    },
    listAssociates: state => {
        return state.listAssociates
    },
    selectedBusiness: state => {
        return state.selectedBusiness
    },
    token: state => {
        return state.token
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}