<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-secondary">
      <q-toolbar>
        <q-btn
          flat
          round
          icon="menu"
          style="font-size: 2em"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-img src="~assets/logob.png" style="max-width:200px" />

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      content-class="bg-secondary"
    >
      <q-btn
          flat
          round
          icon="arrow_back_ios"
          color="white"
          style="font-size: 2em"
          aria-label="Back"
          @click="leftDrawerOpen = !leftDrawerOpen"
      />
      <div v-if="loading" class="flex flex-center">
        <q-spinner-ball
          color="primary"
          size="10em"
        />
      </div>
      <div v-else>
        <div class="row items-center justify-around">
          <div class="text-white text-center text-bold text-h5">Hola {{name}}</div>
          <!--<q-btn 
            flat
            round
            icon="save"
            style="font-size: 1.5em"
            color="white"
            @click="saveUser" 
          />-->
        </div>
        <div class="bg-white q-mt-md q-pt-xs q-pb-md" align="center">
          <div class="q-mt-md text-primary text-bold text-subtitle1 text-center">NÚMERO REGISTRADO</div>
          <q-input bg-color="primary" dark rounded outlined v-model="tel" style="max-width: 250px; font-size:1.5em" />
          <div class="q-mt-md text-primary text-bold text-subtitle1 text-center">NOMBRE COMPLETO</div>
          <q-input bg-color="primary" dark rounded outlined v-model="name" style="max-width: 250px; font-size:1.5em" />
          <div class="q-mt-md text-primary text-bold text-subtitle1 text-center">CORREO</div>
          <q-input bg-color="primary" dark rounded outlined v-model="email" style="max-width: 250px; font-size:1.5em" />
        </div>

        <div class="bg-white q-pt-md text-primary text-body1 text-center" style="font-size:1.4em;">Saldo de Mensajes:</div>
        <div class="bg-white q-pt-md text-primary text-center text-bold" style="font-size:2em;">{{selectedBusiness.tokens}}</div>
         
        <div align="center" class="q-pa-md">
          <q-btn label="Cerrar Sesión" unelevated outlined rounded color="white" style="color: #8767D3!important; font-size:1.3em; width:250px" @click="logout" />
        </div>

      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { Notify } from 'quasar'
import VueQRCodeComponent from 'vue-qr-generator'
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import io from 'socket.io-client';

var socket = io();

export default {
  name: 'LayoutU',
  components: {
    VueQRCodeComponent
  },
  data () {
    return {
      loading: false,
      leftDrawerOpen: false,
      tel: "",
      name: "",
      email: ""
    }
  },
  computed: {
    ...mapGetters('store', ['maxPersonas', 'businessDetails', 'associateDetails', 'selectedBusiness'])
  },
  methods: {
    ...mapActions('store', ['cambiarMaxPersonas', 'cerrarSesion', 'updateOwner', 'updateBusiness']),
    saveUser(){
      axios.post('/update-owner/' + this.ownerDetails.ownerID, {
        nombre: this.name,
        email: this.email,
        telefono: this.tel,
        nombreF: this.nameF,
        direccionF: this.addressF
      })
        .then(res => {
          console.log(res.data)
          this.updateOwner({
            nombre: this.name,
            email: this.email,
            telefono: this.tel,
            nombreF: this.nameF,
            direccionF: this.addressF
          })
          if(this.businessDetails.nombreC !== this.nameC || this.businessDetails.direccionC !== this.addressC) {
            axios.post('/update-business/' + this.businessDetails.businessID, {
              nombreC: this.nameC,
              direccionC: this.addressC
            })
              .then(res => {
                console.log(res.data)
                this.updateBusiness({
                  nombreC: this.nameC,
                  direccionC: this.addressC
                })
                Notify.create({
                  message: 'Se ha modificado tu perfil',
                  color: 'positive'
                })
              })
              .catch(e => {
                console.log(e.response)
                Notify.create({
                  message: 'Hubo un error. Favor de intentarlo de nuevo más tarde',
                  color: 'negative'
                })
              })
          } else {
            Notify.create({
              message: 'Se ha modificado tu perfil',
              color: 'positive'
            })
          }
        })
        .catch(e => {
          console.log(e.response)
          Notify.create({
            message: 'Hubo un error. Favor de intentarlo de nuevo más tarde',
            color: 'negative'
          })
        })
    },
    logout(){
      this.cerrarSesion()
    }
  },
  mounted() {
    this.loading = true
    setTimeout(() => {
      this.tel = this.associateDetails.telefono,
      this.name = this.associateDetails.nombre,
      this.email = this.associateDetails.email,
      this.loading = false
    },1000)
  },
  created() {
    socket.on('add-token', (data) => {
      console.log(data)
      if(data.businessID == this.selectedBusiness._id){
        this.updateSelectedBusiness({
          tokens: data.tokens
        })
      }
    })
  }
}
</script>