$(function() {
    var socket = io();

    socket.on('connect', function(){
        var $form = $('.switcher-form');
        var $url = $('#url');
        var $submit = $('#switcher-submit');

        console.log($form);

        $form.on('submit', function(e) {
            e.preventDefault();
            socket.emit('changePage', {
                location: $url.val()
            });
        });
    });
});