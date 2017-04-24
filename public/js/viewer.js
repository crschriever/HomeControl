$(function() {
    var socket = io();

    socket.on('connect', function(){
        var $frame = $('iframe');

        socket.on('newPage', function(data) {
            $frame.attr('src', '/' + data.location);
        });
    });
});