<template>
  <q-page class="mainbg q-pa-md">
    <div align="center">
      <div class="q-mt-xl q-mb-xl row justify-center q-gutter-md">
        <img
          alt="FilaSinFila"
          src="~assets/logo.png"
        />
        <img
          alt="Free"
          src="~assets/free.png"
          style="max-width:120px; max-height:100px"
        />
      </div>
      <div class="q-gutter-y-md" style="">
        <div class="text-h4 text-white">¡Bienvenido!</div>
        <div class="row justify-center">
          <img
            alt="bannerMain"
            src="~assets/QR.png"
            class="q-ma-sm"
            style="max-width:300px; border: 3px solid white; border-radius:20px"
          />
          <img
            alt="bannerMain"
            src="~assets/TURNO.png"
            class="q-ma-sm"
            style="max-width:300px; border: 3px solid white; border-radius:20px; padding:10px"
          />
          <img
            alt="bannerMain"
            src="~assets/FSF.png"
            class="q-ma-sm"
            style="max-width:300px; border: 3px solid white; border-radius:20px; padding:10px"
          />
          <img
            alt="bannerMain"
            src="~assets/listo.png"
            class="q-ma-sm"
            style="max-width:300px; border: 3px solid white; border-radius:20px"
          />
        </div>
        <div class="text-body1 text-white">Para comenzar ingresa tu télefono para tomar tu turno</div>
        <q-form class="q-gutter-y-md" @submit="initUser">
          <div class="row justify-between" style="max-width:350px">
            <q-select class="col-4" dark placeholder="Código" rounded outlined v-model="codetel" :options="optionsCode" style="font-size:1.3em" :rules="[val => val.length > 0 || 'Ingresa el código']"/>
            <q-input class="col-7" dark placeholder="Teléfono" type="tel" v-model="tel" rounded outlined color="white" style="font-size:1.3em;" :rules="[val => val.length == 10 || 'Tu teléfono de 10 dígitos']" />
          </div>
          <q-btn label="Comenzar" rounded class="q-pt-xs q-pb-xs" color="secondary" style="color: #FFFFFF!important; font-size:1.3em; width:250px" type="submit" />
        </q-form>
      </div>
      <!--<div class="q-gutter-y-md" style="max-width:300px">
        <q-form class="q-gutter-y-md q-pt-md q-pb-md" @submit="initRegister">
          <q-input dark placeholder="Correo" type="email" v-model="mail" rounded outlined color="white" style="font-size:1.3em;" :rules="[val => val.length > 0 || 'Ingresa un correo']" />
          <div class="row justify-between">
            <q-select class="col-4" dark placeholder="Código" rounded outlined v-model="codetel" :options="optionsCode" style="font-size:1.3em" :rules="[val => val.length > 0 || 'Ingresa el código']"/>
            <q-input class="col-7" dark placeholder="Teléfono" type="tel" v-model="tel" rounded outlined color="white" style="font-size:1.3em;" :rules="[val => val.length == 10 || 'Tu teléfono de 10 dígitos']" />
          </div>
          <q-input dark placeholder="Password" type="password" v-model="password" rounded outlined color="white" style="font-size:1.3em;" :rules="[val => val.length >= 6 || 'Contraseña mínimo seis caracteres']" />
          <q-btn label="Registrarme" rounded class="q-pt-xs q-pb-xs" color="white" style="color: #8767D3!important; font-size:1.3em; width:250px" type="submit" />
        </q-form>
      </div>-->
      <q-separator color="white" inset class="q-mt-xl q-mb-lg" />
      <div class="text-h4 text-white">¿Tienes un negocio?</div>
      <div class="text-body1 text-white q-mt-md">¡Regístrate y envía notificaciones en tiempo real gratis!</div>
      <div class="text-body2 text-white q-ma-md">También puedes notificar a tus clientes vía SMS:</div>
      <div align="center">
        <q-table
          :data="dataTable"
          :columns="columnsTable"
          row-key="name"
          hide-bottom
          grid
          card-class="text-primary"
        />
      </div>
        <q-separator inset color="transparent" />
        <q-btn class="q-ma-md" rounded color="white" style="color: #8763D7!important; font-size:1.3em" label="Quiero registrar mi negocio" @click="registerBusiness" />
      <div class="text-white text-body1 ">O, si ya tienes cuenta:</div>
      <q-btn class="q-ma-md" label="Iniciar Sesión" unelevated outline rounded color="white" style="font-size:1.3em" @click="loginUser" />
    </div>
    <div class="text-white text-center q-mt-md" style="font-size:1.4em" @click="registerInfo=true">¿Por qué me tengo que registrar?</div>
    
    <q-dialog v-model="register" maximized>
      <div class="registerbg">
        <div class="contentinfobg">
          <q-btn class="q-ma-sm" color="white" dense flat icon="close" v-close-popup style="font-size: 2em;" />
          <q-card flat bordered align="center" class="q-ma-xl" style="border-radius:20px">
            <img
              class="q-mt-md q-mb-md"
              style="max-width:180px"
              alt="FilaSinFila"
              src="~assets/infoFila.png"
            />
            <q-card-section>
              <div class="text-primary text-bold text-subtitle1 q-mb-md" style="font-size:1.4em">CONFIRMA TU CÓDIGO</div>
              <div class="q-mb-md">
                <CodeInput :loading="false" class="input" v-on:complete="onComplete" fieldWidth="40" />
              </div>
              <div class="text-primary text-subtitle2 q-mb-md">Confirma el código de 6 dígitos que hemos enviado a tu número telefónico</div>
              <q-btn color="primary" rounded label="Confirmar" @click="registerTel" />
              <!--<q-btn color="primary" rounded label="Confirmar" @click="registerUser" />-->
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-dialog>

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
  </q-page>
</template>

<script>
import CodeInput from "vue-verification-code-input";
import axios from 'axios'
import VueAxios from 'vue-axios'
import { Notify } from 'quasar'
import { mapActions } from "vuex";

export default {
  name: 'Landing',
  components: {
    CodeInput
  },
  data() {
    return {
      columnsTable: [
        { name: 'paquete', align: 'center', label: 'Paquetes de mensajes', field: 'paqueteSMS'},
        { name: 'precio', align:'center', label:'Precio', field: 'precioSMS' },
        { name: 'flujo', align:'center', label: 'Flujo de clientes', field: 'flujoSMS' }
      ],
      dataTable: [
        {
          paqueteSMS: 'Chico (50 SMS)',
          precioSMS: '$85',
          flujoSMS: '>20 Clientes diarios',
        },
        {
          paqueteSMS: 'Mediano (100 SMS)',
          precioSMS: '$165',
          flujoSMS: '20-50 Clientes diarios',
        },
        {
          paqueteSMS: 'Grande (200 SMS)',
          precioSMS: '$320',
          flujoSMS: '50-100 Clientes diarios',
        }
      ],
      optionsCode:[
        '+52', '+1'
      ],
      mail: "",
      codetel: "+52",
      tel: "",
      password: "",
      register: false,
      login: false,
      registerInfo: false,
      code: null
    }
  },
  methods: {
    ...mapActions('store', ['setUser']),
    initUser(){
      axios.post('/search-tel',{
        tel: this.codetel + this.tel
      })
      .then(res => {
        console.log(res.data)
        console.log(res.status)
        if(res.data.existe == true){
          this.setUser(res.data)
          this.$router.push("/Home")
        }else{
          axios.post('/send-code', {
            phone: this.codetel + this.tel
          })
          .then(res => {
            console.log(res.data);
          })
          .catch(e => {
            console.log(e.response);
            Notify.create({
              message: 'Hubo un error al enviar tu código. Favor de intentarlo de nuevo más tarde',
              color: 'negative'
            })
          })
          this.register = true
        }
      })
      .catch(e => {
        console.log(e.response);
        Notify.create({
          message: 'Hubo un error en el proceso. Favor de intentarlo de nuevo más tarde',
          color: 'negative'
        })
      })
    },
    registerTel(){
      axios.post('/verify-code', {
        phone: this.codetel + this.tel,
        code: this.code 
      })
        .then(res => {
          console.log(res.data);
          axios.post('/new-user', {
            nombre: "",
            email: "",
            tel: this.codetel + this.tel,
            pass: "",
            role: "USER"
          })
          .then(res => {
            console.log(res.data)
            this.register = false
            this.setUser(res.data)
            this.$router.push("/Home")
          })
          .catch(e => {
            console.log(e.response.data)
            console.log(e.response.status)
            if(e.response.status===400){
              Notify.create({
                message: e.response.data.mensaje,
                color: 'negative'
              })
            }else{
              Notify.create({
                message: 'Hubo un error al intentar iniciar. Favor de intentarlo de nuevo',
                color: 'negative'
              })
            }
          })
        })
        .catch(e => {
          console.log(e.response);
          Notify.create({
            message: 'Hubo un error al verificar tu código. Verifica que ingresaste el correcto e inténtalo de nuevo',
            color: 'negative'
          })
        })
    },
    initRegister(){
      axios.post('/search-user',{
        email: this.mail,
        tel: this.codetel + this.tel
      })
        .then(res => {
          console.log(res.data)
          console.log(res.status)
          axios.post('/send-code', {
            phone: this.codetel + this.tel
          })
            .then(res => {
              console.log(res.data);
            })
            .catch(e => {
              console.log(e.response);
              Notify.create({
                message: 'Hubo un error al procesar tu solicitud. Favor de intentarlo de nuevo más tarde',
                color: 'negative'
              })
            })
          this.register = true
        })
        .catch(e => {
          console.log(e.response.data)
          console.log(e.response.status)
          if(e.response.status===400){
            Notify.create({
              message: e.response.data.mensaje,
              color: 'negative'
            })
          }else{
            Notify.create({
              message: 'Hubo un error al intentar registrarte. Favor de intentarlo de nuevo',
              color: 'negative'
            })
          }
        })
    },
    registerUser(){
      axios.post('/verify-code', {
        phone: this.codetel + this.tel,
        code: this.code 
      })
        .then(res => {
          console.log(res.data);
          axios.post('/new-user', {
            nombre: "",
            email: this.mail,
            tel: this.codetel + this.tel,
            pass: this.password,
            role: "USER"
          })
          .then(res => {
            console.log(res.data)
            this.register = false
            this.setUser(res.data)
            this.$router.push("/Login")
          })
          .catch(e => {
            console.log(e.response.data)
            console.log(e.response.status)
            if(e.response.status===400){
              Notify.create({
                message: e.response.data.mensaje,
                color: 'negative'
              })
            }else{
              Notify.create({
                message: 'Hubo un error al intentar registrarte. Favor de intentarlo de nuevo',
                color: 'negative'
              })
            }
          })
        })
        .catch(e => {
          console.log(e.response);
          Notify.create({
            message: 'Hubo un error al verificar tu código. Verifica que ingresaste el correcto e inténtalo de nuevo',
            color: 'negative'
          })
        })
    },
    loginUser(){
      this.$router.push("/Login")
    },
    registerBusiness(){
      this.$router.push("/Register")
    },
    onComplete(v) {
      console.log("onComplete ", v);
      this.code = v
    }
  },
}
</script>

<style scoped>
.mainbg {
  background: url(~assets/bg.png), rgb(145, 114, 184);
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

.registerbg {
  background: url(~assets/bg.png), rgba(145, 114, 184, .7);
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-blend-mode:multiply;
}

</style>