# Fan Controller

This is full-stack PC fan controller with support to read temperature/humidity. It contains three components:

* **Arduino**: Use CJMCU Beetle for actual fan controller
* **Server**: Node.js (Express) server with ability to access serial port to control Adruino and server both control endpoint and the client app
* **Client**: Vue.js (Vuetify) app for control frontend


The intended use case is to connect Beetle to Raspberry Pi running RaSCSI which is then mounted inside sampler/syth module. Using web access it is possible the control both the SCSI emulation and fan speed. In this particular case Kurzweil K2500R is used as a target machine.


## Arduino

Used libraries:

* SHT2x
* FanController

Use standard Arduino workflow to compile and program.


## Server

To use **nodemon** to serve: `npm run start`

Check *config/default.json* for custom configuration like server port and serial port.


## Client

For development: `npm run serve`

To build production (for use for Server to serve the static client app): `npm run build`
