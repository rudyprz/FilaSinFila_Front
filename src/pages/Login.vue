<template>
  <q-page class="mainbg q-pa-md">
    <div align="center">
      <img
        class="q-mt-xl q-mb-xl"
        alt="FilaSinFila"
        src="~assets/logob.png"
      />
      <div class="q-gutter-y-lg" style="max-width:250px">
        <q-input dark placeholder="Correo" v-model="user" rounded outlined color="white" style="font-size:1.3em;" />
        <q-input dark placeholder="Password" type="password" v-model="pass" rounded outlined color="white" style="font-size:1.3em;" />
        <q-btn label="Olvide mi Contraseña" unelevated rounded class="q-pt-xs q-pb-xs" color="primary" style="font-size:1em" @click="forgot = true" />
        <q-btn :loading="loading1" label="Iniciar Sesión" unelevated rounded class="q-pt-xs q-pb-xs" color="white" style="color: #8767D3!important; font-size:1.3em; width:250px" @click="loginUser" />
      </div>
    </div>
    <div class="text-white text-center q-mb-md absolute-bottom" style="font-size:1.4em" @click="registerInfo=true">Términos y condiciones</div>

    <q-dialog v-model="registerInfo" maximized>
      <div class="infobg">
        <div class="contentinfobg">
          <q-btn class="q-ma-sm" color="white" dense flat icon="close" v-close-popup style="font-size: 2em;" />
          <q-card flat bordered align="center" class="q-ma-xl" style="border-radius:20px">
            <img
              style="max-width:200px"
              alt="FilaSinFila"
              src="~assets/infoFila.png"
            />
            <q-card-section>
              <div class="text-primary text-bold text-subtitle1 q-mb-md" style="font-size:1.4em">VENTANA DE NOTIFICACIONES</div>
              <div class="text-primary text-bold text-subtitle1 q-mb-md" style="font-size:1.4em">AVISO DE PRIVACIDAD</div>
              <div class="text-primary text-bold text-subtitle1 q-mb-md" style="font-size:1.4em">PREGUNTAS FRECUENTES</div>
              <div class="text-primary text-bold text-subtitle1 q-mb-md" style="font-size:1.4em">TÉRMINOS Y CONDICIONES</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-dialog>

    <q-dialog v-model="forgot">
      <q-card flat bordered align="center" class="q-ma-xl" style="border-radius:20px; min-width:300px">
        <q-card-section>
          <div class="text-primary text-bold text-h6 q-mb-md" style="font-size:1.4em">Ingresa tu correo registrado para reestablecer tu contraseña</div>
          <q-input type="email" placeholder="Correo" v-model="mailForgot" rounded outlined color="primary" style="font-size:1.3em;" />
          <q-btn :loading="loading1" label="Enviar" unelevated rounded class="q-pt-xs q-pb-xs" color="white" style="color: #8767D3!important; font-size:1.2em; width:250px" @click="forgotPass" />
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import axios from 'axios'
import VueAxios from 'vue-axios'
import { Notify } from 'quasar'
import { mapActions } from "vuex";

export default {
  name: 'Login',
  data() {
    return {
      loading1: false,
      forgot: false,
      user: null,
      pass: null,
      register: false,
      login: false,
      registerInfo: false,
      mailForgot: ""
    }
  },
  methods: {
    ...mapActions('store', ['setUser', 'setOwner', 'setAssociate', 'setBusiness', 'guardarUsuario', 'setListBusinessDetails', 'setListAssociatesDetails', 'setSelectedBusinessDetails']),
    forgotPass(){
      if(this.mailForgot == null || this.mailForgot == undefined || this.mailForgot == ""){
        Notify.create({
          message: 'Por favor introduce tu correo',
          color: 'negative'
        })
      }else{
        this.loading1 = true
        axios.post('/forgot-pass', {
          email: this.mailForgot
        })
        .then(res => {
          console.log(res.data)
          Notify.create({
            message: res.data.mensaje,
            color: 'positive'
          })
          this.loading1 = false
          this.forgot = false
        })
        .catch(e => {
          console.log(e.response)
          this.loading1 = false
          Notify.create({
            message: e.response.data.mensaje,
            color: 'negative'
          })
        })
      }
    },
    loginUser(){
      this.loading1 = true
      axios.post('/login-user', {
        email: this.user,
        pass: this.pass
      })
        .then(res => {
          console.log(res.data);
          if (res.data.role == "OWNER"){
            this.setOwner(res.data)
            this.guardarUsuario(res.data)
            axios.get('/get-business/' + res.data.ownerID)
              .then(res => {
                console.log(res.data)
                this.setBusiness(res.data)
                this.setSelectedBusinessDetails(res.data)
                let oID = res.data.ownerID
                axios.get('/get-list-business/' + oID)
                .then(res => {
                    this.setListBusinessDetails(res.data)
                    axios.get('/get-list-associates/' + oID)
                    .then(res => {
                        this.setListAssociatesDetails(res.data)
                        console.log("asociados: " + res.data)
                        this.loading1 = false
                        this.$router.push("/HomeB")
                    })
                    .catch(e => {
                        console.log(e.response)
                        this.loading1 = false
                    })
                })
                .catch(e => {
                    console.log(e.response)
                    this.loading1 = false
                })
              })
              .catch(e => {
                console.log(e.response)
                Notify.create({
                  message: 'Hubo un error al intentar ingresar. Favor de intentarlo de nuevo más tarde',
                  color: 'negative'
                })
                this.loading1 = false
              })
          } else if (res.data.role == "ASSOCIATE"){
            this.setAssociate(res.data)
            this.guardarUsuario(res.data)
            axios.get('/get-business/' + res.data.ownerID)
              .then(res => {
                console.log(res.data)
                this.setBusiness(res.data)
                this.setSelectedBusinessDetails(res.data)
                axios.get('/get-list-business/' + res.data.ownerID)
                .then(res => {
                    this.setListBusinessDetails(res.data)
                    this.loading1 = false
                    this.$router.push("/HomeA")
                })
                .catch(e => {
                    console.log(e.response)
                    this.loading1 = false
                })
              })
              .catch(e => {
                console.log(e.response)
                Notify.create({
                  message: 'Hubo un error al intentar ingresar. Favor de intentarlo de nuevo más tarde',
                  color: 'negative'
                })
                this.loading1 = false
              })
          }
        })
        .catch(e => {
          console.log(e.response);
          if (e.response.status === 400){
            Notify.create({
              message: 'Correo y/o contraseña no son válidos',
              color: 'negative'
            })
          } else if (e.response.status === 500){
            Notify.create({
              message: 'Hubo un error al intentar ingresar. Favor de intentarlo de nuevo',
              color: 'negative'
            })
          }
          this.loading1 = false
        })
    }
  },
}
</script>

<style scoped>
.mainbg {
  background: url(~assets/bg.png), rgb(110, 224, 255);
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-blend-mode:multiply;
}

.infobg {
  background: url(~assets/bg.png), rgba(110, 224, 255, .7);
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-blend-mode:multiply;
}

</style>