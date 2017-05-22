var loading = false;
var currentLocation;
var $content;

$(function() {
    var socket = io(socketTarget);

    socket.on('connect', function(){
        $content = $('#viewer-content');
        var userID = $('#user-id-cont').text();

        socket.emit('joinRoom', {
            userID: userID
        });

        socket.on('newPage', function(data) {
            console.log("New page: " + data.location);
            reload(data.location);
            currentLocation = data.location;            
        });
    });
});

function reload(loc) {

    let location = loc || currentLocation;

    if (loading) {
        console.log("Still loading");
        return;
    }
    loading = true;
    $.ajax('/' + location, {
        type: "POST",
        data: {
            timeOffset: new Date().getTimezoneOffset()
        },
        success: function(data) {
            $content.html(data);
            if (center) {
                center();
            }
        },
        complete: function() {
            loading = false;    
        }
    });
}