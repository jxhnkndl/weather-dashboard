$(document).ready(function() {

  // Init day.js
  var now = dayjs();
  var currentDate = now.format("dddd MMM. M, YYYY");

  // Initialize application
  init();

  // Application setup
  function init() {
    // Set current date in page header
    $("#today").text(currentDate);
  }


});