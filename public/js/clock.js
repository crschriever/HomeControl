var today = new Date();
var optionsDate = {  
    weekday: "long", year: "numeric", month: "long",  
    day: "numeric"  
};
var optionsTime = {  
    weekday: "none", year: "none", month: "none",  
    day: "none"  
};

$(function() {
    var $date = $('.date');
    var $time = $('.time');

    update($date, $time);
});

function update($date, $time) {
    today = new Date();  
    $date.text(today.toLocaleDateString("en-us", optionsDate));
    $time.text(today.toLocaleTimeString("en-us"));

    setTimeout(function() {update($date, $time);}, 500);
}