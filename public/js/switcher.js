$(function() {
    var socket = io('https://home.carlschriever.com');

    socket.on('connect', function(){
        var $form = $('.switcher-form');
        var $url = $('#url');
        var $submit = $('#switcher-submit');
        var $altButtons = $('.alt-submit');
        var userID = $('#user-id-cont').text();

        socket.emit('joinRoom', {
            userID: userID
        });
        
        $altButtons.each(function(index, value) {
            $(value).on('click', function(e) {
                e.preventDefault();
                if ($(this).data('href')) {
                    socket.emit('changePage', {
                        location: $(this).data('href')
                    });
                } else {
                    socket.emit('changePage', {
                        location: $url.val()
                    });
                }
            });
        });
    });
});