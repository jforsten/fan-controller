const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const serial = new SerialPort({
  path: 'COM13',
  baudRate: 921600,
})

var status = "none"

const parser = serial.pipe(new ReadlineParser({ delimiter: '\r\n' }))
parser.on('data', data => {
  console.log(data)
  status = data
})


const express = require('express')
const app = express();
const port = 3000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send(status)
  console.log("served")

  var pwm = req.query.pwm
  console.log("pwm:" + pwm)

  if (pwm != undefined) {
    serial.write(pwm, function(err) {
      if (err) {
        return console.log('Error on write: ', err.message)
      }
      console.log('pwm=' + pwm)
    })
  }

  serial.write('R', function(err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
    console.log('message written')
  })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});