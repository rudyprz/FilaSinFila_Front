<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-secondary">
      <q-toolbar>
        <q-btn
          flat
          round
          icon="menu"
          style="font-size: 2em"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-img src="~assets/logob.png" style="max-width:200px" />

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      content-class="bg-secondary"
    >
      <q-btn
          flat
          round
          icon="arrow_back_ios"
          color="white"
          style="font-size: 2em"
          aria-label="Back"
          @click="leftDrawerOpen = !leftDrawerOpen"
      />
      <div v-if="loading" class="flex flex-center">
        <q-spinner-ball
          color="primary"
          size="10em"
        />
      </div>
      <div v-else>
        <div class="row items-center justify-around">
          <div class="text-white text-center text-bold text-h5">Hola {{name}}</div>
          <q-btn 
            flat
            round
            icon="save"
            style="font-size: 1.5em"
            color="white"
            @click="saveUser" 
          />
        </div>
        <div class="bg-white q-mt-md q-pt-xs q-pb-md" align="center">
          <div class="q-mt-md text-primary text-bold text-subtitle1 text-center">NÚMERO REGISTRADO</div>
          <q-input bg-color="primary" dark rounded outlined v-model="tel" style="max-width: 250px; font-size:1.5em" />
          <div class="q-mt-md text-primary text-bold text-subtitle1 text-center">NOMBRE COMPLETO</div>
          <q-input bg-color="primary" dark rounded outlined v-model="name" style="max-width: 250px; font-size:1.5em" />
          <div class="q-mt-md text-primary text-bold text-subtitle1 text-center">CORREO</div>
          <q-input bg-color="primary" dark rounded outlined v-model="email" style="max-width: 250px; font-size:1.5em" />
        </div>
        <div class="bg-white q-pt-md q-pb-md" align="center">
          <div class="text-primary text-bold text-h6">INFO DEL NEGOCIO PRINCIPAL</div>
          <div class="q-mt-md text-primary text-bold text-subtitle1 text-center">NOMBRE SUCURSAL</div>
          <q-input bg-color="primary" dark rounded outlined v-model="nameC" style="max-width: 250px; font-size:1.5em" />
          <div class="q-mt-md text-primary text-bold text-subtitle1 text-center">DIRECCIÓN</div>
          <q-input bg-color="primary" dark rounded outlined v-model="addressC" style="max-width: 250px; font-size:1.5em" />
          <div class="q-mt-md text-primary text-bold text-subtitle1 text-center">RAZÓN SOCIAL</div>
          <q-input bg-color="primary" dark rounded outlined v-model="nameF" style="max-width: 250px; font-size:1.5em" />
          <div class="q-mt-md text-primary text-bold text-subtitle1 text-center">DIRECCIÓN FISCAL</div>
          <q-input bg-color="primary" dark rounded outlined v-model="addressF" style="max-width: 250px; font-size:1.5em" />
          <div class="q-ma-md text-primary text-bold text-subtitle1 text-center">TU CÓDIGO QR</div>
          <!--<VueQRCodeComponent 
              id="qrcomponent"
              ref="qrcomponent"
              :text="'https://filasinfila.com/Welcome/'+selectedBusiness.businessID"
              :size="200"
              color="#000000"
              bg-color="#ffffff" 
              error-level="L"
          >
          </VueQRCodeComponent>-->
          <qrcode-vue id="qrcomp" :value="'https://filasinfila.com/Welcome/'+selectedBusiness.businessID" :size="200" level="L"></qrcode-vue>
          <img
            id="template"
            style="display:none"
            src="~assets/FSFTemplate.jpg"
          />
          <q-btn :loading="loadingDownload" label="descargar" outline rounded color="primary" class="q-mt-md" @click="downloadQR"/>
        </div>
          <div class="q-mt-sm text-primary text-h6 text-bold text-center">ASOCIADOS</div>
            <div align="center">
              <q-card v-for="(item, index) in listAssociates" :key="index" class="q-mb-sm" style="max-width:95%">
                <q-card-section horizontal class="justify-between items-center">
                  <div class="q-ml-md text-body1 text-primary text-bold">{{item.nombre}}</div>
                  <q-card-actions class="justify-around q-px-md">
                    <q-btn color="info" icon="edit" round style="font-size: 1em;" @click="editarAsociado(index)"/>
                    <q-btn color="negative" icon="remove" round style="font-size: 1em;" @click="eliminarAsociado(index)"/>
                  </q-card-actions>
                </q-card-section>
              </q-card>
            </div>
            <div class="row items-center justify-center q-mb-md">
              <q-btn color="primary" icon="add" round style="font-size: 1em;" @click="addA = true"/>
              <div class="q-ml-md text-body1 text-white text-bold">Agregar Asociado</div>
            </div>
            <q-separator color="white" />
            <div class="q-mt-sm text-primary text-h6 text-bold text-center">SUCURSALES ADICIONALES</div>
            <div align="center">
              <q-card v-for="(item, index) in listBusiness" :key="index" class="q-mb-sm" style="max-width:95%">
                <q-card-section horizontal class="justify-between items-center">
                  <div class="q-ml-md text-body1 text-primary text-bold">{{item.nombreC}}</div>
                  <q-card-actions class="justify-around q-px-md">
                    <q-btn color="info" icon="edit" round style="font-size: 1em;" @click="editarSucursal(index)"/>
                    <q-btn v-if="item._id === selectedBusiness._id" disable color="negative" icon="remove" round style="font-size: 1em;" @click="eliminarSucursal(index)"/>
                    <q-btn v-else color="negative" icon="remove" round style="font-size: 1em;" @click="eliminarSucursal(index)"/>
                  </q-card-actions>
                </q-card-section>
              </q-card>
            </div>
            <div class="row items-center justify-center q-mb-md">
              <q-btn color="primary" icon="add" round style="font-size: 1em;" @click="addS = true"/>
              <div class="q-ml-md text-body1 text-white text-bold">Agregar Sucursal</div>
            </div>
            <q-separator color="white" />
        <div class="bg-white" >
          <div class="bg-white text-center text-primary text-subtitle1 q-pa-sm" style="font-size:1.4em;" >Máximo de personas:</div>
          <div class="bg-white text-center text-primary text-bold" style="font-size:2em;">{{selectedBusiness.maxPersonas}}</div>
          <div class="bg-white text-center" >
            <q-btn class="q-mb-md" label="Modificar" color="primary" outline @click="modalMax = true" />
          </div>
          <div class="bg-white q-pt-md text-primary text-body1 text-center" style="font-size:1.4em;">Saldo de Mensajes:</div>
          <div class="bg-white q-pt-md text-primary text-center text-bold" style="font-size:2em;">{{selectedBusiness.tokens}}</div>
          <div class="bg-white q-pt-md text-primary text-h6 text-center text-bold">RECARGA TU SALDO DE MENSAJES:</div>
        </div>
        <div class="bg-white" align="left">
          <div class="row bg-primary items-center q-pa-md">
            <div class="col-10">
              <div class="text-white text-subtitle1 text-bold">PAQUETE 1</div>
              <div class="text-white text-subtitle2">50 mensajes SMS</div>
              <div class="text-white text-subtitle2">$85 pesos</div>
            </div>
            <div class="col-2" align="center">
              <q-btn flat round icon="add_circle" color="white" style="font-size: 1.5em" @click="order1" />
            </div>
          </div>
          <div class="row bg-primary items-center q-pa-md">
            <div class="col-10">
              <div class="text-white text-subtitle1 text-bold">PAQUETE 2</div>
              <div class="text-white text-subtitle2">100 mensajes SMS</div>
              <div class="text-white text-subtitle2">$165 pesos</div>
            </div>
            <div class="col-2" align="center">
              <q-btn flat round icon="add_circle" color="white" style="font-size: 1.5em" @click="order2" />
            </div>
          </div>
          <div class="row bg-primary items-center q-pa-md">
            <div class="col-10">
              <div class="text-white text-subtitle1 text-bold">PAQUETE 3</div>
              <div class="text-white text-subtitle2">200 mensajes SMS</div>
              <div class="text-white text-subtitle2">$320 pesos</div>
            </div>
            <div class="col-2" align="center">
              <q-btn flat round icon="add_circle" color="white" style="font-size: 1.5em" @click="order3" />
            </div>
          </div>
        </div>
        <q-dialog v-model="modalMax">
          <q-card>
            <q-card-section>
              <div align="center" class="q-gutter-y-md">
                <div class="text-body1 text-bold text-primary">Modifica el máximo de personas permitidas en el establecimiento</div>
                <q-input rounded outlined v-model.number="maxPeople" style="max-width: 100px; font-size:1.5em" :rules="[val => val > 0 || 'Mínimo 1 persona']"/>
                <q-btn color="primary" label="Modificar" style="font-size: 1em;" @click="maxChange"/>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
        <q-dialog v-model="modalOrder">
          <q-card style="min-width: 320px">
            <q-card-section>
              <div align="center" class="q-gutter-y-md">
                <img
                  style="max-width:200px"
                  alt="FilaSinFila"
                  src="~assets/infoFila.png"
                />
                <div class="text-h6 text-bold text-primary">Confirma tu pedido</div>
                <div class="text-body1 text-grey-8">Mensajes: <span class="text-primary">{{this.orderTokens}}</span></div>
                <div class="text-body1 text-grey-8">Precio: <span class="text-primary">${{this.orderPrice}} MXN</span></div>
                <div>
                  <stripe-elements
                    ref="elementsRef"
                    :pk="publishableKey"
                    :amount="orderPrice*100"
                    locale="es"
                    @token="tokenCreated"
                    @loading="loading2 = $event"
                    :styleObject="styleS"
                  >
                  </stripe-elements>
                  <q-btn v-if="!loading2" color ="primary" label="Confirmar" style="font-size: 1em;" @click="submit" />
                  <div v-else>
                    <q-spinner-dots
                      color="primary"
                      size="3em"
                    />
                    <div class="text-primary text-body1" style="font-size: 1.4em">Procesando tu pago</div>
                  </div>
                </div>
                <!--<q-btn color="primary" label="Confirmar" style="font-size: 1em;" @click="confirmOrder"/>-->
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
        <div align="center" class="q-pa-md">
          <q-btn label="Cerrar Sesión" unelevated outlined rounded color="white" style="color: #8767D3!important; font-size:1.3em; width:250px" @click="logout" />
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
            </q-card-section>
            <q-card-actions>
              <q-btn label="Modificar" unelevated rounded color="primary" style="font-size:1.3em; width:250px" @click="modificarAsociado" />
            </q-card-actions>
            <q-card-section>
              <div class="text-primary text-body1 text-cente" >Modificar la contraseña</div>
              <q-input placeholder="Nueva Contraseña" type="password" v-model="newPassA" rounded outlined color="primary" style="font-size:1.3em;" />
            </q-card-section>
            <q-card-actions>
              <q-btn label="Cambiar Contraseña" unelevated rounded color="primary" style="font-size:1.3em; width:250px" @click="modificarPassword" />
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
              <q-btn label="Modificar" unelevated rounded color="primary" style="font-size:1.3em; width:250px" @click="modificarSucursal" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { Notify } from 'quasar'
import VueQRCodeComponent from 'vue-qr-generator'
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { StripeElements } from 'vue-stripe-checkout';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';
import QrcodeVue from 'qrcode.vue'
import io from 'socket.io-client';

var socket = io();

export default {
  name: 'LayoutU',
  components: {
    VueQRCodeComponent,
    StripeElements,
    QrcodeVue
  },
  data () {
    return {
      styleS:{
        base: {
          iconColor: '#6ee0ff',
          color: '#8763d7',
          fontWeight: 500,
          fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          '::placeholder': {
            color: '#bcbcbd',
          },
        },
        invalid: {
          iconColor: '#C10015',
          color: '#C10015',
        },
      },
      loading: false,
      loading2: false,
      loadingDownload: false,
      leftDrawerOpen: false,
      user: "",
      tel: "",
      name: "",
      email: "",
      nameC: "",
      addressC: "",
      nameF: "",
      addressF: "",
      modalMax: false,
      modalOrder: false,
      publishableKey: process.env.STRIPE_PUBLISH_KEY, 
      token: null,
      charge: null,
      orderTokens: null,
      orderPrice: null,
      maxPeople: 1,
      addA: false,
      editA: false,
      addS: false,
      editS: false,
      nameA: "",
      emailA: "",
      telA: "",
      passA: "",
      newPassA: "",
      nameC_A: "",
      addressC_A: "",
      editNameA: "",
      editEmailA: "",
      editTelA: "",
      editPassA: "",
      editnameC_A: "",
      editaddressC_A: "",
      tokens: 0,
      currentIndex: null,
      asociados: [],
      sucursales: []
    }
  },
  computed: {
    ...mapGetters('store', ['maxPersonas', 'ownerDetails', 'businessDetails', 'listBusiness', 'listAssociates', 'selectedBusiness'])
  },
  methods: {
    ...mapActions('store', ['cambiarMaxPersonas', 'cerrarSesion', 'updateOwner', 'updateBusiness', 'updateSelectedBusiness', 'setListBusinessDetails', 'addListBusinessDetails', 'updateListBusinessDetails', 'deleteListBusinessDetails', 'setListAssociatesDetails', 'addListAssociatesDetails', 'updateListAssociatesDetails', 'deleteListAssociatesDetails']),
    downloadQR(){
      this.loadingDownload = true
      var qrc = document.querySelector('#qrcomp')
      var qrsrc = qrc.getElementsByTagName('canvas')[0]
      console.log(qrsrc)
      domtoimage.toJpeg(qrsrc)
        .then((dataUrl) => {
          console.log(dataUrl)
          var t = document.getElementById('template').src
          const img = new Image()
          img.src = t
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
          const iURL = canvas.toDataURL('image/jpeg')
          console.log(iURL)
          console.log(img.width)
          console.log(img.height)

          const doc = new jsPDF({unit: 'px', format: [img.width, img.height]})
          doc.addImage(iURL, 'JPEG', 0, 0, img.width, img.height)
          doc.addImage(dataUrl, 'JPEG', 600, 1500, 500, 500)
          doc.save("QR.pdf")
          this.loadingDownload = false
        })
      /*html2canvas(qrsrc) // Llamar a html2canvas y pasarle el elemento
      .then(canv => {
        var qrCanv = canv.toDataURL();
        console.log(qrCanv)

        var t = document.getElementById('template').src
        const img = new Image()
        img.src = t
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        const iURL = canvas.toDataURL('image/jpeg')
        console.log(iURL)
        console.log(img.width)
        console.log(img.height)

        const doc = new jsPDF({unit: 'px', format: [img.width, img.height]})
        doc.addImage(iURL, 'JPEG', 0, 0, img.width, img.height)
        doc.addImage(qrCanv, 'JPEG', 600, 1500, 500, 500)
        doc.save("QR.pdf")
        this.loadingDownload = false
      });*/
    },
    maxChange(){
      axios.post('/change-max/' + this.selectedBusiness._id, {
        maxPersonas: this.maxPeople
      })
        .then(res => {
          console.log(res.data)
          this.updateSelectedBusiness({
            maxPersonas: this.maxPeople,
          })
          Notify.create({
            message: 'Se ha modificado el máximo de personas',
            color: 'positive'
          })
          this.modalMax = false
        })
        .catch(e => {
          console.log(e.response)
          Notify.create({
            message: 'Hubo un error. Favor de intentarlo de nuevo más tarde',
            color: 'negative'
          })
        })
    },
    order1(){
      this.orderTokens = 50
      this.orderPrice = 85
      this.modalOrder = true
    },
    order2(){
      this.orderTokens = 100
      this.orderPrice = 165
      this.modalOrder = true
    },
    order3(){
      this.orderTokens = 200
      this.orderPrice = 320
      this.modalOrder = true
    },
    tokenCreated(token){
      console.log("TOKEN CREATED!")
      this.token = token;
      // for additional charge objects go to https://stripe.com/docs/api/charges/object
      this.charge = {
        source: token.id,
        amount: this.orderPrice*100, // the amount you want to charge the customer in cents. $100 is 1000 (it is strongly recommended you use a product id and quantity and get calculate this on the backend to avoid people manipulating the cost)
        description: "Cargo por paquete SMS de " + this.orderTokens + ". Sucursal: " + this.selectedBusiness.nombreC // optional description that will show up on stripe when looking at payments
      }
      console.log(this.charge)
      axios.post('/payment-intent', this.charge)
      .then(res =>{
        console.log(res.data)
        let tokensAdded = this.selectedBusiness.tokens + this.orderTokens
        axios.post('/add-tokens/' + this.selectedBusiness._id, {
          tokens: tokensAdded
        })
          .then(res => {
            console.log(res.data)
            this.updateSelectedBusiness({
              tokens: tokensAdded,
            })
            socket.emit('add-token', {
              businessID: this.selectedBusiness._id,
              tokens: tokensAdded
            });
            Notify.create({
              message: 'Pago realizado y saldo actualizado con éxito',
              color: 'primary'
            })
            this.modalOrder = false
            this.loading2 = false
          })
          .catch(e => {
            console.log(e.response)
            this.loading2 = false
            Notify.create({
              message: 'Hubo un error al agregar mensajes a tu saldo. Favor de contactarte con nosotros!',
              color: 'negative'
            })
          })
      })
      .catch(e => {
        console.log(e.response)
        this.loading2 = false
        Notify.create({
          message: 'Hubo un error al procesar su pago. Intente de nuevo',
          color: 'negative'
        })
      })
    },
    submit(){
      console.log("TO SUBMIT")
      this.loading2 = true
      this.$refs.elementsRef.submit();
      console.log("SUBMITTED")
    },
    /*confirmOrder(){
      let tokensAdded = this.selectedBusiness.tokens + this.orderTokens
      axios.post('/add-tokens/' + this.selectedBusiness._id, {
        tokens: tokensAdded
      })
        .then(res => {
          console.log(res.data)
          this.updateBusiness({
            tokens: this.tokensAdded,
          })
          Notify.create({
            message: 'Tokens Agregados',
            color: 'positive'
          })
          this.modalOrder = false
        })
        .catch(e => {
          console.log(e.response)
          Notify.create({
            message: 'Hubo un error. Favor de intentarlo de nuevo más tarde',
            color: 'negative'
          })
        })
    },*/
    saveUser(){
      axios.post('/update-owner/' + this.ownerDetails.ownerID, {
        nombre: this.name,
        email: this.email,
        telefono: this.tel,
        nombreF: this.nameF,
        direccionF: this.addressF
      })
        .then(res => {
          console.log(res.data)
          this.updateOwner({
            nombre: this.name,
            email: this.email,
            telefono: this.tel,
            nombreF: this.nameF,
            direccionF: this.addressF
          })
          if(this.businessDetails.nombreC !== this.nameC || this.businessDetails.direccionC !== this.addressC) {
            axios.post('/update-business/' + this.businessDetails.businessID, {
              nombreC: this.nameC,
              direccionC: this.addressC
            })
              .then(res => {
                console.log(res.data)
                this.updateBusiness({
                  nombreC: this.nameC,
                  direccionC: this.addressC
                })
                Notify.create({
                  message: 'Se ha modificado tu perfil',
                  color: 'positive'
                })
              })
              .catch(e => {
                console.log(e.response)
                Notify.create({
                  message: 'Hubo un error. Favor de intentarlo de nuevo más tarde',
                  color: 'negative'
                })
              })
          } else {
            Notify.create({
              message: 'Se ha modificado tu perfil',
              color: 'positive'
            })
          }
        })
        .catch(e => {
          console.log(e.response)
          Notify.create({
            message: 'Hubo un error. Favor de intentarlo de nuevo más tarde',
            color: 'negative'
          })
        })
    },
    agregarAsociado(){
      axios.post('/new-associate', {
        nombre: this.nameA,
        email: this.emailA,
        tel: this.telA,
        pass: this.passA,
        businessID: this.businessDetails.businessID,
        ownerID: this.ownerDetails.ownerID,
        role: "ASSOCIATE"
      })
      .then(res => {
        this.addListAssociatesDetails(res.data)
        Notify.create({
          message: 'Se creo un nuevo asociado',
          color: 'positive'
        })
        this.nameA = "",
        this.emailA = "",
        this.telA = "",
        this.passA = ""
        this.addA = false
      })
      .catch(e => {
        console.log(e.response)
        Notify.create({
          message: e.response.data,
          color: 'negative'
        })
      })
    },
    agregarSucursal(){
      axios.post('/new-business', {
        nombreC: this.nameC_A,
        direccionC: this.addressC_A,
        tokens: 0,
        turnoActual: 0,
        turnosAcumulado: 0,
        personasActual: 0,
        maxPersonas: 5,
        ownerID: this.ownerDetails.ownerID,
        principal: false
      })
      .then(res => {
        console.log(res.data)
        this.addListBusinessDetails(res.data)
        Notify.create({
          message: "Tu nueva sucursal ha sido creada",
          color: 'positive'
        })
        this.addS = false
        this.nameC_A = "",
        this.addressC_A = ""
      })
      .catch(e => {
        console.log(e.response)
        Notify.create({
          message: e.response.data,
          color: 'negative'
        })
      })
    },
    editarAsociado(index){
      this.editNameA = this.listAssociates[index].nombre
      this.editEmailA = this.listAssociates[index].email
      this.editTelA = this.listAssociates[index].telefono
      this.currentIndex = index
      this.editA = true
    },
    editarSucursal(index){
      this.editnameC_A = this.listBusiness[index].nombreC
      this.editaddressC_A = this.listBusiness[index].direccionC
      this.currentIndex = index
      this.editS = true
    },
    modificarAsociado(){
      axios.post('/update-associate/'+ this.listAssociates[this.currentIndex]._id, {
        nombre: this.editNameA,
        email: this.editEmailA,
        telefono: this.editTelA
      })
      .then(res => {
        this.updateListAssociatesDetails({
          nombre: this.editNameA,
          email: this.editEmailA,
          telefono: this.editTelA,
          index: this.currentIndex
        })
        Notify.create({
          message: "Contraseña del asociado modificada",
          color: 'positive'
        })
        this.editA = false
      })
      .catch(e => {
        console.log(e.response)
        Notify.create({
          message: "Hubo un error. Intenta de nuevo más tarde",
          color: 'positive'
        })
      })
    },
    modificarPassword(){
      axios.post('/update-associate-pass/'+ this.listAssociates[this.currentIndex]._id, {
        pass: this.newPassA
      })
      .then(res => {
        Notify.create({
          message: "Contraseña del asociado modificada",
          color: 'positive'
        })
      })
      .catch(e => {
        console.log(e.response)
        Notify.create({
          message: "Hubo un error. Intenta de nuevo más tarde",
          color: 'positive'
        })
      })
    },
    modificarSucursal(){
      axios.post('/update-business/' + this.listBusiness[this.currentIndex]._id, {
        nombreC: this.editnameC_A,
        direccionC: this.editaddressC_A
      })
      .then(res => {
        this.updateListBusinessDetails({
          nombreC: this.editnameC_A,
          direccionC: this.editaddressC_A,
          index: this.currentIndex
        })
        Notify.create({
          message: "Sucursal Modificada",
          color: 'positive'
        })
        this.editS = false
      })
      .catch(e => {
        console.log(e.response)
        Notify.create({
          message: "Hubo un error. Intenta de nuevo más tarde",
          color: 'positive'
        })
      })
    },
    eliminarAsociado(index){
      axios.post('/delete-associate/' + this.listAssociates[index]._id)
      .then(res => {
        this.deleteListAssociatesDetails(index)
        Notify.create({
          message: "Asociado Eliminado",
          color: 'positive'
        })
      })
      .catch(e => {
        console.log(e.response)
        Notify.create({
          message: "Hubo un error. Intenta de nuevo más tarde",
          color: 'negative'
        })
      })
    },
    eliminarSucursal(index){
      axios.post('/delete-business/' + this.listBusiness[index]._id)
      .then(res => {
        this.deleteListBusinessDetails(index)
        Notify.create({
          message: "Sucursal Eliminada",
          color: 'positive'
        })
      })
      .catch(e => {
        console.log(e.response)
        Notify.create({
          message: "Hubo un error. Intenta de nuevo más tarde",
          color: 'negative'
        })
      })
    },
    logout(){
      this.cerrarSesion()
    }
  },
  mounted() {
    this.loading = true
    setTimeout(() => {
      this.tel = this.ownerDetails.telefono,
      this.name = this.ownerDetails.nombre,
      this.email = this.ownerDetails.email,
      this.nameC = this.businessDetails.nombreC,
      this.addressC = this.businessDetails.direccionC,
      this.nameF = this.ownerDetails.nombreF,
      this.addressF = this.ownerDetails.direccionF,
      this.maxPeople = this.selectedBusiness.maxPersonas,
      this.tokens = this.selectedBusiness.tokens
      this.loading = false
    },1000)
  }
}
</script>