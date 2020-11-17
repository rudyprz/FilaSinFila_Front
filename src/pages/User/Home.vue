<template>
  <q-page class="flex flex-center bg-primary">
    <div class="text-center text-h4 text-white text-bold" style="max-width: 300px">ESCANEA EL CÓDIGO QR DEL NEGOCIO</div>
    <div style="border: 4px dashed #6ee0ff; border-radius: 5%; width:330px; height:250px">
        <vue-qr-reader :stop-on-scanned="false" v-on:code-scanned="codeArrived" />
    </div> 
  </q-page>
</template>

<script>
import VueQrReader from 'vue-qr-reader/dist/lib/vue-qr-reader.umd.js';
import axios from 'axios'
import VueAxios from 'vue-axios'
import { mapGetters, mapActions } from 'vuex'
import { Notify } from 'quasar'

export default {
  name: 'Home',
  components: {
    VueQrReader
  },
  data() {
    return {
      
    }
  },
  methods: {
    ...mapActions('store', ['setBusiness']),
    readQR(){
      let idCode = "5f0f752e3caf9c78056d658d"
      axios.get('/detect-qr/' + idCode)
          .then(res => {
            console.log(res.data)
            this.setBusiness(res.data)
            this.$router.push("/Welcome/"+idCode)
          })
          .catch(e => {
            console.log(e.response)
            Notify.create({
              message: 'Lo sentimos. No se encontró ningun negocio registrado con el QR proporcionado.',
              color: 'negative'
            })
          })
    },
    codeArrived (code) {
      //console.log(event.detail[0]);
      //let detCode = event.detail[0]
      let resCode = code.split("https://filasinfila.com/Welcome/");
      let idCode = resCode[1]
      if(idCode == undefined || idCode == null){
        Notify.create({
            message: 'Este QR no corresponde con ningun registro relacionado con FilaSinFila',
            color: 'negative'
        })
      } else {
        axios.get('/detect-qr/' + idCode)
          .then(res => {
            console.log(res.data)
            this.setBusiness(res.data)
            this.$router.push("/Welcome/"+idCode)
          })
          .catch(e => {
            console.log(e.response)
            Notify.create({
              message: 'Lo sentimos. No se encontró ningun negocio registrado con el QR proporcionado.',
              color: 'negative'
            })
          })
      }
    }
  },
}
</script>
