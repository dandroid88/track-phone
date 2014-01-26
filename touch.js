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
        can = document.getElementById("touchpad");
        ctx = can.getContext("2d");
        can.addEventListener("mousedown", mouseDown, false);
        can.addEventListener("mousemove", mouseXY, false);
        can.addEventListener("touchstart", touchDown, false);
        can.addEventListener("touchmove", touchXY, true);
        can.addEventListener("touchend", touchUp, false);
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
        canX = e.pageX - can.offsetLeft;
        canY = e.pageY - can.offsetTop;
        connection.send("m." + canX + " " + canY);
    }

    function touchXY(e) {
        if (!e)
            var e = event;
        e.preventDefault();
        canX = e.targetTouches[0].pageX - can.offsetLeft;
        canY = e.targetTouches[0].pageY - can.offsetTop;
        connection.send("m." + canX + " " + canY);
    }

    var can, ctx, canX, canY, mouseIsDown = 0;
    init();

});
