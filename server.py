#!/usr/bin/env python
from geventwebsocket import WebSocketServer, WebSocketApplication, Resource
from pymouse import PyMouse
from pykeyboard import PyKeyboard
import time

SPEED = 3

class Position:
    def __init__(self, x, y):
        self.x = int(x)
        self.y = int(y)

    def __repr__(self):
        return str(self.x) + ' ' + str(self.y)

    def __str__(self):
         return str(self.x) + ' ' + str(self.y)

class HTMLMote(WebSocketApplication):
    def on_open(self):
        print "Connection opened"

    def on_message(self, message):
        handle_message(message)

    def on_close(self, reason):
        print reason

m = PyMouse()
k = PyKeyboard()

last_server_position = Position(*m.position())
last_client_position = None
last_move_time = time.time()

last_press_down = None
last_release = None
last_click_time = time.time()

long_click = False

def calc_new_server_position(new_client_position):
    delta_x = (new_client_position.x - last_client_position.x) * SPEED
    delta_y = (new_client_position.y - last_client_position.y) * SPEED
    return Position(last_server_position.x + delta_x, last_server_position.y + delta_y)


def handle_message(message):
    try:
        message_type, value = message.split('.', 1)
        if 'inputtext' in message_type:
            k.type_string(value)
        if 'm' in message_type:
            move_mouse(value)
        if 't' in message_type:
            handle_touch(value)
        if 'b' in message_type:
            if 'enter' in value:
                k.tap_key(k.enter_key)
            if 'backspace' in value:
                k.tap_key(k.backspace_key)
            if 'left' in value:
                m.click(*m.position())
            if 'right' in value:
                m.click(*m.position(), button=2)
    except Exception as e:
        print 'Failure' + str(e)

def handle_touch(value):
    print value
    global last_client_position
    global last_release
    global last_press_down
    global last_click_time
    if 'Up' in value:
        m.release(*m.position())
        last_release = time.time()
        # Clear last position
        last_client_position = None 
        print 'Release'
        # Short Click
        if last_release - last_press_down < .1:
            m.click(*m.position())
            last_click_time = last_release
            print 'Short Click', last_release - last_press_down
    if 'Down' in value:
        last_press_down = time.time()
        if last_press_down - last_click_time < .2:
            m.press(*m.position())
            print 'Long click started'

def move_mouse(message_value):
    global last_client_position
    global last_server_position
    global last_move_time
    new_client_position = Position(*message_value.split())
    if last_client_position is None:
        last_server_position = Position(*m.position())
        last_client_position = new_client_position
    last_server_position = calc_new_server_position(new_client_position)
    m.move(last_server_position.x, last_server_position.y)
    last_client_position = new_client_position
    last_move_time = time.time()

WebSocketServer(('', 8000), Resource({'/': HTMLMote})).serve_forever()
