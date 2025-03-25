let cities = [
    { name: "newyork", coords: [40.7128, -74.0060] },
    { name: "london", coords: [51.5074, -0.1278] },
    { name: "tokyo", coords: [35.6895, 139.6917] },
    { name: "paris", coords: [48.8566, 2.3522] },
    { name: "nuuk", coords: [64.1835, -51.7216] },
    { name: "sanfrancisco", coords: [37.7749, -122.4194] },
    { name: "sydney", coords: [-33.8688, 151.2093] },
    { name: "rome", coords: [41.8933203, 12.4829321] }
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
  
    const infoBox = document.querySelector('.infoBox');
    infoBox.style.backgroundImage = `url('images/${city}2.jpg')`;
    infoBox.style.backgroundSize = 'cover';
    infoBox.style.backgroundPosition = 'center';const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];    
    let cityCache = sessionStorage.getItem(city);
    sessionStorage.setItem("selectedCity", city);
    sessionStorage.setItem("selectedDate", formattedDate);

    if (cityCache) {
        const forecast = JSON.parse(cityCache);
        const currentWeather = forecast[0].forecasts[0];
        setAllDisplay(city,currentWeather,forecast)
    }
    else{
        findForecast(city)
          .then(data => {
            let forecastByDate = {};    
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
                  windSpeed: forecast.wind.speed,
                  feelsLike: (forecast.main.feels_like - 273.15).toFixed(2),
                  pressure: forecast.main.pressure,
                  clouds: forecast.clouds.all
                });
              });
        
              // Convert the grouped data into an array of arrays
              const forecastArray = Object.keys(forecastByDate).map(date => ({
                date,
                forecasts: forecastByDate[date]
              }));
              sessionStorage.setItem(city, JSON.stringify(forecastArray));
              
              const currentWeather = forecastArray[0].forecasts[0];
              const cityName = data.city.name
              setAllDisplay(cityName,currentWeather,forecastArray)
          })
          .catch(error => {
            document.getElementById("current-weather").innerHTML = `<p>Error fetching weather data: ${error}</p>`;
            document.getElementById("forecast-weather").innerHTML = `<p>Error fetching forecast data: ${error}</p>`;
          });
      }
    }
    function setMainDisplay(details){
        const city = sessionStorage.getItem("selectedCity")
        const date = sessionStorage.getItem("selectedDate")
        const newDate = new Date(date);
        formattedDate = newDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        const {weatherDesc, humidity,windSpeed,time,icon,temp,feelsLike,pressure,clouds} = details;
        document.getElementById("selected-date-title").textContent = formattedDate;
        document.getElementById("selected-date-time").textContent = time;
        document.getElementById("weather-desc").textContent = `${weatherDesc}`;
        document.getElementById("weather-icon").src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        document.getElementById("weather-icon").alt = weatherDesc;
        document.getElementById("temp").textContent = temp;
        document.getElementById("feels-like").textContent = feelsLike;
        document.getElementById("humidity").textContent = humidity;
        document.getElementById("pressure").textContent = pressure;
        document.getElementById("wind-speed").textContent = windSpeed;
        document.getElementById("cloudiness").textContent = clouds;
    }
    function setAllDisplay(name,currentWeather, forecastByDate) {
    try {
        setMainDisplay(currentWeather)
        const dateCheck = sessionStorage.getItem("selectedDate")

        // Show the weather info once data is ready
        document.getElementById("forecast-weather").style.display = "block";
        highlightSelectedTime(currentWeather.time)
        // Populate the day buttons with forecast data
        forecastByDate.forEach((day, index) => {
        if (index < 6) { // Ensure we only process up to 6 days
            const dayButton = document.querySelectorAll('.day-btn')[index];
            const noonForecast = day.forecasts.find(forecast => forecast.time === "12:00:00") || day.forecasts[0]; // Find the 12:00 forecast or fallback to the first forecast
            const dayOfWeek = new Date(day.date).toLocaleDateString(undefined, { weekday: 'long' }); // Get the day of the week
            dayButton.innerHTML = `
            <div>${day.date} - ${dayOfWeek}</div>
            <div><img src="http://openweathermap.org/img/wn/${noonForecast.icon}@2x.png" alt="${noonForecast.weatherDesc}"></div>
            <div>${noonForecast.temp}°C</div>
            <div>${noonForecast.weatherDesc}</div>
            `;
            if (day.date === dateCheck) {
                dayButton.classList.add('selected-day');
              } else {
                dayButton.classList.remove('selected-day');
              }
        }
        });
    } catch (error) {
        console.log(error);
        document.getElementById("current-weather").innerHTML = `<p>Error fetching weather data: ${error}</p>`;
        document.getElementById("forecast-weather").innerHTML = `<p>Error fetching forecast data: ${error}</p>`;
    }
    }
    function getForecastTime(time){
        const city = sessionStorage.getItem("selectedCity")
        const date = sessionStorage.getItem("selectedDate")
        const forecast = JSON.parse(sessionStorage.getItem(city))
        const forecastDate = forecast.find(forecast => forecast.date === date)
        const formattedSearchTime = `${String(time * 3).padStart(2, '0')}:00:00`;
        const forecastforTime = forecastDate.forecasts.find(forecast => forecast.time === formattedSearchTime)
        highlightSelectedTime(formattedSearchTime)
        setMainDisplay(forecastforTime)
    }
    function getForecastForDay(day){
        const city = sessionStorage.getItem("selectedCity")
        const forecast = JSON.parse(sessionStorage.getItem(city))
        const selectedDate = forecast[day].date;
        const selectedWeather = forecast[day].forecasts[0]
        sessionStorage.setItem("selectedDate",selectedDate)
        setMainDisplay(selectedWeather)
        highlightSelectedTime(selectedWeather.time)
        document.getElementById("forecast-weather").style.display = "block";
        // Populate the day buttons with forecast data
        forecast.forEach((day, index) => {
        if (index < 6) { // Ensure we only process up to 6 days
            const dayButton = document.querySelectorAll('.day-btn')[index];
            if (day.date === selectedDate) {
                dayButton.classList.add('selected-day');
              } else {
                dayButton.classList.remove('selected-day');
              }
        }
        });
        disablePastTimeButtons()
    }
    function highlightSelectedTime(time) {
        const timeButtons = document.querySelectorAll('.time-btn');
        timeButtons.forEach(button => {
          console.log(button.textContent)
          if (button.textContent + ":00" === time) {
            button.classList.add('selected-time');
          } else {
            button.classList.remove('selected-time');
          }
        });
    }
  function disablePastTimeButtons() {
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const selectedDate = sessionStorage.getItem("selectedDate");
    const timeButtons = document.querySelectorAll('.time-btn');
    if(selectedDate !== currentTime.toISOString().split('T')[0]) {
        timeButtons.forEach(button => {
              button.disabled = false
              ;
    })
    return
    }
    if(currentHours >= 22) {return}
    timeButtons.forEach(button => {
      const buttonTime = parseInt(button.textContent.split(':')[0], 10);
      if (buttonTime < currentHours) {
        button.disabled = true;
      }
    });
  }
  
  // Call the function to disable past time buttons when the page loads
  document.addEventListener('DOMContentLoaded', disablePastTimeButtons);
  
  sessionStorage.setItem("selectedDate", new Date().toISOString().split('T')[0])