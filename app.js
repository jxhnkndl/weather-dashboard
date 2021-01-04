$(document).ready(function() {

  // Init local storage array and current city holding variable
  var cities = [];
  var currentCity;


  // Init day.js
  var now = dayjs();
  var currentDate = now.format("dddd MMM. D, YYYY");


  // API Query Parameters
  var baseURL = "https://api.openweathermap.org/data/2.5/";
  var APIKey = "f4d6848eb3a488816cecbd2392d8a108";
  var units = "imperial";


  // Icon array
  var icons = [
    {
      code: "01",
      day: "fas fa-sun",
      night: "fas fa-moon"
    },
    {
      code: "02",
      day: "fas fa-cloud-sun",
      night: "fas fa-cloud-moon"
    },
    {
      code: "03",
      day: "fas fa-cloud",
      night: "fas fa-cloud"
    },
    {
      code: "04",
      day: "fas fa-cloud-sun",
      night: "fas fa-cloud-moon"
    },
    {
      code: "09",
      day: "fas fa-cloud-rain",
      night: "fas fa-cloud-rain"
    },
    {
      code: "10",
      day: "fas fa-cloud-showers-heavy",
      night: "fas fa-cloud-showers-heavy"
    },
    {
      code: "11",
      day: "fas fa-bolt",
      night: "fas fa-bolt"
    },
    {
      code: "13",
      day: "fas fa-snowflake",
      night: "fas fa-snowflake"
    },
    {
      code: "50",
      day: "fas fa-smog",
      night: "fas fa-smog"
    }
  ];


  // Initialize application
  init();


  // Application setup
  function init() {

    // Show loading modal while data is retrieved asynchronously
    showLoading();

    // Set initial search history visibility conditions
    if (window.innerWidth >= 578) {
      $("#search-history").addClass("show");
      $("#collapse-search-history").hide();
    }

    // Get cities stored in local storage and render to search history
    getSearchHistory();

    // Set current date in page header
    $("#today").text(currentDate);


    // If there are no cities saved to the search history
    if (cities.length === 0) {
      getWeather("New York");
    } 
    // If there are cities saved to the search history
    else {
      var lastCityIndex = cities.length - 1;
      getWeather(cities[lastCityIndex]);

      $.each(cities, function(index, city) {
        displayCity(city);
      });
    }
  }


  // Show loading modal
  function showLoading() {

    $("#loading").modal("show");
    $(".container").css("opacity", "0.05");
    
    setTimeout(function() {
      $("#loading").modal("hide");
      $(".container").animate({ opacity: 1 });
  
    }, 1000);
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

  
  // Replace icon from API with equivalent icon from Font Awesome
  function replaceIcon(iconCode) {
    var number = iconCode.slice(0, 2);
    var dayOrNight = iconCode.slice(2);
    var currentHour = dayjs().hour();

    var index = icons.findIndex(function(icon, index) {
      return icon.code === number;
    });

    if (currentHour >= 06 && currentHour < 18) {
      return icons[index].day;
    } else {
      return icons[index].night;
    }
  }


  // Display weather data in UI
  function displayWeather(data) {
    displayCurrentWeather(data);
    displayForecast(data);
  }


  function displayCurrentWeather(data) {

    // Display basic text fields
    $("#city").text(data.current.name);
    $("#conditions").text(data.current.weather[0].main);
    $("#temperature").text(`${parseInt(data.current.main.temp)}\u00B0`);
    $("#humidity").text(`${data.current.main.humidity}%`);
    $("#wind-speed").text(`${data.current.wind.speed} mph`);
    $("#uv-index").text(data.uv.value);

    // Replace API supplied icon with equivalent Font Awesome icon
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
  }


  function displayForecast(data) {

    // Get 5 day forecast array
    var forecast = createForecast(data);

    // Paint UI with 5 day forecast data
    $.each(forecast, function(i, day) {

      // Format date for display
      var date = dayjs(day.dt_txt).format("MMM. D");
      var year = dayjs(day.dt_txt).format("YYYY");

      // Replace API supplied icon with equivalent Font Awesome icon
      var iconClasses = replaceIcon(day.weather[0].icon);
      $(`#day-${i + 1}-icon`).removeClass().addClass(`h2 text-info ${iconClasses}`);

      // Display basic text fields
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
    var forecastData = [];

    var firstIndex = weatherData.findIndex(function(element, index) {
      var date = element.dt_txt;
      
      var hour = dayjs(date).hour();
      var isTomorrow = dayjs().isBefore(date, "day");

      if (isTomorrow && hour >= 9 && hour <= 18) {
        return true;
      }
    });

    for (var i = firstIndex; i < weatherData.length; i += 8) {
      forecastData.push(weatherData[i]);
    }

    return forecastData;
  }


  // Add city to search history in UI
  function displayCity(city) {
    var li = $("<li>");
    li.addClass("list-group-item search-item");
    li.text(city);
    $("#search-history").prepend(li);
  }


  // Save city to search history
  function saveToHistory(city) {

    getSearchHistory();

    cities.push(city);

    setSearchHistory();
  }


  // Get local storage
  function getSearchHistory() {
    if (localStorage.getItem("cities") === null) {
      cities = [];
    } else {
      cities = JSON.parse(localStorage.getItem("cities"));
    }
  }


  // Set local storage
  function setSearchHistory() {
    localStorage.setItem("cities", JSON.stringify(cities));
  }


  // Event Listenr: Delete search history from UI and local storage
  $("#delete-history").on("click", function() {
    $(".search-item").remove();

    cities.splice(0, cities.length - 1);

    setSearchHistory();
  });


  // Event Listener: Search
  $("#search-form").on("submit", function(event) {
    event.preventDefault();

    var city = $("#search").val();
    
    // Validate that input is not empty
    if (city === "") {
      console.log("Invalid City");
      return;
    }

    showLoading();
    getWeather(city);
    displayCity(city);
    saveToHistory(city);

    $("#search").val("");
  });
});


// Event Listener: Resize browser window
// Expand or collapse search history based on browser window size
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