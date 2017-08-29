var $submitButton;
var $textField;
var $errorField;
var csrf;

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
                alert('stting cookie');
                var d = new Date();
                d.setTime(d.getTime() + (365*24*60*60*1000));
                document.cookie = "deviceName=" + data.deviceName + "; expires=" + d.toUTCString() + ";";
                window.location = '/viewer';
            },
            error: function() {
                $errorField.slideDown();
            }
        });
    });
});