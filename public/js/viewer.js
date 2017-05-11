$(function() {
    var socket = io(socketTarget);

    socket.on('connect', function(){
        var $content = $('#viewer-content');
        var loading = false;
        var userID = $('#user-id-cont').text();

        socket.emit('joinRoom', {
            userID: userID
        });

        socket.on('newPage', function(data) {
            console.log("New page: " + data.location);
            if (loading) {
                console.log("Still loading");
                return;
            }
            loading = true;
            $.ajax('/' + data.location, {success: function(data) {
                $content.html(data);
                loading = false;
            }});
        });
    });
});