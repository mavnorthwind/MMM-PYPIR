#!/usr/bin/env python3
import sys
import time
import RPi.GPIO as GPIO

try:
	if len(sys.argv) == 3:
		[_, pin, data] = sys.argv
		pin = int(pin)
		data = int(data)
		
	elif len(sys.argv) == 4:
		[_, pin, count, duration] = sys.argv
		pin = int(pin)
		count = int(count)
		duration = int(duration)/1000.0
	else:
		raise ValueError("Invalid argument count!")
		
except ValueError as error:
	print(error)
	print("Usage: %s <PIN> <0/1>" % sys.argv[0])
	print("or     %s <PIN> <BlinkCount> <BlinkDurationInMs>" % sys.argv[0])
	sys.exit(1)

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

# An explicit initial value is required: without it the lgpio based shim
# reads the current pin state, which fails with 'GPIO not allocated' when the
# pin was left configured as output by a previous process.
if 'data' in locals():
	GPIO.setup(pin, GPIO.OUT, initial=GPIO.HIGH if data == 1 else GPIO.LOW)
	GPIO.output(pin, data == 1)
else:
	GPIO.setup(pin, GPIO.OUT, initial=GPIO.LOW)
	for i in range(0, count):
		GPIO.output(pin, 1)
		time.sleep(duration)
		GPIO.output(pin, 0)
		time.sleep(duration)
