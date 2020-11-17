<template>
  <q-page class="turnbg">
    <div align="center" class="q-gutter-y-md">
      <div style="width: 80%; border-radius: 20px" class="bg-white" align="center">
        <div class="q-ma-sm text-primary text-bold" style="font-size: 2em">EN TURNO: {{businessDetails.turnoActual}}</div>
        <div class="q-ma-sm text-bold text-grey-9" style="font-size: 2.5em">TU TURNO</div>
        <div class="text-primary text-bold" style="font-size: 8em">{{userDetails.turnoActual}}</div>
      </div>
      <div v-if="!onRate && !onTurn" class="bg-primary text-white text-subtitle2 text-center q-pa-md" style="width: 80%; border:1px solid white; border-radius: 20px">
        Te enviaremos una notificación vía SMS o Whatsapp al número registrado en tu cuenta cuando sea tu turno
      </div>
      <div v-if="onRate" class="bg-primary text-white text-subtitle2 text-center q-pa-md" style="width: 80%; border-radius: 20px">
        ¡Gracias por tu visita! Te invitamos a calificar tu experiencia
      </div>
      <q-btn v-if="!onTurn && !onRate" label="DEJAR TURNO" unelevated outlined rounded color="white" style="color: #8767D3!important; font-size:1.3em; width:250px" @click="initLeave" />
      <div v-if="onTurn" class="bg-green-9 text-center q-ma-md q-pa-sm text-white text-subtitle1" style="border-radius:20px">¡YA ES TU TURNO! <br> Puedes pasar al establecimiento</div>
      <q-btn label="CALIFICAR" unelevated outlined rounded color="white" style="color: #8767D3!important; font-size:1.3em; width:250px" @click="toRate" />
    </div>

    <q-dialog v-model="confirm" maximized>
      <div class="confirmbg" align="right">
          <q-btn class="q-ma-sm" color="white" dense flat icon="close" v-close-popup style="font-size: 2em;" />
          <q-card flat bordered align="center" class="q-ma-xl" style="border-radius:20px">
            <img
              style="max-width:200px"
              alt="FilaSinFila"
              src="~assets/infoFila.png"
            />
            <q-card-section>
              <div class="text-primary text-bold text-subtitle1 q-mb-md" style="font-size:1.4em">¿ESTÁS SEGURO QUE DESEAS DEJAR TU TURNO?</div>
              <q-btn class="q-mb-md" color="secondary" label="Confirmar" rounded unelevated style="font-size:1.4em" @click="confirmLeave" />
              <div class="text-primary text-bold text-subtitle2 q-mb-md">Recuerda que tienes hasta 3 turnos por día y solo 1 simultáneo</div>
            </q-card-section>
          </q-card>
      </div>
    </q-dialog>
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
  name: 'Turn',
  data() {
    return {
      turnBusiness: 39,
      turnUser: 40,
      timer: 15,
      timer2: 15,
      showt1: true,
      showt2: false,
      onTurn: false,
      onRate: false,
      confirm: false
    }
  },
  methods: {
    ...mapActions('store', ['updateBusiness']),
    initLeave(){
      let tid = this.userDetails.turnID
      axios.get('/get-turn/'+tid)
        .then(res => {
            console.log(res.data)
            if(res.data.status == "ok"){
              this.$router.push("/Home")
            } else if(res.data.status == "espera"){
              this.confirm = true
            }
          })
        .catch(e => {
          console.log(e.response)
          Notify.create({
            message: 'Hubo un error. Favor de intentarlo de nuevo',
            color: 'negative'
          })
        })
    },
    confirmLeave(){
      let tid = this.userDetails.turnID
      axios.post('/drop-turn/'+tid, {})
        .then(res => {
            console.log(res.data)
            this.$router.push("/Home")
          })
        .catch(e => {
            console.log(e.response)
            Notify.create({
              message: 'Hubo un error. Favor de intentarlo de nuevo',
              color: 'negative'
            })
        })
    },
    toRate(){
      this.$router.push("/Rate")
    }
  },
  computed: {
    ...mapGetters('store', ['businessDetails', 'userDetails'])
  },
  created(){
    socket.on('update-turn', (data) => {
      console.log(data)
      if(data.businessID == this.businessDetails.businessID){
        console.log("LETS UPDATE")
        this.updateBusiness({
          turnoActual: data.turnoActual
        })
      }
    })
    socket.on('tu-turno', (data) => {
      console.log(data)
      if(data.userID == this.userDetails.userID && data.businessID == this.businessDetails.businessID){
        this.onTurn = true
        alert("Ya es tu turno. Puedes ingresar al establecimiento");
      }
    })
  }
  /*mounted() {
    var timeleft = 15;
    var downTimer = setInterval(() => {
      if(timeleft <= 0){
        clearInterval(downTimer);
        this.turnBusiness += 1;
        this.onTurn = true;
        this.showt1 = false;
        this.showt2 = true;
        alert("Ya es tu turno. Puedes ingresar al establecimiento");
        timeleft = 15;
        var downTimer2 = setInterval(() => {
          if(timeleft <= 0){
            clearInterval(downTimer2);
            this.turnBusiness +=1;
            this.onRate = true;
            this.showt2 = false;
            this.onTurn = false;
          }
          this.timer2 = timeleft;
          timeleft -=1;
        }, 1000);
      }
      this.timer = timeleft;
      timeleft -= 1;
    }, 1000);
  },*/
}
</script>

<style scoped>
.turnbg, .infobg{
  background: url(~assets/bg.png), rgb(145, 114, 184);
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-blend-mode:multiply;
} 
</style>