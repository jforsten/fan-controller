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

FanController fan(SENSOR_PIN, SENSOR_THRESHOLD, PWM_PIN);

unsigned int rpms;

void setup()
{
  Serial.begin(921600);

  sht.begin();
  sht.read();  
  
  fan.begin();
  // Set fan duty cycle
  byte value = EEPROM.read(0);
  fan.setDutyCycle(value);  
}

void loop()
{
  sht.read();
  
  rpms = fan.getSpeed();
    
  // Update the PWM value from Serial input
  
  if (Serial.available() > 0) {
    byte peekValue = Serial.peek();
    if ( peekValue < 0x30 || peekValue > 0x39 ) {
      Serial.parseInt();
    } else {
      int input = Serial.parseInt();
      byte target = max(min(input, 100), 0);
      fan.setDutyCycle(target);
      EEPROM.put(0, target);
    }
  }
  delay(1000);
  getStatus();
}

void getStatus() {

  byte dutyCycle = fan.getDutyCycle();
   
  // Create JSON response
  Serial.print("{\"rpm\": ");
  Serial.print(rpms);
  Serial.print(", \"pwm\": ");
  Serial.print(dutyCycle);
  Serial.print(", \"temperature\": ");
  Serial.print(sht.getTemperature(), 1);
  Serial.print(",  \"humidity\": ");
  Serial.print(sht.getHumidity(), 1);
  Serial.println("}");
}
