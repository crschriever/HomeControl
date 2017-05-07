$(function() {
    var socket = io();

    socket.on('connect', function(){
        var $frame = $('iframe');

        var loading = false;

        socket.on('newPage', function(data) {
            console.log("New page");
            if (loading) {
                return;
            }
            loading = true;
            if (data.location.includes('http') || data.location.includes('www.')) {
                $frame.attr('src', data.location);
            } else {
                $frame.attr('src', '/' + data.location);
            }
            $frame.on('load', function(){
                loading = false;
                $frame.contents().find('body').append("<script>console.log(\"YOYOYO\");</script>");
            });
        });
    });
});