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

  // Replacemenet icon array
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

  function init() {

    // Set current date in page header
    $("#today").text(currentDate);

    // Set initial search history visibility conditions
    if (window.innerWidth >= 578) {
      $("#search-history").addClass("show");
      $("#collapse-search-history").hide();
    }

    // Load cities in local storage back into application
    getSearchHistory();

    // If no cities are saved, load weather data for New York City; otherwise, get weather data for the last searched city and render all saved cities back into the search history
    if (cities.length === 0) {
      getWeather("New York");

    } else {
      var lastCityIndex = cities.length - 1;
      getWeather(cities[lastCityIndex]);

      $.each(cities, function(index, city) {
        displayCity(city);
      });
    }
  }

  // Get weather and 5 day forecast data from API
  function getWeather(city) {
    var responseData = {};

    // API Call #1: Get current weather
    $.ajax({
      url: baseURL + "weather",
      method: "GET",
      data: {
        q: city,
        units: units,
        appid: APIKey,
      }
    }).then(function(response) {
      responseData.current = response;

      // Save the coordinates from the response to request UV index data
      var coordinates = {
        lat: responseData.current.coord.lat,
        lon: responseData.current.coord.lon
      }

      getUVindex(coordinates);
      displayCurrentWeather(responseData);
    });

    // API Call #2: Get 5 day forecast
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
      displayForecast(responseData);
    });
  }

  // Get UV index data using coordinates returned by the API in current weather data
  function getUVindex(coordinates) {
    $.ajax({
      url: baseURL + "uvi",
      method: "GET",
      data: {
        lat: coordinates.lat,
        lon: coordinates.lon,
        appid: APIKey
      }
    }).then(function(response) {
      displayUV(response);
    }); 
  }

  // Replace icon from API with equivalent icon from Font Awesome
  function replaceIcon(iconCode) {

    // Parse data used in replacing the icon
    var number = iconCode.slice(0, 2);
    var dayOrNight = iconCode.slice(2);
    var currentHour = dayjs().hour();

    // Find the matching icon
    var index = icons.findIndex(function(icon, index) {
      return icon.code === number;
    });

    // Determine whether to use the daytime or nighttime version of the icon
    if (currentHour >= 06 && currentHour < 18) {
      return icons[index].day;

    } else {
      return icons[index].night;
    }
  }

  // Display current weather forecast in UI
  function displayCurrentWeather(data) {

    // Display text fields
    $("#city").text(data.current.name);
    $("#conditions").text(data.current.weather[0].main);
    $("#temperature").text(`${parseInt(data.current.main.temp)}\u00B0 F`);
    $("#humidity").text(`${data.current.main.humidity}%`);
    $("#wind-speed").text(`${data.current.wind.speed} mph`);

    // Replace API supplied icon with equivalent Font Awesome icon
    var newIcon = replaceIcon(data.current.weather[0].icon);
    $("#icon").removeClass().addClass(`h2 ${newIcon}`);
  }


  // Display UV index and UV condition color in UI
  function displayUV(data) {

    // Display text field
    $("#uv-index").text(data.value);

    // Remove existing color class
    $("#uv-index").removeClass("bg-success bg-warning bg-danger")

    // Determine condition color to apply to UV index
    if (data.value < 3) {
      $("#uv-index").addClass("bg-success");

    } else if (data.value >= 3 && data.value < 6) {
      $("#uv-index").addClass("bg-warning");

    } else if (data.value >= 6) {
      $("#uv-index").addClass("bg-danger");

    } else {
      console.log("Invalid UV index value.");
    }
  }

  // Display 5 day forecast in UI
  function displayForecast(data) {

    // Create the 5 day forecast from 3 hour blocks returned by API
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
      $(`#day-${i + 1}-temp`).text(`${parseInt(day.main.temp)}\u00B0 F`);
      $(`#day-${i + 1}-humidity`).text(`${day.main.humidity}% Humidity`);
    });
  }


  // Create 5 day forecast from API data
  function createForecast(data) {
    var forecastData = data.forecast.list;
    var fiveDayForecast = [];

    // Get date and hour of the first result returned by API
    var firstResult = {
      date: dayjs(data.forecast.list[0].dt_txt).date(),
      hour: dayjs(data.forecast.list[0].dt_txt).hour()
    };

    // Since the API returns 5 day forecast data in 3 hour increments, logic needs to determine 
    // which of those incremental forecasts to display on the page. The first two if/else if 
    // statements control which forecasts to render when the 12 PM forecasts are not available
    // for the fifth day of the 5 day forecast. The last else statement, which also covers the largest
    // number of potential situations, finds the 12 PM hour for each of the 5 days to render on the
    // page.

    if (firstResult.hour === 6) {
      for (var i = 10; i < forecastData.length; i += 8) {
        fiveDayForecast.push(forecastData[i]);
      }

      fiveDayForecast.push(forecastData[38]);

    } else if (firstResult.hour <= 09 && firstResult.hour >= 12) {
      for (var i = 9; i < forecastData.length; i +=8) {
        fiveDayForecast.push(forecastData[i]);
      }

      fiveDayForecast.push(forecastData[39]);

    } else {
      var firstNoonIndex = forecastData.findIndex(function(forecast) {
        var isTomorrow = dayjs().isBefore(forecast.dt_txt);
        var hour = dayjs(forecast.dt_txt).hour();

        if (isTomorrow && hour === 12) {
          return true;
        }
      });

      for (var i = firstNoonIndex; i < forecastData.length; i += 8) {
        fiveDayForecast.push(forecastData[i]);
      }
    }
    
    return fiveDayForecast;
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

    // Get cities saved to local history into cities array
    getSearchHistory();

    // Add the city to the local storage array
    cities.push(city);

    // Set local storage
    setSearchHistory();
  }

  // Get cities saved in local storage
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

  // Event Listenr: Delete search history
  $("#delete-history").on("click", function() {

    // Remove from UI
    $(".search-item").remove();

    // Remove from local storage array
    cities.splice(0, cities.length - 1);

    // Reset search history
    setSearchHistory();
  });

  // Event Listener: Get weather data for city in search history
  $("#search-history").on("click", ".search-item", function() {
    getWeather($(this).text());
  });

  // Event Listener: Search button
  $("#search-form").on("submit", function(event) {
    event.preventDefault();

    var city = $("#search").val();
    
    // Validate that input is not empty
    if (city === "") {
      console.log("Invalid City");
      return;
    }

    // Get weather data from API
    getWeather(city);

    // Add city to search history in UI
    displayCity(city);

    // Add city to local storage
    saveToHistory(city);

    // Reset input field
    $("#search").val("");
  });
});

// Event Listener: Resize browser window
$(window).resize(function() {

  // Get current window width
  var w = $(window).width();

  // If window is wider than 578px, expand search history; otherwise, collapse it
  if (w >= 578) {
    $("#search-history").addClass("show");
    $("#collapse-search-history").hide();
  } else {
    $("#search-history").removeClass("show");
    $("#collapse-search-history").show();
  }
});