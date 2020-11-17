<template>
  <q-page class="registerbg">
    <div align="center">
      <img
        alt="FilaSinFila"
        src="~assets/RegisterB.png"
        style="width: 100%; max-width: 500px"
      />
      <div style="max-width:300px">
        <div class="text-body1 text-white">Notificaciones en tiempo real para tus clientes de manera gratuita</div>
        <q-form class="q-gutter-y-md q-pt-md q-pb-md" @submit="initRegister">
          <div class="row justify-between">
            <q-select class="col-4" dark placeholder="Código" rounded outlined v-model="codetel" :options="optionsCode" style="font-size:1.3em" :rules="[val => val.length > 0 || 'Ingresa el código']"/>
            <q-input class="col-7" dark placeholder="Teléfono" v-model="tel" type="tel" rounded outlined color="white" style="font-size:1.3em;" :rules="[val => val.length == 10 || 'Tu teléfono de 10 dígitos']" />
          </div>
          <q-input dark placeholder="Nombre completo" v-model="name" rounded outlined color="white" style="font-size:1.3em;" :rules="[val => val.length > 0 || 'Ingresa tu nombre']" />
          <q-input dark placeholder="Correo" v-model="email" type="email" rounded outlined color="white" style="font-size:1.3em;" :rules="[val => val.length > 0 || 'Ingresa un correo']" />
          <q-input dark placeholder="Contraseña" v-model="pass" type="password" rounded outlined color="white" style="font-size:1.3em;" :rules="[val => val.length >= 6 || 'Contraseña mínimo seis caracteres']" />
          <div class="text-primary text-subtitle1 text-bold">INFORMACIÓN DEL NEGOCIO</div>
          <q-input dark placeholder="Nombre Comercial" v-model="nameC" rounded outlined color="white" style="font-size:1.3em;" :rules="[val => val.length > 0 || 'Completa este campo']" />
          <q-input dark placeholder="Dirección Física" v-model="addressC" rounded outlined color="white" style="font-size:1.3em;" :rules="[val => val.length > 0 || 'Completa este campo']" />
          <q-input dark placeholder="Razón Social" v-model="nameF" rounded outlined color="white" style="font-size:1.3em;" :rules="[val => val.length > 0 || 'Completa este campo']" />
          <q-input dark placeholder="Dirección Fiscal" v-model="addressF" rounded outlined color="white" style="font-size:1.3em;" :rules="[val => val.length > 0 || 'Completa este campo']" />
          <!-- <div class="text-primary text-subtitle1 text-bold">ASOCIADOS</div>
          <div>
            <q-card v-for="(item, index) in asociados" :key="index" class="q-mb-sm">
              <q-card-section horizontal class="justify-between items-center">
                <div class="q-ml-md text-body1 text-primary text-bold">{{item.nombre}}</div>
                <q-card-actions class="justify-around q-px-md">
                  <q-btn color="info" icon="edit" round style="font-size: 1em;" @click="editarAsociado(index)"/>
                  <q-btn color="negative" icon="remove" round style="font-size: 1em;" @click="eliminarAsociado(index)"/>
                </q-card-actions>
              </q-card-section>
            </q-card>
          </div>
          <div class="row items-center justify-center">
            <q-btn outline color="white" icon="add" round style="font-size: 1.3em;" @click="addA = true"/>
            <div class="q-ml-md text-body1 text-white text-bold">Agregar Asociado</div>
          </div>
          <q-separator color="white" />
          <div class="text-primary text-subtitle1 text-bold">SUCURSALES ADICIONALES</div>
          <div>
            <q-card v-for="(item, index) in sucursales" :key="index" class="q-mb-sm">
              <q-card-section horizontal class="justify-between items-center">
                <div class="q-ml-md text-body1 text-primary text-bold">{{item.nombreSucursal}}</div>
                <q-card-actions class="justify-around q-px-md">
                  <q-btn color="info" icon="edit" round style="font-size: 1em;" @click="editarSucursal(index)"/>
                  <q-btn color="negative" icon="remove" round style="font-size: 1em;" @click="eliminarSucursal(index)"/>
                </q-card-actions>
              </q-card-section>
            </q-card>
          </div>
          <div class="row items-center justify-center">
            <q-btn outline color="white" icon="add" round style="font-size: 1.3em;" @click="addS = true"/>
            <div class="q-ml-md text-body1 text-white text-bold">Agregar Sucursal</div>
          </div>
          <q-separator color="white" /> -->
          <q-checkbox v-model="terms" dark color="primary"><div class="text-white text-body1 text-weight-bold" @click="registerInfo = true">Acepto Términos y Condiciones</div></q-checkbox>
          <q-btn label="Registrarme" unelevated rounded class="q-pt-xs q-pb-xs" color="white" style="color: #8767D3!important; font-size:1.3em; width:250px" type="submit" />
        </q-form>
      </div>
    </div>
    
    <q-dialog v-model="addA">
      <q-card>
        <q-card-section class="q-gutter-y-md">
          <div class="text-primary text-h6 text-center">Información del asociado</div>
          <q-input placeholder="Nombre Completo" v-model="nameA" rounded outlined color="primary" style="font-size:1.3em;" />
          <q-input placeholder="Email" type="mail" v-model="emailA" rounded outlined color="primary" style="font-size:1.3em;" />
          <q-input placeholder="Teléfono" type="tel" v-model="telA" rounded outlined color="primary" style="font-size:1.3em;" />
          <q-input placeholder="Password" type="password" v-model="passA" rounded outlined color="primary" style="font-size:1.3em;" />
        </q-card-section>
        <q-card-actions>
          <q-btn label="Agregar" unelevated rounded color="primary" style="font-size:1.3em; width:250px" @click="agregarAsociado" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editA">
      <q-card>
        <q-card-section class="q-gutter-y-md">
          <div class="text-primary text-h6 text-center">Información del asociado</div>
          <q-input placeholder="Nombre Completo" v-model="editNameA" rounded outlined color="primary" style="font-size:1.3em;" />
          <q-input placeholder="Email" type="mail" v-model="editEmailA" rounded outlined color="primary" style="font-size:1.3em;" />
          <q-input placeholder="Teléfono" type="tel" v-model="editTelA" rounded outlined color="primary" style="font-size:1.3em;" />
          <q-input placeholder="Password" type="password" v-model="editPassA" rounded outlined color="primary" style="font-size:1.3em;" />
        </q-card-section>
        <q-card-actions>
          <q-btn label="Modificar" unelevated rounded color="primary" style="font-size:1.3em; width:250px" @click="modificarAsociado" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addS">
      <q-card>
        <q-card-section class="q-gutter-y-md">
          <div class="text-primary text-h6 text-center">Información de la Sucursal</div>
          <q-input placeholder="Nombre de Sucursal" v-model="nameC_A" rounded outlined color="primary" style="font-size:1.3em;" />
          <q-input placeholder="Dirección de Sucursal" v-model="addressC_A" rounded outlined color="primary" style="font-size:1.3em;" />
        </q-card-section>
        <q-card-actions>
          <q-btn label="Agregar" unelevated rounded color="primary" style="font-size:1.3em; width:250px" @click="agregarSucursal" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editS">
      <q-card>
        <q-card-section class="q-gutter-y-md">
          <div class="text-primary text-h6 text-center">Información de la Sucursal</div>
          <q-input placeholder="Nombre de Sucursal" v-model="editnameC_A" rounded outlined color="primary" style="font-size:1.3em;" />
          <q-input placeholder="Dirección de Sucursal" v-model="editaddressC_A" rounded outlined color="primary" style="font-size:1.3em;" />
        </q-card-section>
        <q-card-actions>
          <q-btn label="Agregar" unelevated rounded color="primary" style="font-size:1.3em; width:250px" @click="modificarSucursal" />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
              <q-btn color="primary" rounded label="Confirmar" @click="registerBusiness" />
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
  name: 'Register',
  components: {
    CodeInput
  },
  data() {
    return {
      optionsCode:[
        '+52', '+1'
      ],
      codetel: "+52",
      terms: false,
      tel: null,
      name: "",
      email: "",
      pass: "",
      nameC: "",
      addressC: "",
      nameF: "",
      addressF: "",
      register: false,
      login: false,
      registerInfo: false,
      code: null,
      addA: false,
      editA: false,
      addS: false,
      editS: false,
      nameA: "",
      emailA: "",
      telA: "",
      passA: "",
      nameC_A: "",
      addressC_A: "",
      editNameA: "",
      editEmailA: "",
      editTelA: "",
      editPassA: "",
      editnameC_A: "",
      editaddressC_A: "",
      currentIndex: null,
      asociados: [],
      sucursales: []
    }
  },
  methods: {
    ...mapActions('store', ['setOwner', 'setBusiness']),
    initRegister(){
      axios.post('/search-owner',{
        email: this.email,
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
              message: 'Hubo un error al enviar tu código. Favor de intentarlo de nuevo',
              color: 'negative'
            })
          }
        })
    },
    registerBusiness(){
      axios.post('/verify-code', {
        phone: this.codetel + this.tel,
        code: this.code 
      })
        .then(res => {
          console.log(res.data);
          axios.post('/new-owner', {
            nombre: this.name,
            email: this.email,
            tel: this.codetel + this.tel,
            pass: this.pass,
            nombreF: this.nameF,
            direccionF: this.addressF,
            role: "OWNER"
          })
            .then(res => {
              console.log(res.data)
              this.setOwner(res.data)
              this.register = false
              axios.post('/new-business', {
                nombreC: this.nameC,
                direccionC: this.addressC,
                tokens: 0,
                turnoActual: 0,
                turnosAcumulado: 0,
                personasActual: 0,
                maxPersonas: 5,
                ownerID: res.data.ownerID,
                principal: true
              })
                .then(res => {
                  console.log(res.data)
                  this.setBusiness(res.data)
                  this.register = false
                  this.$router.push("/Login")
                })
                .catch(e => {
                  console.log(e.response)
                  Notify.create({
                    message: 'Hubo un error al registrar tu negocio. Favor de intentarlo de nuevo',
                    color: 'negative'
                  })
                })
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
          console.log(e.response)
          Notify.create({
            message: 'Hubo un error al verificar tu código. Verifica que ingresaste el correcto e inténtalo de nuevo',
            color: 'negative'
          })
        })
    },
    onComplete(v) {
      console.log("onComplete ", v);
      this.code = v
    },
    agregarAsociado(){
      this.addA = false
      this.asociados.push({
        nombre: this.nameA,
        email: this.emailA,
        tel: this.telA,
        pass: this.passA
      })
      this.nameA = "",
      this.emailA = "",
      this.telA = "",
      this.passA = ""
    },
    agregarSucursal(){
      this.addS = false
      this.sucursales.push({
        nombreSucursal: this.nameC_A,
        direccionSucursal: this.addressC_A
      })
      this.nameC_A = "",
      this.addressC_A = ""
    },
    editarAsociado(index){
      this.editNameA = this.asociados[index].nombre
      this.editEmailA = this.asociados[index].email
      this.editTelA = this.asociados[index].tel
      this.editPassA = this.asociados[index].pass
      this.currentIndex = index
      this.editA = true
    },
    editarSucursal(index){
      this.editnameC_A = this.sucursales[index].nombreSucursal
      this.editaddressC_A = this.sucursales[index].direccionSucursal
      this.currentIndex = index
      this.editS = true
    },
    modificarAsociado(){
      this.asociados[this.currentIndex] = {
        nombre: this.editNameA,
        email: this.editEmailA,
        tel: this.editTelA,
        pass: this.editPassA
      }
      this.editA = false
    },
    modificarSucursal(){
      this.sucursales[this.currentIndex] = {
        nombreSucursal: this.editnameC_A,
        direccionSucursal: this.editaddressC_A,
      }
      this.editS = false
    },
    eliminarAsociado(index){
      this.asociados.splice(index, 1)
    },
    eliminarSucursal(index){
      this.sucursales.splice(index, 1)
    }
  },
}
</script>

<style scoped>

.infobg {
  background: url(~assets/bg.png), rgba(110, 224, 255, .7);
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-blend-mode:multiply;
}

.registerbg {
  background-color: rgb(110, 224, 255);
}
</style>