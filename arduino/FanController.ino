//FanController
//
// Uses CJMCU Beetle board (Leonardo)

// For persisten data
#include <EEPROM.h>

// Temp & humidity
#include "Wire.h"
#include "SHT2x.h"

SHT2x sht;

// Fan
#include <FanController.h>

// Sensor wire is plugged into port 2 on the Arduino.
// For a list of available pins on your board,
// please refer to: https://www.arduino.cc/en/Reference/AttachInterrupt
#define SENSOR_PIN 1

// Choose a threshold in milliseconds between readings.
// A smaller value will give more updated results,
// while a higher value will give more accurate and smooth readings
#define SENSOR_THRESHOLD 1000

// PWM pin (4th on 4 pin fans)
#define PWM_PIN 9

// Initialize library
FanController fan(SENSOR_PIN, SENSOR_THRESHOLD, PWM_PIN);

/*
   The setup function. We only start the library here
*/
void setup()
{
  // start serial port
  Serial.begin(921600);

  sht.begin();  
  fan.begin();

  // Set fan duty cycle
  byte value = EEPROM.read(0);
  fan.setDutyCycle(value);  
}

/*
   Main function, get and show the temperature
*/
void loop()
{
  sht.read();
  
  // Get new speed from Serial (0-100%)
  if (Serial.available() > 0) {
    byte peekValue = Serial.peek();
    if ( peekValue < 0x30 || peekValue > 0x39 ) {
 
      Serial.parseInt();
      getStatus();
 
    } else {
       
      int input = Serial.parseInt();
      byte target = max(min(input, 100), 0);
      fan.setDutyCycle(target);
      EEPROM.put(0, target);
    
    }
  }
  delay(200);
}

void getStatus() {
  // Call fan.getSpeed() to get fan RPM.
  unsigned int rpms = fan.getSpeed(); // Send the command to get RPM
  byte dutyCycle = fan.getDutyCycle();
  Serial.print(rpms);
  Serial.print(",");
  Serial.print(dutyCycle);
  Serial.print(",");
  Serial.print(sht.getTemperature(), 1);
  Serial.print(",");
  Serial.println(sht.getHumidity(), 1);
}
