var $vertical_centers;
var $horizontal_centers;

$(function() {
    $vertical_centers = $('.vertical-center');
    $horizontal_centers = $('.horizontal-center');
    center();
    $(window).on('resize', function() {
        center();
    });
});

function center() {
    for (var i = 0; i < $vertical_centers.length; i++) {
        var element = $vertical_centers[i];
        var $this = $(element);
        var $parent = $this.parent();
        $this.css('top', ($parent.height() / 2 - $this.height() / 2) + 'px');
    }

    for (var j = 0; j < $horizontal_centers.length; j++) {
        var element = $horizontal_centers[j];
        var $this = $(element);
        var $parent = $this.parent();
        $this.css('left', ($parent.width() / 2 - $this.width() / 2) + 'px');
    }
}