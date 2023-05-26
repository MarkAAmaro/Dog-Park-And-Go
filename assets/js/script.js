// Setting API for weather
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

  function searchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

function displayCurrentWeather(data) {
const city = data.city.name;
  const date = data.list[0].dt_txt;
  const temperature = data.list[0].main.temp;
  const humidity = data.list[0].main.humidity;
  const windSpeed = data.list[0].wind.speed;
  const icon = data.list[0].weather[0].icon;
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