<template>
  <q-page class="turnbg">
    <div align="center">
      <div class="bg-white q-pa-md" style="width: 80%; border-radius: 20px">
        <div class="q-ma-sm text-primary text-bold" style="font-size: 1.5em">¿Que tal lo hemos hecho?</div>
        <div class="q-ma-sm text-bold bg-primary q-pa-md" style="border-radius: 10px">
          <q-rating
            v-model="calificar1"
            size="2.5em"
            icon="thumb_up"
            color="secondary"
          />
        </div>
        <div class="q-ma-sm text-primary text-bold" style="font-size: 1.5em">Tiempo de espera</div>
        <div class="q-ma-sm text-bold bg-primary q-pa-md" style="border-radius: 10px">
          <q-rating
            v-model="calificar2"
            size="2.5em"
            icon="thumb_up"
            color="secondary"
          />
        </div>
      </div>
      <q-btn class="q-mt-xl" label="ENVIAR" unelevated outlined rounded color="white" style="color: #8767D3!important; font-size:1.3em; width:250px" @click="rate" />
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Notify } from 'quasar'
import axios from 'axios'
import VueAxios from 'vue-axios'

export default {
  name: 'Rate',
  data() {
    return {
      calificar1: 3,
      calificar2: 3
    }
  },
  methods: {
    rate(){
      axios.post('/rate-business', {
        userID: this.userDetails.userID,
        businessID: this.businessDetails.businessID,
        rateOverall: this.calificar1,
        rateTime: this.calificar2
      })
        .then(res => {
          console.log(res.data)
          this.$router.push("/Home")
        })
        .catch(e => {
          console.log(e.response)
          Notify.create({
            message: 'Hubo un error al calificar. Favor de intentarlo de nuevo',
            color: 'negative'
          })
        })
    }
  },
  computed: {
    ...mapGetters('store', ['businessDetails', 'userDetails'])
  }
}
</script>

<style scoped>
.turnbg{
  background: url(~assets/bg.png), rgb(145, 114, 184);
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-blend-mode:multiply;
} 
</style>