var socket
var loading = false;
var $loader;
var currentLocation;
var $content1;
var $content2;
var last = 1;
var keepLoading = false;
var deviceName;

$(function() {
    socket = io(socketTarget);
    var userID = $('#user-id-cont').text();
    $loader = $('.loader');
    $content1 = $('.viewer1');
    $content2 = $('.viewer2');

    deviceName = getCookie('deviceName');
    
    socket.on('connect', function(){

        socket.emit('joinRoom', {
            userID: userID,
            deviceName
        });

        socket.on('newPage', function(data) {
            if (data.deviceName && data.deviceName !== deviceName) {
                console.log("Not changing page because device mismatch:", deviceName, "vs", data.deviceName)
                return;
            }
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
    }, 10 * 60 * 1000);
}

function reload(loc) {

    console.log("Reload called");

    let location = loc || currentLocation;

    if (loading) {
        console.log("Still loading");
        return;
    }
    loading = true;
    // Show loader if changing to a new page
    if (loc) {
        $loader.show();
    }

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

            // If center is a function that exists then call it
            if (center) {
                center();
            }

            //setTimeout(function() {
                hidingContent.css('z-index', '1');            
                receivingContent.css('z-index', '2');
                hidingContent.html("");
                $loader.hide();
                loading = false;                           
            //}, 200);

            // If loading a new page check to see if it needs to be auto-reloaded
            if (loc) {
                let autoReload = receivingContent.find('.autoLoad').text() === 'true';
                console.log("Should auto reload " + autoReload);
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
        error: function() {
            $loader.hide();
            loading = false;                     
        },
        complete: function() {
        }
    });
}

function changePage(url) {
    socket.emit('changePage', {
        location: url,
        deviceName
    });
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}