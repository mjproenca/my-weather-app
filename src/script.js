//Date and Time

function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

//Display Forecast

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
              <div class="col">
                <div class="WeatherForecastPreview">
                  <div class="forecast-time">${formatDay(forecastDay.dt)}</div>
               
                  <div class="small-icon">
                    <img src="https://openweathermap.org/img/wn/${
                      forecastDay.weather[0].icon
                    }@2x.png" alt="" width="42" />
                  </div>
                  <div class="forecast-temperature">
                    <span class="forecast-temperature-max">${Math.round(
                      forecastDay.temp.max
                    )}°</span
                    ><span class="forecast-temperature-min"> ${Math.round(
                      forecastDay.temp.min
                    )}°</span>
                  </div>
                </div>
              
            </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "4e31fad687a03973ab3fc49fdc685069";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

//Display Weather Conditions

function displayWeatherConditions(response) {
  document.querySelector("#city").innerHTML = response.data.name.toUpperCase();
  document.querySelector("#largeTemperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#conditions").innerHTML =
    response.data.weather[0].description;

  let iconElement = document.querySelector("#largeIcon");

  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  celsiusTemperature = response.data.main.temp;

  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");

  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "4e31fad687a03973ab3fc49fdc685069";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherConditions);
}

//Large City & Real Temp

function showCity(event) {
  event.preventDefault();
  let city = document.querySelector("#searchCity").value;
  searchCity(city);
}

//Geo Location

function searchCurrentLocation(position) {
  let apiKey = "4e31fad687a03973ab3fc49fdc685069";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherConditions);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}

//Change to Celsius/Farenheit

function changeToCelsius(event) {
  event.preventDefault();
  let largeTemperature = document.querySelector("#largeTemperature");
  changeCelsius.classList.add("active");
  changeFarenheit.classList.remove("active");
  largeTemperature.innerHTML = Math.round(celsiusTemperature);
}

let changeCelsius = document.querySelector("#celsiusLink");
changeCelsius.addEventListener("click", changeToCelsius);

function changeToFarenheit(event) {
  event.preventDefault();
  let farenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  changeCelsius.classList.remove("active");
  changeFarenheit.classList.add("active");
  let largeTemperature = document.querySelector("#largeTemperature");
  largeTemperature.innerHTML = Math.round(farenheitTemperature);
}

let changeFarenheit = document.querySelector("#farenheitLink");
changeFarenheit.addEventListener("click", changeToFarenheit);

let celsiusTemperature = null;
//button actions

//
let dateElement = document.querySelector("#dateTime");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);
let searchButton = document.querySelector("#searchButton");
searchButton.addEventListener("click", searchCity);
let form = document.querySelector("form");
let largeCity = document.querySelector("#locationCity");
form.addEventListener("submit", showCity);
let currentLocationButton = document.querySelector("#currentPositionBtn");
currentLocationButton.addEventListener("click", getCurrentLocation);
searchCity("Ericeira");
