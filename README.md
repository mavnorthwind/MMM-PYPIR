# MMM-PYPIR
MagicMirror module for turning on or off the monitor in reaction to a PIR sensor

While building my second Magic Mirror, I once again stumbled over the intransparent and hard to fix version requirements electron sets on native node modules.
Using the [MMM-PIR-Sensor module](https://github.com/paviro/MMM-PIR-Sensor) as a starting point, I got rid of the onoff dependency which in turn requires a native module.
Electron uses its own node.js version, so even when I was able to use the module outside of my Magic Mirror for some standalone tests, I'd always get errors because of different tool versions.
So I decided to create an alternative for MMM-PIR-Sensor not relying on a native module.
Because Python on the Raspberry Pi includes modules for easy (and complete) access to the GPIO ports, the idea was to write small Python scripts and communicate with them using stdin/stdout (hence the name PYPIR).

# Configuration
```javascript
config: {
  sensorPIN: 22,       // in BCM notation
  pullUpDown: 'down',  // configure the pin for pulldown ('down') or pullup ('up')
  powerSaving: true,   // turn monitor on/off when the PIR registers movement
  powerSavingDelay: 10 // delay (in seconds) after the PIR has stopped registering movement to turn off the monitor
}
```
