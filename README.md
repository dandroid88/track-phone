## Simple
<p align="center">
  <img src="https://raw.github.com/dandroid88/trackphone/master/screenshot.png"/>
</p>

## Concept

*  Control a computers mouse keyboard from your phone
*  Inspired by the wonderful RemoteDroid android application/server
*  HTML5 with no installation on the client device (right now only really works with phones/tablets) hence cross platform

## Example use cases

*  Control your computer hooked up to your TV from anywhere with Wifi (really nice for media servers connected to the tv)
*  Control a computer from your phone during a presentation

## Under the hood

*  Websockets are used to transport touch events to a python websocket server
*  HTML canvas is used to follow touch events and avoid long clicks on mobile
*  pyuserinput is used to move the mouse/click/type etc. This lib is cross platform so it shouldnt take much to stand this up on something other than linux (I'm using ubuntu 12.04-64).

## Current Limitations
*  https://code.google.com/p/chromium/issues/detail?id=118639 - this is particularly lame.  Much like remote droid, it would be nice to pop the keyboard up on some button press and have the key input directly sent to server.  That being said, if it could be used like that, I don't really know how the key events would be captured if the mobile device is using an alternative keyboard like swype.
*  The algorithm for determining when to click/double click and hold is incomplete and kinda flaky.  One of my next steps is to refactor and think this through like a finite state machine perhaps.  Maybe there is a better model for this.
*  The key input is currently pretty lame. For instance, if a search box or a terminal requires that you press the enter key, you can't do it yet.  This should be a simple enhancement though.
*  Performance, my dev laptop is pretty fast and I have been testing with my S4 and my wifes 5s.  Its reasonably smooth with these combinations but I'm not really sure how it will perform on an older phone/slower server.

## Take over the world strategy

I have been slacking on my [webmote project](https://github.com/dandroid88/webmote) however part of my goal is to refactor this into a library/service that could be wrapped in a plugin for this project.  I already run the webmore project on my media server hence for opening up movie files and other things I want to completely eliminate the need to use anything but my phone to interact with the server/stereo/tv/tuner/etc.

## Alternatives/Inspirations
*  [logitech device that some of my friends use](http://www.amazon.com/Logitech-Wireless-Keyboard-Built-In-Multi-Touch/dp/B005DKZTMG/ref=sr_1_9?ie=UTF8&qid=1390443425&sr=8-9&keywords=keyboard+mouse+wireless)
*  [native app for android which was the primary inspiration](http://remotedroid.net/)
