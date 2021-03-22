# Weather Dashboard

![languages](https://img.shields.io/github/languages/count/jxhnkndl/weather-dashboard?style=plastic)
![html](https://img.shields.io/github/languages/top/jxhnkndl/weather-dashboard?style=plastic)
![commit](https://img.shields.io/github/last-commit/jxhnkndl/weather-dashboard?style=plastic)


## Table of Contents
* [Deployed Application](#deployed-application)
* [Description](#description)
* [Technologies](#technologies)
* [Features](#features)
* [Application Demo](#live-demo)
* [License](#license)
* [Contact](#contact)


## Deployed Application
Weather Dashboard is live at the link below:

[Weather Dashboard - Live Demo](https://jxhnkndl.github.io/weather-dashboard)


## Description

Weather Dashboard is a simple browser-based weather application. Users can search for a city's current weather conditions, current UV-index, and five-day forecast. Previously searched cities can be quickly recalled from a search history list located below the input field. 


## Technologies
* HTML
* CSS
* Bootstrap 4
* JavaScript
* jQuery
* AJAX
* Day.js
* OpenWeather API - [View Docs](https://openweathermap.org/api)


## Features

* **Responsive UI:** The dashboard is designed to look sleek and simple across multiple breakpoints. On extra small devices, the application's search history collapses into a button allowing the user to toggle its visibility on and off.

* **Dynamically Displayed Weather Data:** The application does not need to be refreshed when requesting weather data for new cities. The user interface updates itself with each new request.

* **UV Condition Indicator:** Using the EPA's standards for UV conditions, the application renders the UV index in green when the condition is favorable, yellow when the condition is moderate, and red when the condition is severe.

* **Intelligent Five-Day Forecast:** Since five-day forecast data gets returned by the OpenWeather API in three-hour increments, the time coverage on the fifth day changes depending on when the request gets made. In order to maximize accuracy, the application looks to fill each of the five days using a noon forecast. If the application can't fulfill that goal for the fifth day, it uses a series of conditions to display the next best option.

* **Live Updating Search History:** Every city gets added to the application's search history for convenient access. Just click a city and the application will re-request and display its current weather and forecast data. 

* **Store Cities Locally:** Every search gets saved to local storage using the browser. This allows users to search for cities, step away from the application, and resume right where they left off. All previously searched cities (with the exception of the most recently searched city) can be deleted using the "Delete History" button.

* **Load Weather Data for Last Searched City on Launch:** The application keeps the last searched city in local storage so that its current weather and forecast data can be re-requested and displayed when the application is launched.


## Live Demo
UI/UX demostration of the Weather Dashboard:

![Application Preview](assets/weather-dashboard-demo.gif)


## License
Copyright (c) 2021 J.K. Royston  
Licensed under the [MIT License](https://opensource.org/licenses/MIT).


## Contact
J.K. Royston  
<jkroyston@gmail.com>  
[GitHub](https://www.github.com/jxhnkndl)