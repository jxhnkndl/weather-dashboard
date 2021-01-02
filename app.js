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
    var baseURL = "http://api.openweathermap.org/data/2.5/weather";

    $.ajax({
      url: baseURL,
      method: "GET",
      data: {
        q: city,
        units: units,
        appid: APIKey
      }
    }).then(function(response) {
      console.log(response);
      displayCurrentWeather(response);
    });
  }

  // Display weather data in UI
  function displayCurrentWeather(weather) {

    // Current weather conditions
    $("#city").text(weather.name)
    $("#icon").attr("src", `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`);
    $("#icon").attr("alt", weather.weather[0].description);
    $("#conditions").text(weather.weather[0].main)
    $("#temperature").text(`${weather.main.temp}&#176;`);
    $("#humidity").text(`${weather.main.humidity}%`);
    $("#wind-speed").text(weather.wind.speed)
    $("#uv-index")
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