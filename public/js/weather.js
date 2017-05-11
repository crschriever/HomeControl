$(function() {
    $.ajax("https://api.openweathermap.org/data/2.5/weather?q=Atlanta,us?id=524901&APPID=6e81c08216ea10e956e2447bfefba7a7", {
        success: function(data) {
            console.log(data);
        }
    });
});