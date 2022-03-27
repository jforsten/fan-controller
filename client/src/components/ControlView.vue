<template>
  <v-container>
    <v-card class="pa-5 ma-5 elevation-5">
      <v-card-text class="text-h5 mb-n5"> Fan </v-card-text>

      <v-card-text class="text-h5 mb-n5 ms-5">
        <v-icon>mdi-fan</v-icon> <strong>Speed:</strong> {{ stat.rpm }} rpm
      </v-card-text>

      <v-card-text class="text-h5 ms-5">
        <v-row>
          <v-col cols="auto">
            <v-icon>mdi-speedometer</v-icon> <strong>PWM:</strong>
            {{ stat.pwm }}%
          </v-col>
          <v-col cols="3">
            <v-slider
              v-model="pwm"
              max="100"
              min="0"
              thumb-label
              :disabled="pwmNotReady"
            />
          </v-col>
          <v-col>
             <v-expand-transition>
            <v-chip v-if="pwmPendingInProgress" class="mt-0" color="pink" text-color="white">
              {{ pendingPwm }}
            </v-chip>
             </v-expand-transition>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text class="text-h5 mb-n5"> Inside condition </v-card-text>

      <v-card-text class="text-h5 mb-n5 ms-5">
        <v-icon>mdi-thermometer</v-icon> <strong>Temperature:</strong>
        {{ stat.temperature }}°C
      </v-card-text>

      <v-card-text class="text-h5 mb-5 ms-5">
        <v-icon>mdi-water</v-icon> <strong>Humidity:</strong>
        {{ stat.humidity }}%
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ControlView',

  data: () => ({
    stat: 'none',
    pwmInternal: -1,
    pwmTimeoutId: null,
    pendingPwm: '',
  }),

  computed: {
    pwmNotReady: {
      get: function () {
        return this.pwm == -1
      },
    },

    pwmPendingInProgress: {
      get: function () {
        return this.pendingPwm != ''
      },
    },

    pwm: {
      get: function () {
        return this.pwmInternal
      },
      set: function (newValue) {
        if (this.pwmNotReady) return

        this.pwmInternal = newValue

        clearTimeout(this.pwmTimeoutId)
        this.pwmTimeoutId = setTimeout(() => {
          axios.get('http://' + location.hostname + ':3000/control?pwm=' + this.pwmInternal)
        }, 500)
      },
    },
  },
  methods: {
    getData() {
      if (!this.pwmNotReady && this.pwm != this.stat.pwm) {
        this.pendingPwm = 'In progress...'
      } else {
        this.pendingPwm = ''
      }

      axios
        .get('http://' + location.hostname + ':3000/control')
        .then((response) => {
          this.stat = response.data
          if (this.pwmNotReady && this.stat.pwm != undefined) {
            this.pwmInternal = this.stat.pwm
          }
        })
        .catch((error) => {
          alert(error)
        })
    },
  },
  mounted() {
    console.log(location.host)
    setInterval(this.getData, 1000)
  },
}
</script>
