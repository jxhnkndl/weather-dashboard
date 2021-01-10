# Weather Dashboard

![languages](https://img.shields.io/github/languages/count/jxhnkndl/weather-dashboard?style=plastic)
![html](https://img.shields.io/github/languages/top/jxhnkndl/weather-dashboard?style=plastic)
![commit](https://img.shields.io/github/last-commit/jxhnkndl/weather-dashboard?style=plastic)

## Table of Contents
* [Deployed Application](#deployed-application)
* [Project Goals](#project-goals)
* [Features](#features)
* [Design Notes](#design-notes)
* [Technologies](#technologies)
* [Live Demo](#live-demo)
* [License](#license)

## Deployed Application
The deployed application can be viewed at the link below.

[Weather Dashboard - Live Demo](https://jxhnkndl.github.io/weather-dashboard)

## Project Goals

The goal of this weather dashboard is to take in a city, request its current weather conditions and five-day forecast from the OpenWeather API, and dynamically display data from the API's response in the user interface. The application displays both a city's current weather data and its five-day forecast. Both the current weather and the five-day forecast display the city's weather condition along with a corresponding icon, temperature, and humidity. Additionally, the current weather displays the the wind speed and UV index. The UV index has a dynamically generated color code corresponding to how favorable or unfavorable the condition is based on EPA standards. 

Cities searched by the user get added to both a visual search history in the user interface and to local storage for easy future access. When the user clicks on a city in the search history, the application requests and displays updated weather and five-day forecast data for that city in the user interface. If the user clicks the delete history button, all of the user's saved cities (with the exception of the most recently searched city) are deleted from both the user interface and local storage. Lastly, if the user closes the application and reopens it later, current weather and forecast data from the last searched city will auto-populate the user interface.

## Features

* **Responsive UI:** The dashboard is designed to look sleek and simple across multiple breakpoints. On extra small devices, the application's search history collapses into a button allowing the user to toggle its visibility on and off.

* **Dynamically Displayed Weather Data:** The application does not need to be refreshed when requesting weather data for new cities. The user interface updates itself with each new request.

* **UV Condition Indicator:** Using the EPA's standards for UV conditions, the application renders the UV index in green when the condition is favorable, yellow when the condition is moderate, and red when the condition is severe.

* **Intelligent Five-Day Forecast:** Since five-day forecast data gets returned by the OpenWeather API in three-hour increments, the time coverage on the fifth day changes depending on when the request gets made. In order to maximize accuracy, the application looks to fill each of the five days using a noon forecast. If the application can't fulfill that goal for the fifth day, it uses a series of conditions to display the next best option.

* **Live Updating Search History:** Every city gets added to the application's search history for convenient access. Just click a city and the application will re-request and display its current weather and forecast data. 

* **Store Cities Locally:** Every search gets saved to local storage using the browser. This allows users to search for cities, step away from the application, and resume right where they left off. All previously searched cities (with the exception of the most recently searched city) can be deleted using the "Delete History" button.

* **Load Weather Data for Last Searched City on Launch:** The application keeps the last searched city in local storage so that its current weather and forecast data can be re-requested and displayed when the application is launched.

## Design Notes

In addition to the acceptance criteria provided for the application, I decided to take on a couple of extra design challenges. 

First, I wanted another opportunity to practice responsive design, so I tried to make the application look clean across Bootstrap's breakpoints using the grid system and a search history that can be collapsed on extra small viewports.

Second, I really liked the way that Font Awesome's weather icons looked enough that I wanted to find a way to use them. Using Font Awesome's library, I was able to find both daytime and nighttime icons equivelent to all of OpenWeather's icons. I had to solve the challenge of figuring out how the application could determine which icon the OpenWeather API returned, whether the replacement should be a daytime or nighttime icon, and how the application would go about swapping the Font Awesome icon in place of the OpenWeather icon. The result is a sleeker, more stylish, and more responsive icon.

Lastly, I chose to learn how to use Day.js to handle the time related information that this application required. Day.js is being used to format the date in the header, all of the dates in the five-day forecast, and behind the scenes to sort through the forty three-hour forecasts returned by the OpenWeather API and determine which ones to use when displaying the five-day forecast on the page.

Overall, I learned something from implementing these additional features and I think that each of them makes the application a little bit better.

## Technologies
* HTML
* CSS
* Bootstrap 4
* JavaScript
* jQuery
* Day.js

## Live Demo

![Application Preview](assets/weather-dashboard-demo.gif)

## License

MIT @ [J.K. Royston](https://github.com/jxhnkndl)