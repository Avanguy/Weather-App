let cities = [
    { name: "newyork", coords: [40.7128, -74.0060] },
    { name: "london", coords: [51.5074, -0.1278] },
    { name: "tokyo", coords: [35.6895, 139.6917] },
    { name: "paris", coords: [48.8566, 2.3522] },
    { name: "nuuk", coords: [64.1835, -51.7216] },
    { name: "sanfrancisco", coords: [37.7749, -122.4194] },
    { name: "sydney", coords: [-33.8688, 151.2093] },
    { name: "rome", coords: [41.9028, 12.4964] }
  ];
  const weatherDescriptions = {
    "clear sky": "It's a clear sky today!",
    "few clouds": "There are a few clouds in the sky.",
    "scattered clouds": "The sky is scattered with clouds.",
    "broken clouds": "The clouds are broken.",
    "overcast clouds": "The sky is overcast.",
    "shower rain": "Expect some shower rain.",
    "light rain": "There is light rain.",
    "moderate rain": "There is moderate rain.",
    "heavy intensity rain": "There is heavy rain.",
    "very heavy rain": "There is very heavy rain.",
    "extreme rain": "There is extreme rain.",
    "freezing rain": "There is freezing rain.",
    "light intensity shower rain": "There is light shower rain.",
    "shower rain": "There is shower rain.",
    "heavy intensity shower rain": "There is heavy shower rain.",
    "ragged shower rain": "There is ragged shower rain.",
    "rain": "It's raining.",
    "thunderstorm": "There is a thunderstorm.",
    "thunderstorm with light rain": "There is a thunderstorm with light rain.",
    "thunderstorm with rain": "There is a thunderstorm with rain.",
    "thunderstorm with heavy rain": "There is a thunderstorm with heavy rain.",
    "light thunderstorm": "There is a light thunderstorm.",
    "heavy thunderstorm": "There is a heavy thunderstorm.",
    "ragged thunderstorm": "There is a ragged thunderstorm.",
    "thunderstorm with light drizzle": "There is a thunderstorm with light drizzle.",
    "thunderstorm with drizzle": "There is a thunderstorm with drizzle.",
    "thunderstorm with heavy drizzle": "There is a thunderstorm with heavy drizzle.",
    "snow": "It's snowing.",
    "light snow": "There is light snow.",
    "heavy snow": "There is heavy snow.",
    "sleet": "There is sleet.",
    "light shower sleet": "There is light shower sleet.",
    "shower sleet": "There is shower sleet.",
    "light rain and snow": "There is light rain and snow.",
    "rain and snow": "There is rain and snow.",
    "light shower snow": "There is light shower snow.",
    "shower snow": "There is shower snow.",
    "heavy shower snow": "There is heavy shower snow.",
    "mist": "There is mist in the air.",
    "smoke": "There is smoke in the air.",
    "haze": "There is haze in the air.",
    "sand/ dust whirls": "There are sand/dust whirls.",
    "fog": "There is fog.",
    "sand": "There is sand in the air.",
    "dust": "There is dust in the air.",
    "volcanic ash": "There is volcanic ash in the air.",
    "squalls": "There are squalls.",
    "tornado": "There is a tornado."
  };
  function findForecast(city) {
    return new Promise((resolve, reject) => {
      const cityObj = cities.find(c => c.name === city);
      if (!cityObj) {
        reject('City not found');
        return;
      }
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityObj.coords[0]}&lon=${cityObj.coords[1]}&appid=776ce5543cbf678e2cf6d19e83ed7638`;    
      fetch(url)
        .then(response => response.json())
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  function getWeatherDescription(description) {
    return weatherDescriptions[description] || "Weather condition unknown.";
  }
  function getWeather(city) {
    document.getElementById('searchBox').classList.add('single-column');
  
    findForecast(city)
      .then(data => {
        console.log(data);
        const currentWeather = data.list[0]; // Get the first entry for current weather
        const weatherDesc= getWeatherDescription(currentWeather.weather[0].description)
        // Update individual elements instead of using innerHTML
        const date = new Date(currentWeather.dt_txt);
        const options = { month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString(undefined, options);
        const time = currentWeather.dt_txt.split(' ')[1].slice(0, 5); // Extract the time part (HH:MM)

        // Update individual elements instead of using innerHTML
        document.getElementById("selected-date-title").textContent = formattedDate;
        document.getElementById("selected-date-time").textContent = time;
        document.getElementById("city-name").textContent = data.city.name;
        document.getElementById("weather-desc").textContent = `${weatherDesc}`;
        document.getElementById("weather-icon").src = `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;
        document.getElementById("weather-icon").alt = currentWeather.weather[0].description;
        document.getElementById("temp").textContent = (currentWeather.main.temp - 273.15).toFixed(2);
        document.getElementById("feels-like").textContent = (currentWeather.main.feels_like - 273.15).toFixed(2);
        document.getElementById("humidity").textContent = currentWeather.main.humidity;
        document.getElementById("pressure").textContent = currentWeather.main.pressure;
        document.getElementById("wind-speed").textContent = currentWeather.wind.speed;
        document.getElementById("cloudiness").textContent = currentWeather.clouds.all;
       
        // Show the weather info once data is ready
        document.getElementById("forecast-weather").style.display = "block"; 
        const forecastByDate = {};
        data.list.forEach(forecast => {
            const date = forecast.dt_txt.split(' ')[0]; // Extract the date part
            if (!forecastByDate[date]) {
            forecastByDate[date] = [];
            }
            forecastByDate[date].push({
            time: forecast.dt_txt.split(' ')[1], // Extract the time part
            weatherDesc: getWeatherDescription(forecast.weather[0].description),
            icon: forecast.weather[0].icon,
            temp: (forecast.main.temp - 273.15).toFixed(2),
            humidity: forecast.main.humidity,
            windSpeed: forecast.wind.speed
            });
        });

        // Convert the grouped data into an array of arrays
        const forecastArray = Object.keys(forecastByDate).map(date => ({
            date,
            forecasts: forecastByDate[date]
        }));

        console.log(forecastArray);
    
            /* let forecastWeatherInfo = `<h2 class = "text-center">Forecast for ${data.city.name}</h2>`;
            data.list.forEach(forecast => {
            const weatherDesc= getWeatherDescription(forecast.weather[0].description)
            forecastWeatherInfo += `
                <div>
                <p>Date: ${forecast.dt_txt}</p>
                <p>Weather: ${weatherDesc}</p>
                <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}">
                <p>Temperature: ${(forecast.main.temp - 273.15).toFixed(2)}°C</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
                <p>Wind Speed: ${forecast.wind.speed} m/s</p>
                </div>
            `;
            });
            document.getElementById("forecast-weather").innerHTML = forecastWeatherInfo; */
        })
        .catch(error => {
            console.log(error);
            document.getElementById("current-weather").innerHTML = `<p>Error fetching weather data: ${error}</p>`;
            document.getElementById("forecast-weather").innerHTML = `<p>Error fetching forecast data: ${error}</p>`;
        });
  }
  function disablePastTimeButtons() {
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
  
    const timeButtons = document.querySelectorAll('.time-btn');
    timeButtons.forEach(button => {
      const buttonTime = parseInt(button.textContent.split(':')[0], 10);
      if (buttonTime < currentHours) {
        button.disabled = true;
      }
    });
  }
  
  // Call the function to disable past time buttons when the page loads
  document.addEventListener('DOMContentLoaded', disablePastTimeButtons);