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
  function getWeather(city) {

    var baseURL = "http://api.openweathermap.org/data/2.5/";
    var weatherData = {};

    // Current weather conditions
    $.ajax({
      url: baseURL + "weather",
      method: "GET",
      data: {
        q: city,
        units: units,
        appid: APIKey
      }
    }).then(function(response) {
      console.log(response);
      weatherData.current = response;

      // UV Index - Requires coordinates from previous API response
      $.ajax({
        url: baseURL + "uvi",
        method: "GET",
        data: {
          lat: response.coord.lat,
          lon: response.coord.lon,
          appid: APIKey
        }
      }).then(function(response) {
        console.log(response);
        weatherData.uv = response;
      });
    });

    // 5 day forecast
    $.ajax({
      url: baseURL + "forecast",
      method: "GET",
      data: {
        q: city,
        units: units,
        appid: APIKey
      }
    }).then(function(response) {
      console.log(response);
      weatherData.forecast = response;
    });

    // Render the weather data to the UI
    console.log(weatherData);
    displayWeather(weatherData);
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
    $("#temperature").text(`${data.current.main.temp}&#176;`);
    $("#humidity").text(`${data.current.main.humidity}%`);
    $("#wind-speed").text(`${data.current.wind.speed} mph`);
    $("#uv-index").text(data.uv.value);

    // Determine UV index level and paint background
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


  // Event Listener: Search Button
  $("#search-form").on("submit", function(event) {
    event.preventDefault();

    var city = $("#search").val();
    
    if (city === "") {
      console.log("Invalid City");
      return;
    }

    getWeather(city);
  });
});