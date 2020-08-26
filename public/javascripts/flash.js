$(".alert").delay(5000).slideUp(200, function () {
    $(this).alert('close');
});
$(document).ready(function(){
    var url = window.location;
$('ul.navbar-nav a').filter(function() {
    return this.href == url;
}).addClass('active');
})
