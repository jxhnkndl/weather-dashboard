$(document).ready(function() {

  // Init day.js
  var now = dayjs();
  var currentDate = now.format("dddd MMM. M, YYYY");


  // API Query Parameters
  var baseURL = "http://api.openweathermap.org/data/2.5/";
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
  function getWeather(city) {
    var responseData = {};

    // Wait for results from first two API calls before proceeding
    $.when(

      // API Call #1: Get current weather
      $.ajax({
        url: baseURL + "weather",
        method: "GET",
        data: {
          q: city,
          units: units,
          appid: APIKey,
        },
        success: function(response) {
          responseData.current = response;
        }
      }),

      // API Call #2: Get 5 day forecast
      $.ajax({
        url: baseURL + "forecast",
        method: "GET",
        data: {
          q: city,
          units: units,
          appid: APIKey
        },
        success: function(response) {
          responseData.forecast = response;
        }
      })
    )
    // When current/forecast data gets returned
    .done(function() {

      // Use the coordinates returned to request UV index data
      $.ajax({
        url: baseURL + "uvi",
        method: "GET",
        data: {
          lat: responseData.current.coord.lat,
          lon: responseData.current.coord.lon,
          appid: APIKey
        },
        success: function(response) {
          responseData.uv = response;
        }
      })
      // When the UV index data gets returned
      .done(function() {

        console.log(responseData);

        // Use all three response objects to display weather data in UI
        displayWeather(responseData);
      });
    });
  }


  // Display weather data in UI
  function displayWeather(data) {

    // Current weather conditions
    $("#city").text(data.current.name);

    $("#icon").attr(
      "src", 
      `http://openweathermap.org/img/w/${data.current.weather[0].icon}.png`);
    $("#icon").attr("alt", data.current.weather[0].description);

    $("#conditions").text(data.current.weather[0].main);
    $("#temperature").text(`${data.current.main.temp}\u00B0`);
    $("#humidity").text(`${data.current.main.humidity}%`);
    $("#wind-speed").text(`${data.current.wind.speed} mph`);

    $("#uv-index").removeClass("bg-success bg-warning bg-danger")
    $("#uv-index").text(data.uv.value);

    if (data.uv.value < 3) {
      $("#uv-index").addClass("bg-success");
    } else if (data.uv.value >= 3 && data.uv.value < 6) {
      $("#uv-index").addClass("bg-warning");
    } else if (data.uv.value >= 6) {
      $("#uv-index").addClass("bg-danger");
    } else {
      console.log("Invalid UV index value.");
    }
  }


  // Find weather icon from response
  function getIcon(weatherCode) {

    var iconCodes = [
      { code: "01d", icon: "fas fa-sun" },
      { code: "01n", icon: "fas fa-moon" },
      { code: "02d", icon: "fas fa-cloud-sun" },
      { code: "02n", icon: "fas fa-cloud-moon" },
      { code: "03d", icon: "fas fa-cloud" },
      { code: "03n", icon: "fas fa-cloud" },
      { code: "04d", icon: "fas fa-cloud-sun" },
      { code: "04n", icon: "fas fa-cloud-moon" },
      { code: "09d", icon: "fas fa-cloud-showers-heavy" },
      { code: "09n", icon: "fas fa-cloud-showers-heavy" },
      { code: "11d", icon: "fas fa-bolt" },
      { code: "11n", icon: "fas fa-bolt" },
      { code: "13d", icon: "fas fa-snowflake" },
      { code: "13n", icon: "fas fa-snowflake" },
      { code: "50d", icon: "fas fa-smog" },
      { code: "50n", icon: "fas fa-smog" }
    ];
  }


  // Event Listener: Search Button
  $("#search-form").on("submit", function(event) {
    event.preventDefault();

    var city = $("#search").val();
    
    // Validate that input is not empty
    if (city === "") {
      console.log("Invalid City");
      return;
    }

    getWeather(city);
  });
});