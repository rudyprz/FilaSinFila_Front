<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import axios from 'axios'
import VueAxios from 'vue-axios'
import { mapActions } from "vuex";

export default {
  name: 'App',
  methods:{
    ...mapActions('store', ['leerToken'])
  },
  mounted() {
    //axios.defaults.baseURL = 'http://localhost:3000/api';
    axios.defaults.baseURL = 'https://filasinfila.com/api';
    this.leerToken();
  }
}
</script>
