#!/usr/bin/python
import sys
import RPi.GPIO as GPIO
import time

try:
	[_, pin, data] = sys.argv
	pin = int(pin)
	if data == "up":
		pull = GPIO.PUD_UP
	else:
		pull = GPIO.PUD_DOWN
except ValueError:
	print "Usage: %s <PIN> 'up'/'down'" % sys.argv[0]
	print "'up' or 'down' defines pullup or pulldown resistor"
	sys.exit()

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.IN, pull)

prev = False

try:
	while True:
		input = GPIO.input(pin)
		if input != prev:
			prev = input
			if prev:
				print "1"
			else:
				print "0"
		time.sleep(0.1)

except KeyboardInterrupt:
	GPIO.cleanup()

