<template>
  <q-page class="q-pt-xl bg-primary">
    <div align="center">
      <div class="text-center q-mb-md text-h4 text-white text-bold" style="">BIENVENIDO A</div>
      <div class="bg-white" style="max-width: 90%; border-radius: 30px" align="center">
        <div class="text-primary text-bold text-h6 q-pt-md q-pb-md">{{businessDetails.nombreC}}</div>
      </div>
      <div align="center">
        <img src="~assets/turn.png" style="max-width: 80%" class="q-pt-xl" @click="takeTurn" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Notify } from 'quasar'
import axios from 'axios'
import VueAxios from 'vue-axios'
import io from 'socket.io-client';

var socket = io();

export default {
  name: 'Welcome',
  methods: {
    ...mapActions('store', ['updateUser', 'updateBusiness', 'setBusiness']),
    takeTurn(){
      let bid = this.businessDetails.businessID
      axios.post('/take-turn/'+bid, {
        userID: this.userDetails.userID
      })
        .then(res => {
            console.log(res.data)
            this.updateUser({
              turnoActual: res.data.turnoActual,
              turnID: res.data.turnID
            })
            this.updateBusiness({
              turnoActual: res.data.turnoNegocio
            })
            socket.emit('request-turn', {
              businessID: bid,
              turnosAcumulado: res.data.turnoActual
            });
            this.$router.push("/Turn/" + res.data.turnID)
          })
          .catch(e => {
            console.log(e.response)
            Notify.create({
              message: 'Hubo un error al tomar un turno. Favor de intentarlo de nuevo',
              color: 'negative'
            })
          })
    }
  },
  computed: {
    ...mapGetters('store', ['businessDetails', 'userDetails', 'token'])
  },
  mounted() {
    console.log(this.$route.params.id)
    axios.get('/detect-qr/' + this.$route.params.id)
      .then(res => {
            if(this.userDetails.telefono){
              console.log(res.data)
              this.setBusiness(res.data)
            }else{
              this.$router.push("/")
            }
      })
      .catch(e => {
            console.log(e.response)
            Notify.create({
              message: 'Lo sentimos. No se encontró ningun negocio registrado con el QR proporcionado.',
              color: 'negative'
            })
            this.$router.push("/Home")
      })
  }
}
</script>
