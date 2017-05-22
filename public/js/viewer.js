var loading = false;
var currentLocation;
var $content1;
var $content2;
var last = 1;
var keepLoading = false;

$(function() {
    var socket = io(socketTarget);

    socket.on('connect', function(){
        $content1 = $('.viewer1');
        $content2 = $('.viewer2');
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



function auto_reload() {
    setTimeout(function() {
        if (keepLoading) {
            reload();
            auto_reload();
        }
    }, 10000);
}

function reload(loc) {

    console.log("Reload called");

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
            let receivingContent = (last === 0) ? $content2 : $content1;
            let hidingContent = (last === 0) ? $content1 : $content2;

            last++;
            last %= 2;

            receivingContent.html(data);
            if (center) {
                center();
            }
            hidingContent.css('display', 'none');            
            receivingContent.css('display', 'block');

            // If loading a new page check to see if it needs to be auto-reloaded
            if (loc) {
                let autoReload = $('.autoLoad').text() === 'true';
                // If auto reload isn't already happening
                if (!keepLoading && autoReload) {
                    keepLoading = true;
                    auto_reload();
                } else {
                    // If true it stays true if false or null it goes to false
                    keepLoading = autoReload || false;
                }
            }
        },
        complete: function() {
            loading = false;    
        }
    });
}