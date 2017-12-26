const PythonShell = require("python-shell");

// pin: number of pin to watch (in board numbering scheme)
// pull: "up"/"down"  resistor configuration
// callback: called whenever the PIN reports a change in level. Args: pin and 0/1
exports.watch = (pin, pull, callback) => {
	var options = {
		mode: 'text',
		pythonOptions: ['-u'], // important to activate unbuffered output
		scriptPath: __dirname,
		args: [ pin, pull ]
	};

	var pyshell = new PythonShell("GPIO_in.py", options);
	pyshell.on("message", (message) => {
		var match = message.toString().match(/([01])/);
		if (match != null) {
			callback(pin, match[1]);
		}
	});
};
