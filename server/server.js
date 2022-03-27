// Config /////////////////////////////////////////////////////////////////////////////////////////

const config = require('config');
const serverPortNumber = config.get('server.port');
const serialPortName = config.get('serial.port');


// Serial port access /////////////////////////////////////////////////////////////////////////////

const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const serial = new SerialPort({
  path: serialPortName,
  baudRate: 921600,
})

serial.on('close', function () {
  serialOpen()
})

var status = "-"

const parser = serial.pipe(new ReadlineParser({ delimiter: '\r\n' }))

parser.on('data', data => {
  status = data
})

function serialOpen() {
  serial.open(function (err) {
      if (!err) {
        console.log(`Serial port ${serialPortName} is now again ready!`)
        return 
      }

      console.log(`Serial port ${serialPortName} is not open: ` + err.message);
      setTimeout(serialOpen, 10000) // next attempt to open after 10s
  })
}

function serialWrite(data) {
  serial.write(data, function(err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
  })
}

// Server /////////////////////////////////////////////////////////////////////////////////////////

const express = require('express')
const app = express()
const port = serverPortNumber

// Allow access from script in client side when developing web app 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept")
  next()
})


// Use /control path for fan status / pwm control access
app.get('/control', (req, res) => {
  res.send(status)
 
  // Set PWM if received as a query parameter
  var pwm = req.query.pwm 
  if (pwm != undefined) {
    serialWrite(pwm)
  }

})

// Use root path to serve the client app
app.use('/', express.static('../client/dist'))

app.listen(port, () => {
  console.log(`Fan control server is reading ${serialPortName} and listening on port ${port}!`)
})