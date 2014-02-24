$( document ).ready(function() {

    // Register button listeners
    $("#keyboard").click( function() {
        connection.send("inputtext." + prompt(""));
    });

    $("#enter").click( function() {
        connection.send("b.enter");
    });

    $("#backspace").click( function() {
        connection.send("b.backspace");
    });

    $("#left").click( function() {
        connection.send("b.left");
    });

    $("#right").click( function() {
        connection.send("b.right");
    });

    // Establish websocket connection and register error messages
    var connection;
    try {
        connection = new WebSocket("ws://" + window.location.hostname + ":8000/");
    } catch (e) {
        connection = new WebSocket("ws://localhost:8000/");
    }

    connection.onerror = function(error) {
        alert("Make sure the websocket server is running.");
    };

    connection.onclose = function() {
        alert("Socket is now closed.");
    };

    // Helper functions
    function init() {
        initTouchpad()
        initScrollbar()
    }

    function initTouchpad() {
        trackpad = document.getElementById("touchpad");
        trackpadContext = trackpad.getContext("2d");
        trackpad.addEventListener("mousedown", mouseDown, false);
        trackpad.addEventListener("mousemove", mouseXY, false);
        trackpad.addEventListener("touchstart", touchDown, false);
        trackpad.addEventListener("touchmove", touchXY, true);
        trackpad.addEventListener("touchend", touchUp, false);
    }

    function initScrollbar() {
        scrollpad = document.getElementById("scrollpad");
        scrollpadContext = scrollpad.getContext("2d");
        scrollpad.addEventListener("touchstart", scrollStart, false);
        scrollpad.addEventListener("touchmove", scrollY, true);
        scrollpad.addEventListener("touchend", scrollEnd, false);
    }

    function scrollStart() {
        mouseIsDown = 1;
        connection.send("s.Down");
    }

    function scrollEnd() {
        mouseIsDown = 0;
        connection.send("s.Up");
        scrollY();
    }

    function scrollY() {
        if (!e)
            var e = event;
        e.preventDefault();
        scrollpadY = e.targetTouches[0].pageY - scrollpad.offsetTop;
        connection.send("s." + scrollpadY);
    }

    function mouseUp() {
        mouseIsDown = 0;
        connection.send("c.Up");
        mouseXY();
    }

    function touchUp() {
        mouseIsDown = 0;
        // no touch to track, so just show state
        connection.send("t.Up");
    }

    function mouseDown() {
        mouseIsDown = 1;
        connection.send("c.Down");
        mouseXY();
    }

    function touchDown() {
        mouseIsDown = 1;
        connection.send("t.Down");
        touchXY();
    }

    function mouseXY(e) {
        if (!e)
            var e = event;
        trackpadX = e.pageX - trackpad.offsetLeft;
        trackpadY = e.pageY - trackpad.offsetTop;
        connection.send("m." + trackpadX + " " + trackpadY);
    }

    function touchXY(e) {
        if (!e)
            var e = event;
        e.preventDefault();
        trackpadX = e.targetTouches[0].pageX - trackpad.offsetLeft;
        trackpadY = e.targetTouches[0].pageY - trackpad.offsetTop;
        connection.send("m." + trackpadX + " " + trackpadY);
    }

    var trackpad, trackpadContext, scrollpad, scrollpadContext, trackpadX, trackpadY, mouseIsDown = 0;
    init();

});
