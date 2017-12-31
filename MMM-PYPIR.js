/* global Module */

/* Magic Mirror
 * Module: MMM-PYPIR
 *
 * By Martin Müller (mav)
 */

Module.register('MMM-PYPIR',{

	requiresVersion: "2.1.0",

	defaults: {
		sensorPin: 4,		// PIR pin in BCM notation
		pullUpDown: 'down', 	// configure the pin for pulldown ('down') or pullup ('up')
		powerSaving: true,	// turn monitor on/off when the PIR registers movement
		powerSavingDelay: 10,	// delay (in seconds) after the PIR has stopped registering movement to turn off the monitor
		LEDPin: 21		// LED pin in BCM notation to display the PIR state
	},

	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'USER_PRESENCE')
		{
			Log.info('USER_PRESENCE ' + payload + ' received');
			this.sendNotification(notification, payload); // send notification to other modules
		}
	},
	
	start: function() {
		this.sendSocketNotification('CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
	}
});
