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

  // Get weather from API
  function getWeather() {
    var city = $("#search").val();
    var units = "imperial";
    var APIKey = "f4d6848eb3a488816cecbd2392d8a108";
    var queryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${APIKey}`;

    if (city === "") {
      console.log("Invalid City");
      return;
    }

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
    });

  }

  // Event Listener: Search Button
  $("#search-form").on("submit", function(event) {
    event.preventDefault();
    getWeather();
  });

});