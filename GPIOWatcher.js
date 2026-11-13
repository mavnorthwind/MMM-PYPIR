const PythonShell = require("python-shell");

const PYTHON = "python3";

// pin: number of pin to watch (in board numbering scheme)
// pull: "up"/"down"  resistor configuration
// callback: called whenever the PIN reports a change in level. Args: pin and 0/1
exports.watch = (pin, pull, callback) => {
	var options = {
		mode: 'text',
		pythonPath: PYTHON,
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
	pyshell.on("error", (err) => {
		console.error("MMM-PYPIR: GPIO_in.py failed: " + err);
	});
};

// Output scripts run one after another so they never compete for a pin.
var queue = Promise.resolve();

function runOutput(args) {
	queue = queue.then(() => new Promise((resolve) => {
		var options = {
			mode: 'text',
			pythonPath: PYTHON,
			scriptPath: __dirname,
			args: args
		};
		var pyshell = new PythonShell("GPIO_out.py", options);
		pyshell.on("error", (err) => {
			console.error("MMM-PYPIR: GPIO_out.py failed: " + err);
		});
		pyshell.end(() => resolve());
	}));
}

exports.blink = (pin, blinkCount = 3, blinkDuration = 200) => {
	runOutput([ pin, blinkCount, blinkDuration ]);
};

exports.output = (pin, value) => {
	runOutput([ pin, value ]);
};
