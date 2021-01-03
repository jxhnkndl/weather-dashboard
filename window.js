// Expand collapsed search history on displays > 578px
$(document).ready(function() {
  $(window).resize(function() {
    var w = $(window).width();

    if (w >= 578) {
      $("#search-history").addClass("show");
      $("#collapse-search-history").hide();
    } else {
      $("#search-history").removeClass("show");
      $("#collapse-search-history").show();

    }
  });
});