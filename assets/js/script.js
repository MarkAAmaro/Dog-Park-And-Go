const apiKey = '599e78c3459a8c73ce2b3faeb84e514d';


function saveZipCode(event) {
  event.preventDefault();
  var zipCodeInput = document.getElementById('zipCode');
  var zipCode = zipCodeInput.value;

  localStorage.setItem('zipCode', zipCode);

  //Redirect to indexhtml page
  window.location.href = 'index.html';
}

document.getElementById('weather-btn').addEventListener('click', function() {
    const cityInput = document.getElementById('city-input').value;
    searchWeather(cityInput);
  });

document.getElementById('search-btn').addEventListener('click', function() {
  const cityInput = document.getElementById('city-input').value;
  searchWeather(cityInput);
});


function searchWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

function displayCurrentWeather(data) {
  const city = data.name;
  const temperature = data.main.temp;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const icon = data.weather[0].icon;

  document.getElementById('city-name').textContent = city;
  document.getElementById('temperature').textContent = `Temperature: ${temperature} K`;
  document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
  document.getElementById('wind-speed').textContent = `Wind Speed: ${windSpeed} m/s`;
  document.getElementById('weather-icon').innerHTML = `<img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">`;
}

function initMap() {
    var options = {
        zoom:8,
        center:{lat:29.4252,lng:-98.4946}
    }

    var map = new google.maps.Map(document.getElementById("map"), options);

    var marker = new google.maps.Marker({
        position:{lat:29.4260,lng:-98.4861},map:map
    //    icon: image
    });
}


initMap();