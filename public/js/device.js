let $submitButton;
let $textField;
let $errorField;
let csrf;

$(function() {
    $submitButton = $('.btn');
    $textField = $('input');
    $errorField = $('.error');
    csrf = $('#csrf').text();
    $submitButton.on('click', function() {
        $errorField.hide();
        $.ajax('/device/register',
        {
            method: 'POST',
            data: {
                deviceName: $textField.val(),
                _csrf: csrf
            },
            success: function(data) {
                var d = new Date();
                d.setTime(d.getTime() + (365*24*60*60*1000));
                document.cookie = "deviceName=" + data.deviceName + "; expires=" + d.toUTCString() + ";";
                window.location.replace('/viewer');
            },
            error: function() {
                $errorField.slideDown();
            }
        });
    });
});