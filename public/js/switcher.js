$(function() {
    var socket = io(socketTarget);

    socket.on('connect', function(){
        var $form = $('.switcher-form');
        var $url = $('#url');
        var $device = $('#device');
        var $submit = $('#switcher-submit');
        var $altButtons = $('.alt-submit');
        var userID = $('#user-id-cont').text();

        socket.emit('joinRoom', {
            userID: userID
        });
        
        $altButtons.each(function(index, value) {
            $(value).on('click', function(e) {
                e.preventDefault();
                if ($(this).data('href') && $device.val() !== "") {
                    socket.emit('changePage', {
                        location: $(this).data('href'),
                        deviceName: $device.val()
                    });
                } else if ($(this).data('href')) {
                    socket.emit('changePage', {
                        location: $(this).data('href'),
                    });
                } else if ($device.val() !== "") {
                    socket.emit('changePage', {
                        location: $url.val(),
                        deviceName: $device.val()
                    });
                } else {
                    socket.emit('changePage', {
                        location: $url.val(),
                    });
                }
            });
        });
    });
});