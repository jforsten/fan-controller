<template>
  <v-app>
    <v-app-bar
      app
      color="#444444"
      dark
    >
     <v-toolbar-title>
       <v-icon>mdi-fan</v-icon>
        Fan controller
     </v-toolbar-title>

      <v-spacer></v-spacer>


    </v-app-bar>

    <v-main>
      <ControlView/>
    </v-main>
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
    //
  })
};
</script>

<style>
html { overflow-y: auto }
</style>
