#!/usr/bin/python
import sys
import RPi.GPIO as GPIO

try:
	[_, pin, data] = sys.argv
	pin = int(pin)
	data = int(data)
except ValueError:
	print "Usage: %s PIN 0/1" % sys.argv[0]
	sys.exit()

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.OUT)

GPIO.output(pin, data == 1)

