<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-primary">
      <q-toolbar>
        <q-btn
          flat
          round
          icon="menu"
          style="font-size: 2em"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-img src="~assets/logo.png" style="max-width:200px" />

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      content-class="bg-primary"
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
          color="secondary"
          size="10em"
        />
      </div>
      <div v-else>
        <div class="row items-center justify-around">
          <div class="text-white text-center text-bold text-h5">¡Hola! Bienvenido a FilaSinFila</div>
          <q-btn 
            flat
            round
            icon="save"
            style="font-size: 1.5em"
            color="white"
            @click="saveUser" 
          />
        </div>
        <div class="bg-white q-mt-md q-pt-xs q-pb-md" align="center">
          <div class="q-mt-md text-primary text-bold text-subtitle1 text-center">NÚMERO REGISTRADO</div>
          <q-input bg-color="primary" dark rounded outlined v-model="tel" style="max-width: 250px; font-size:1.5em" />
          <!--<div class="q-mt-md text-primary text-bold text-subtitle1 text-center">NOMBRE COMPLETO</div>
          <q-input bg-color="primary" dark rounded outlined v-model="name" style="max-width: 250px; font-size:1.5em" />
          <div class="q-mt-md text-primary text-bold text-subtitle1 text-center">CORREO</div>
          <q-input bg-color="primary" dark rounded outlined v-model="email" style="max-width: 250px; font-size:1.5em" />-->
        </div>
        <!--<div class="bg-white q-pt-md q-pb-md" align="left">
          <q-toggle
            :label="sms"
            color="primary"
            false-value="SMS"
            true-value="WHATSAPP"
            v-model="sms"
            icon="sms"
            size="xl"
            class="text-bold"
            style="font-size:1.5em; color:#8763D7;"
          />
        </div>-->
        <div align="center" class="q-ma-md">
          <q-btn label="Salir" unelevated outlined rounded color="white" style="color: #8767D3!important; font-size:1.3em; width:250px" @click="logout" />
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
import { mapGetters, mapActions } from "vuex";
import axios from 'axios'
import VueAxios from 'vue-axios'

export default {
  name: 'LayoutU',
  data () {
    return {
      loading: false,
      leftDrawerOpen: false,
      tel: "",
      sms: "SMS",
      name: "",
      email: ""
    }
  },
  computed: {
    ...mapGetters('store', ['userDetails'])
  },
  methods: {
    ...mapActions('store', ['cerrarSesion', 'updateUser']),
    saveUser(){
      axios.post('/update-user/' + this.userDetails.userID, {
        nombre: this.name,
        email: this.email,
        telefono: this.tel,
        sms: this.sms
      })
        .then(res => {
          console.log(res.data)
          this.updateUser({
            nombre: this.name,
            email: this.email,
            telefono: this.tel,
            sms: this.sms
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
    },
    logout(){
      this.cerrarSesion()
    }
  },
  mounted() {
    this.loading = true
    setTimeout(() => {
      this.name = this.userDetails.nombre
      this.tel = this.userDetails.telefono
      this.sms = this.userDetails.sms
      this.email = this.userDetails.email
      this.loading = false
    },1000)
  }
}
</script>
