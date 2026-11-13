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
		LEDPin: 21,		// LED pin in BCM notation to display the PIR state
		monitorOutput: 'HDMI-A-1'	// output name used with wlr-randr to switch the monitor (see: wlr-randr)
	},

	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'USER_PRESENCE')
		{
			Log.info('USER_PRESENCE ' + payload + ' received');
			this.sendNotification(notification, payload); // send notification to other modules
		}
		
		if (notification === 'LIRC' &&
			payload.repeat < 1) // don't want repeats
		{
			Log.info('LIRC '+payload+' received');
		
			// interact with newsfeed module upon UP, DOWN, LEFT, RIGHT gesture
			var newsfeedModules = MM.getModules().withClass('newsfeed');

			if(newsfeedModules){

				var notification = "UNKNOWN";

				if(payload.key == 'KEY_RIGHT'){
					notification = "ARTICLE_NEXT";
				} else if(payload.key == 'KEY_LEFT'){
					notification = "ARTICLE_PREVIOUS";
				} else if(payload.key == 'KEY_UP'){
					notification = "ARTICLE_LESS_DETAILS";
				} else if(payload.key == 'KEY_DOWN'){
					notification = "ARTICLE_MORE_DETAILS";
				} else {
					Log.info('Not handling received gesture in this module directly:');
				}

				// forward gesture to other modules
				Log.info('Sending notification: ' + notification + '.');
				this.sendNotification(notification);

			}
		}
	},
	
	start: function() {
		this.sendSocketNotification('CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
	}
});
