// Serial port access //////////////////////////////////////////////////////////////////////////

const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const serial = new SerialPort({
  path: 'COM13',
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
      if (!err)
         return

      console.log('Port is not open: ' + err.message);
      setTimeout(serialOpen, 1000) // next attempt to open after 1s
  })
}

function serialWrite(data) {
  serial.write(data, function(err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
  })
}

// Server ////////////////////////////////////////////////////////////////////////////////////////////

const express = require('express')
const app = express()
const port = 3000

// Allow access from script in client side
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.get('/', (req, res) => {
  res.send(status)
 
  // Set PWM if received as a query parameter
  var pwm = req.query.pwm 
  if (pwm != undefined) {
    serialWrite(pwm)
  }

})

app.listen(port, () => {
  console.log(`Fan control server listening on port ${port}!`)
})