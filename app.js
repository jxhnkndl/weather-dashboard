$(document).ready(function() {

  // Init day.js
  var now = dayjs();
  var currentDate = now.format("dddd MMM. M, YYYY");

  // API Query Parameters
  var APIKey = "f4d6848eb3a488816cecbd2392d8a108";
  var units = "imperial";


  // Initialize application
  init();

  // Application setup
  function init() {
    // Set current date in page header
    $("#today").text(currentDate);
  }

  // Get weather from API
  function getCurrentWeather(city) {
    var baseURL = "http://api.openweathermap.org/data/2.5/";
    var responseData = {};

    // Collect response data from all API calls before proceeding
    $.when(
      // API Call #1: Get current weather conditions
      $.ajax({
        url: baseURL + "weather",
        method: "GET",
        data: {
          q: city,
          units: units,
          appid: APIKey
        }
      }).then(function(response) {
        responseData.current = response;

        // API Call #2: Get UV index using coordinates returned by first call
        $.ajax({
          url: baseURL + "uvi",
          method: "GET",
          data: {
            lat: response.coord.lat,
            lon: response.coord.lon,
            appid: APIKey
          }
        }).then(function(response) {
          responseData.uv = response;
        });
      }),

      // API Call #3: Get 5 day forecast in 3 hour increments
      $.ajax({
        url: baseURL + "forecast",
        method: "GET",
        data: {
          q: city,
          units: units,
          appid: APIKey
        }
      }).then(function(response) {
        responseData.forecast = response;
      })
    )
    // When API has responded to all three requests
    .then(function() {

    });
  }

  // Display weather data in UI
  function displayWeather(weather) {

  }

  // Event Listener: Search Button
  $("#search-form").on("submit", function(event) {
    event.preventDefault();

    var city = $("#search").val();
    
    if (city === "") {
      console.log("Invalid City");
      return;
    }

    getCurrentWeather(city);
  });

});