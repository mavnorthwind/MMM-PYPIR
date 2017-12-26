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
    // Check if hdmi output is already on
    exec("/opt/vc/bin/tvservice -s").stdout.on('data', function(data) {
      if (data.indexOf("0x120002") !== -1)
        exec("/opt/vc/bin/tvservice --preferred && chvt 6 && chvt 7", null);
    });
  },

  deactivateMonitor: function () {
    console.log("Turning off monitor");
    exec("/opt/vc/bin/tvservice -o", null);
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'CONFIG' && this.started == false) {
		const self = this;
		this.config = payload;

		GPIOWatcher.watch(this.config.sensorPIN, this.config.pullUpDown, (pin, value) => {
			console.log(new Date() + " PIR signal received: "+value);
				if (value == 1) {
					self.sendSocketNotification("USER_PRESENCE", true);
					if (self.config.powerSaving) {
						self.activateMonitor();
						clearTimeout(self.deactivateMonitorTimeout);
					}
				 }
				 else if (value == 0) {
					self.sendSocketNotification("USER_PRESENCE", false);
					if (!self.config.powerSaving){
							return;
					}

					self.deactivateMonitorTimeout = setTimeout(function() {
						self.deactivateMonitor();
					}, self.config.powerSavingDelay * 1000);
				}
		});

		this.started = true;
    }
  }

});
