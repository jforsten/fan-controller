<template>
  <v-app>
    <v-app-bar
      app
      color="#444444"
      dark
    >
     <v-toolbar-title>
       <v-icon class="mt-n1">mdi-fan</v-icon>
         <font class="text-h5 ms-2">Fan controller</font>
         </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-icon class="ms-4 me-1">mdi-thermometer</v-icon>
         <div class="text-h6">{{ stat.temperature }}°C</div>
        <v-icon class=" ms-10 me-1">mdi-water</v-icon>
         <div class="text-h6">{{ stat.humidity }}%</div>

    </v-app-bar>

    <v-main>
      <ControlView @changeStatus="changeStatus($event)"/>
    </v-main>
    <div class="copyright pe-2"> ©Juha Forsten 2022 </div>
  </v-app>
</template>

<script>
import ControlView from './components/ControlView';

export default {
  name: 'App',

  components: {
    ControlView,
  },

  data: () => ({
    stat: {temperature: "--", humidity: "--"}
  }),
  methods:{
    changeStatus(stat)
    {
      this.stat=stat;
    },
}
};
</script>

<style>
html { overflow-y: auto }
.copyright {
    text-align: right;
    color: #fff; /* Fallback for older browsers */
    color: rgba(0, 0, 0, 0.3);
    background: #ffffff;
    font-size: 8pt;
    font-family: Arial, sans-serif;
}
</style>
