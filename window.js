// Expand collapsed search history on displays > 578px
$(document).ready(function() {

  // Set initial visibility conditions
  $("#search-history").addClass("show");
  $("#collapse-search-history").hide();

  

  // Show or hide search history based on browser window size
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