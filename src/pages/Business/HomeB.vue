<template>
  <q-page align="center">
    <div class="bg-white text-center">
      <div class="text-body1 text-grey-7 q-pa-md">FilaSinFila te ofrece de manera gratuita notificarles a tus clientes en tiempo real. Si lo deseas, puedes adquirir <span class="text-primary text-bold">paquetes de mensajes</span> para notificar a tus clientes por <span class="text-primary text-bold">SMS</span> también.</div>
      <div class="q-ma-md">
        <q-btn v-if="listBusiness.length > 0" label="Cambiar Sucursal" color="primary" outline rounded @click="modalSucursal = true" />
      </div>
      <q-dialog v-model="modalSucursal">
        <q-card class="">
          <q-card-section class="q-gutter-y-md">
            <div class="text-primary text-h6 text-center">SELECCIONA TU SUCURSAL</div>
            <q-card class="shadow-10 text-center q-pa-md" style="border: solid 1px #dddddd; border-radius:20px">
              <div class="text-body2 text-grey-8">Sucursal Principal:<br><span class="text-body1 text-primary text-bold">{{businessDetails.nombreC}}</span></div>
              <div v-if="businessDetails._id === selectedBusiness._id" class="text-body1 text-primary">SUCURSAL SELECCIONADA</div>
              <q-btn v-else label="Seleccionar" unelevated rounded color="primary" @click="seleccionarPrincipal"/>
            </q-card>
            <div class="text-body2 text-grey-8 text-center">Sucursales adicionales:</div>
            <q-card v-for="(item, index) in listBusiness" :key="index" class="shadow-10 text-center q-pa-md" style="border: solid 1px #dddddd; border-radius:20px">
              <div class="text-body1 text-primary text-bold">{{item.nombreC}}</div>
              <div v-if="item._id === selectedBusiness._id" class="text-body1 text-primary">SUCURSAL SELECCIONADA</div>
              <q-btn v-else label="Seleccionar" unelevated rounded color="primary" @click="seleccionarAdicional(index)" />
            </q-card>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn label="Cerrar" outline color="negative" @click="modalSucursal = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <div class="text-h6 text-primary text-bold">{{selectedBusiness.nombreC}}</div>
      <div class="bg-primary q-pb-md q-ma-md" style="border-radius:20px">
        <div class="q-pt-md text-white" style="font-size: 1.5em">TURNO:</div>
        <div class="text-white text-bold" style="font-size: 4em">{{selectedBusiness.turnoActual}}</div>
      </div>
      <div class="text-primary text-subtitle1 q-pa-sm">Personas en espera:</div>
      <div class="text-primary text-bold" style="font-size:2em">{{selectedBusiness.turnosAcumulado - selectedBusiness.turnoActual}}</div>
      <div class="text-primary text-subtitle1 q-pa-sm">Personas en el establecimiento:</div>
      <div class="text-primary text-bold" style="font-size:2em">{{selectedBusiness.personasActual}}</div>
      <div class="text-primary text-subtitle1 q-pa-sm">Máximo de personas:</div>
      <div class="bg-white text-center text-primary text-bold" style="font-size:2em">{{selectedBusiness.maxPersonas}}</div>
      <div class="q-pa-md q-ma-md bg-primary" style="border-radius: 20px">
        <img src="~assets/checkin.png" style="max-width: 200px" @click="checkIn" />
      </div>
      <div class="q-pa-md q-ma-md bg-secondary" style="border-radius: 20px">
        <img src="~assets/checkout.png" style="max-width: 200px" @click="checkOut" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { Notify } from 'quasar'
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import io from 'socket.io-client';

var socket = io();

export default {
  name: 'HomeB',
  data() {
    return {
      modalSucursal: false,
      currentPeople: 2,
      currentTurn: 42,
      pushMessage: 'SECCIÓN DE PUSH Y COMUNICACIÓN INTERNA DEL NEGOCIO'
    }
  },
  computed: {
    ...mapGetters('store', ['maxPersonas', 'ownerDetails', 'businessDetails', 'selectedBusiness', 'listBusiness'])
  },
  methods: {
    ...mapActions('store', ['updateBusiness', 'setSelectedBusinessDetails', 'updateSelectedBusiness']),
    seleccionarPrincipal(){
      this.setSelectedBusinessDetails(this.businessDetails)
      this.modalSucursal = false
    },
    seleccionarAdicional(index){
      this.setSelectedBusinessDetails(this.listBusiness[index])
      this.modalSucursal = false
    },
    checkIn(){
      if(this.selectedBusiness.personasActual === this.selectedBusiness.maxPersonas) {
        Notify.create({
          message: 'Haz alcanzado el límite de personas en el establecimiento. Espera a que se retire una persona y realiza un checkout',
          color: 'negative'
        })
      } else {
          let bid = this.selectedBusiness._id
          axios.post('/check-in/' + bid, {
            personasActual: this.selectedBusiness.personasActual,
            turnoActual: this.selectedBusiness.turnoActual
          })
          .then(res => {
              console.log(res.data)
              if(res.data.mensaje == "ok-usuario"){
                var msgTokens = this.selectedBusiness.tokens - 1
                var pActual = this.selectedBusiness.personasActual + 1
                var tActual = this.selectedBusiness.turnoActual + 1
                this.updateSelectedBusiness({
                  personasActual: this.selectedBusiness.personasActual + 1,
                  turnoActual: this.selectedBusiness.turnoActual + 1,
                  tokens: msgTokens
                })
                socket.emit('update-turn', {
                    turnoActual: this.selectedBusiness.turnoActual,
                    businessID: this.selectedBusiness._id
                });
                socket.emit('tu-turno', {
                    message: "¡Ya es tu turno!",
                    userID: res.data.userID,
                    businessID: this.selectedBusiness._id
                });
                socket.emit('update-token', {
                  tokens: msgTokens,
                  businessID: this.selectedBusiness._id
                });
                socket.emit('update-b', {
                  personasActual: pActual,
                  turnoActual: tActual,
                  businessID: this.selectedBusiness._id
                });
                Notify.create({
                  message: 'Se mando mensaje SMS y notificación al usuario del siguiente turno.',
                  color: 'primary'
                })
              } else if(res.data.mensaje == "ok-usuario-nosms") {
                var pActual = this.selectedBusiness.personasActual + 1
                var tActual = this.selectedBusiness.turnoActual + 1
                this.updateSelectedBusiness({
                  personasActual: this.selectedBusiness.personasActual + 1,
                  turnoActual: this.selectedBusiness.turnoActual + 1
                })
                socket.emit('update-turn', {
                    turnoActual: this.selectedBusiness.turnoActual,
                    businessID: this.selectedBusiness._id
                });
                socket.emit('tu-turno', {
                    message: "¡Ya es tu turno!",
                    userID: res.data.userID,
                    businessID: this.selectedBusiness._id
                });
                socket.emit('update-b', {
                  personasActual: pActual,
                  turnoActual: tActual,
                  businessID: this.selectedBusiness._id
                });
                Notify.create({
                  message: '¡Se mandó notificación en tiempo real al usuario.',
                  color: 'primary'
                })
              } else if (res.data.mensaje == "ok-usuariodejado"){
                var pActual = this.selectedBusiness.personasActual
                var tActual = this.selectedBusiness.turnoActual + 1
                this.updateSelectedBusiness({
                  personasActual: this.selectedBusiness.personasActual,
                  turnoActual: this.selectedBusiness.turnoActual + 1
                })
                socket.emit('update-turn', {
                    turnoActual: this.selectedBusiness.turnoActual,
                    businessID: this.selectedBusiness._id
                });
                socket.emit('update-b', {
                  personasActual: pActual,
                  turnoActual: tActual,
                  businessID: this.selectedBusiness._id
                });
                Notify.create({
                  message: 'El usuario dejo el turno. Puedes hacer checkin, luego checkout de nuevo para llamar al siguiente turno.',
                  color: 'primary'
                })
              } else if (res.data.mensaje == "ok-nousuario"){
                var pActual = this.selectedBusiness.personasActual
                var tActual = this.selectedBusiness.turnoActual
                this.updateSelectedBusiness({
                  personasActual: this.selectedBusiness.personasActual
                })
                socket.emit('update-b', {
                  personasActual: pActual,
                  turnoActual: tActual,
                  businessID: this.selectedBusiness._id
                });
                Notify.create({
                  message: 'El turno siguiente no tiene un usuario asignado aún',
                  color: 'primary'
                })
              }
            })
            .catch(e => {
              console.log(e.response)
              Notify.create({
                message: 'Hubo un error. Favor de intentarlo de nuevo',
                color: 'negative'
              })
            })
      }
    },
    checkOut(){
      if(this.selectedBusiness.personasActual === 0){
        Notify.create({
          message: 'No hay ninguna persona dentro del establecimiento a realizar checkout.',
          color: 'negative'
        })
      } else {
        let bid = this.selectedBusiness._id
        axios.post('/check-out/' + bid, {
            personasActual: this.selectedBusiness.personasActual
          })
            .then(res => {
              console.log(res.data)
              var pActual = this.selectedBusiness.personasActual - 1
              var tActual = this.selectedBusiness.turnoActual
              this.updateSelectedBusiness({
                personasActual: pActual
              })
              socket.emit('update-b', {
                personasActual: pActual,
                turnoActual: tActual,
                businessID: this.selectedBusiness._id
              });
            })
            .catch(e => {
              console.log(e.response)
              Notify.create({
                message: 'Hubo un error. Favor de intentarlo de nuevo',
                color: 'negative'
              })
            })
      }
    }
  },
  mounted(){
    this.currentPeople = this.selectedBusiness.personasActual
    this.currentTurn = this.selectedBusiness.turnoActual
  },
  created(){
    socket.on('request-turn', (data) => {
      console.log(data)
      if(data.businessID == this.selectedBusiness._id){
        console.log("LETS UPDATE")
        this.updateSelectedBusiness({
          turnosAcumulado: data.turnosAcumulado
        })
        Notify.create({
          message: 'Nuevo turno asignado',
          color: 'primary'
        })
      }
    })
    socket.on('update-token-2', (data) => {
      console.log(data)
      if(data.businessID == this.selectedBusiness._id){
        this.updateSelectedBusiness({
          tokens: data.tokens
        })
      }
    })
    socket.on('update-b-2', (data) => {
      console.log(data)
      if(data.businessID == this.selectedBusiness._id){
        this.updateSelectedBusiness({
          personasActual: data.personasActual,
          turnoActual: data.turnoActual
        })
      }
    })
  }
}
</script>
