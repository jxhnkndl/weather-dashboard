$(document).ready(function() {

  // Init day.js
  var now = dayjs();
  var currentDate = now.format("dddd MMM. D, YYYY");


  // API Query Parameters
  var baseURL = "http://api.openweathermap.org/data/2.5/";
  var APIKey = "f4d6848eb3a488816cecbd2392d8a108";
  var units = "imperial";


  // Icon array
  var icons = [
    { code: "01d", class: "fas fa-sun" },
    { code: "01n", class: "fas fa-moon" },
    { code: "02d", class: "fas fa-cloud-sun" },
    { code: "02n", class: "fas fa-cloud-moon" },
    { code: "03d", class: "fas fa-cloud" },
    { code: "03n", class: "fas fa-cloud" },
    { code: "04d", class: "fas fa-cloud-sun" },
    { code: "04n", class: "fas fa-cloud-moon" },
    { code: "09d", class: "fas fa-cloud-rain" },
    { code: "09n", class: "fas fa-cloud-rain" },
    { code: "10d", class: "fas fa-cloud-showers-heavy" },
    { code: "10n", class: "fas fa-cloud-showers-heavy" },
    { code: "11d", class: "fas fa-bolt" },
    { code: "11n", class: "fas fa-bolt" },
    { code: "13d", class: "fas fa-snowflake" },
    { code: "13n", class: "fas fa-snowflake" },
    { code: "50d", class: "fas fa-smog" },
    { code: "50n", class: "fas fa-smog" }
  ];


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


  // Icon replacement
  function replaceIcon(iconCode) {
    var iconClass;

    $.each(icons, function(index, icon) {
      if (iconCode === icon.code) {
        iconClass = icon.class;
      } 
    });

    return iconClass;
  }

  // Display weather data in UI
  function displayWeather(data) {

    // Current Weather: Basic fields
    $("#city").text(data.current.name);
    $("#conditions").text(data.current.weather[0].main);
    $("#temperature").text(`${data.current.main.temp}\u00B0`);
    $("#humidity").text(`${data.current.main.humidity}%`);
    $("#wind-speed").text(`${data.current.wind.speed} mph`);
    $("#uv-index").text(data.uv.value);

    var newIcon = replaceIcon(data.current.weather[0].icon);
    $("#icon").removeClass().addClass(`h2 ${newIcon}`);

    // Remove existing background color from UV index
    $("#uv-index").removeClass("bg-success bg-warning bg-danger")

    // Select background color for UV index based on conditions from EPA
    if (data.uv.value < 3) {
      $("#uv-index").addClass("bg-success");
    } else if (data.uv.value >= 3 && data.uv.value < 6) {
      $("#uv-index").addClass("bg-warning");
    } else if (data.uv.value >= 6) {
      $("#uv-index").addClass("bg-danger");
    } else {
      console.log("Invalid UV index value.");
    }

    // Get 5 day forecast array
    var forecast = createForecast(data);

    console.log(forecast);

    // Render 5 day forecast
    $.each(forecast, function(i, day) {

      var date = dayjs(day.dt_txt).format("MMM. D");
      var year = dayjs(day.dt_txt).format("YYYY");

      var iconClasses = replaceIcon(day.weather[0].icon);

      $(`#day-${i + 1}-icon`).removeClass().addClass(`h2 text-info ${iconClasses}`);

      $(`#day-${i + 1}-date`).text(date);
      $(`#day-${i + 1}-year`).text(year);

      $(`#day-${i + 1}-conditions`).text(day.weather[0].main);
      $(`#day-${i + 1}-temp`).text(`${parseInt(day.main.temp)}\u00B0`);
      $(`#day-${i + 1}-humidity`).text(`${day.main.humidity}% Humidity`);
    });
  }


  // Create 5 day forecast from API data
  function createForecast(data) {
    var weatherData = data.forecast.list;
    var weatherArray = [];

    var firstIndex = weatherData.findIndex(function(element, index) {
      var date = element.dt_txt;
      var isTomorrow = dayjs().isBefore(date, "day");

      return isTomorrow;
    });

    for (var i = firstIndex; i < weatherData.length; i += 8) {
      weatherArray.push(weatherData[i]);
    }

    return weatherArray;
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