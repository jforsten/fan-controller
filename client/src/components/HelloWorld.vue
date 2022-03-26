<template>
  <v-container>
    <v-row class="text-center">
      
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
         {{rpm}}
        </h1>
        <v-btn
        @click="getData">GET</v-btn>
      </v-col>


    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

  export default {
    name: 'HelloWorld',

    data: () => ({
     rpm: "none"
    }),
    methods: {
      getData() {
        axios.get("http://localhost:3000/")
      .then(response => {
        this.rpm = response.data;
        console.log(this.rpm)
      })
      .catch(error => {
        alert(error)
      })
      }
    }
  }
</script>
