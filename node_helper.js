'use strict';

/* Magic Mirror
 * Module: MMM-PYPIR
 *
 * By Martin Müller (mav)
 */

const NodeHelper = require('node_helper');
const exec = require('child_process').exec;
const path = require("path");
const GPIOWatcher = require("./GPIOWatcher");

module.exports = NodeHelper.create({
  start: function () {
    this.started = false;
  },

  activateMonitor: function () {
    console.log("Turning on monitor");
    // Easier and more reliable way found on
    // https://pi-buch.info/hdmi-ausgang-unkompliziert-ein-und-ausschalten/
    exec("vcgencmd display_power 1", null);
  },

  deactivateMonitor: function () {
    console.log("Turning off monitor");
    exec("vcgencmd display_power 0", null);
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    const self = this;
    if (notification === 'CONFIG' && self.started == false) {
		self.config = payload;

		GPIOWatcher.watch(self.config.sensorPin, self.config.pullUpDown, (pin, value) => {
			console.log(new Date() + " PIR signal received: "+value);
				if (value == 1) {
					self.sendSocketNotification("USER_PRESENCE", true);
					GPIOWatcher.output(self.config.LEDPin, 1);
					if (self.config.powerSaving) {
						self.activateMonitor();
						clearTimeout(self.deactivateMonitorTimeout);
					}
				 }
				 else if (value == 0) {
					GPIOWatcher.output(self.config.LEDPin, 0);
					if (!self.config.powerSaving){
						self.sendSocketNotification("USER_PRESENCE", false);
							return;
					}

					self.deactivateMonitorTimeout = setTimeout(function() {
						self.deactivateMonitor();
						self.sendSocketNotification("USER_PRESENCE", false);
					}, self.config.powerSavingDelay * 1000);
				}
		});

		// signal startup by blinking the LED for 2 seconds
		GPIOWatcher.blink(self.config.LEDPin, 10, 200);

		self.started = true;
    }
  }

});
