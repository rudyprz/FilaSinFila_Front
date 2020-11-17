<template>
  <q-page class="mainbg q-pa-md">
    <div align="center">
      <img
        class="q-mt-xl q-mb-xl"
        alt="FilaSinFila"
        src="~assets/logob.png"
      />
      <div class="text-h6 text-white">Reestablece tu contraseña</div>
      <div class="q-gutter-y-lg" style="max-width:250px">
        <q-input dark placeholder="Nueva Contraseña" type="password" v-model="pass" rounded outlined color="white" style="font-size:1.3em;" :rules="[val => val.length >= 6 || 'Contraseña mínimo seis caracteres']" />
        <q-input dark placeholder="Confirma Contraseña" type="password" v-model="passC" rounded outlined color="white" style="font-size:1.3em;" />
        <q-btn label="Cambiar Contraseña" unelevated rounded class="q-pt-xs q-pb-xs" color="white" style="color: #8767D3!important; font-size:1.3em; width:250px" @click="resetPass" />
      </div>
    </div>

  </q-page>
</template>

<script>
import axios from 'axios'
import VueAxios from 'vue-axios'
import { Notify } from 'quasar'
import { mapActions } from "vuex";

export default {
  name: 'ResetPass',
  data() {
    return {
      pass: null,
      passC: null
    }
  },
  methods: {
    ...mapActions('store', ['setUser', 'setOwner', 'setBusiness', 'guardarUsuario']),
    resetPass(){
      if(this.pass !== this.passC){
        Notify.create({
          message: 'Confirma tu contraseña, debe de coincidir.',
          color: 'negative'
        })
      }else{
        axios.post('/reset-pass', {
          resetLink: this.$route.params.id,
          newPass: this.pass
        })
        .then(res => {
          console.log(res.data)
          Notify.create({
            message: res.data.mensaje,
            color: 'positive'
          })
          this.$router.push("/Login")
        })
        .catch(e => {
          console.log(e.response)
          Notify.create({
            message: e.response.data,
            color: 'negative'
          })
        })
      }
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