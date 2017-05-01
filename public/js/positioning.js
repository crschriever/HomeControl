var $vertical_centers;

$(function() {
    $vertical_centers = $('.vertical-center');
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
}