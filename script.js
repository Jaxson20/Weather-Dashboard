// JavaScript code to interact with the OpenWeatherMap API and handle user actions
const apiKey = "1ff71ed21c610c5c086bc76156794ba7"; // Replace with your actual API key

function searchWeather() {
  const cityInput = document.getElementById("cityInput");
  const cityName = cityInput.value;

  cityInput.value = "";

  
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        alert("City not found. Please enter a valid city name.");
        return;
      }

      const { lat, lon } = data[0];
      fetchWeatherData(lat, lon, cityName);
    })
    .catch(error => {
      console.error("Error fetching geocoding data:", error);
    });
}

function fetchWeatherData(lat, lon, cityName) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const currentWeather = data.list[0];
      const forecast = data.list.slice(1, 6);
      updateCurrentWeather(currentWeather, cityName);
      updateForecast(forecast);
      addToSearchHistory(cityName);
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
    });
}

function updateCurrentWeather(data, cityName) {
  document.getElementById("cityName").textContent = cityName;
  document.getElementById("currentDate").textContent = new Date(data.dt * 1000).toLocaleDateString();
  document.getElementById("weatherIcon").textContent = data.weather[0].main;
  document.getElementById("temperature").textContent = data.main.temp;
  document.getElementById("humidity").textContent = data.main.humidity;
  document.getElementById("windSpeed").textContent = data.wind.speed;
}

function updateForecast(forecastData) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";

  forecastData.forEach(day => {
    const forecastCard = document.createElement("div");
    forecastCard.classList.add("weather-card");

    forecastCard.innerHTML = `
      <p><strong>Date:</strong> ${new Date(day.dt * 1000).toLocaleDateString()}</p>
      <p><strong>Weather:</strong> ${day.weather[0].main}</p>
      <p><strong>Temperature:</strong> ${day.main.temp}&deg;C</p>
      <p><strong>Humidity:</strong> ${day.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${day.wind.speed} m/s</p>
    `;

    forecastDiv.appendChild(forecastCard);
  });
}

function addToSearchHistory(cityName) {
  const searchHistory = document.getElementById("searchHistory");
  const listItem = document.createElement("li");
  listItem.textContent = cityName;
  listItem.addEventListener("click", () => {
    searchWeatherForCity(cityName);
  });

  searchHistory.appendChild(listItem);
}

function searchWeatherForCity(cityName) {
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        alert("City not found. Please enter a valid city name.");
        return;
      }

      const { lat, lon } = data[0];
      fetchWeatherData(lat, lon, cityName);
    })
    .catch(error => {
      console.error("Error fetching geocoding data:", error);
    });
}

