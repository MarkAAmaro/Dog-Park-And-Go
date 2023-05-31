const apiKey = '599e78c3459a8c73ce2b3faeb84e514d';
var dogPark = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants%20in%20Sydney&key=YOUR_API_KEY";
var searchByPlace = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=%park&inputtype=textquery&key=AIzaSyAY6NmG73gJVoMm3w6-YvnWcN8-8_mELAM";
var sanAntonioPlaceId = "ChIJrw7QBK9YXIYRvBagEDvhVgg";
var map = "";
var service;

function saveZipCode(event) {
  event.preventDefault();
  var zipCodeInput = document.getElementById('zipCode');
  var zipCode = zipCodeInput.value;

  localStorage.setItem('zipCode', zipCode);

  //Redirect to indexhtml page
  window.location.href = 'index.html';
}

/* document.getElementById('weather-btn').addEventListener('click', function() {
    const cityInput = document.getElementById("city-input").value;
    *searchWeather(cityInput); 
  }); */

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
        zoom:15,
        center:{lat:29.4252,lng:-98.4946}
    }

    map = new google.maps.Map(document.getElementById("map"), options);

    /*var marker = new google.maps.Marker({
        position:{lat:29.4260,lng:-98.4861},map:map
    //    icon: image
    }); */

    const request = {
      
      
      query: "pet park",
      fields: ["name", "geometry", "photo", "opening_hours", "formatted_address"],
    };
  
    service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          /* createMarker(results[i]); */
          createPhotoMarker(results[i]);
        }
  
        map.setCenter(results[0].geometry.location);
      }
    });
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });
  marker.setMap(map);
  /*google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  }); */
}

function createPhotoMarker(place) {
  var photos = place.photos;
  if (!photos) {
    return;
  }

  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    title: place.name,
    icon: photos[0].getUrl({maxWidth: 50, maxHeight: 50})
  });
}
/* findPlace(); */

document.getElementById('park-btn').addEventListener('click', function() {
  codeAddress(); 
}); 

function codeAddress() {
  var loc;
  var address = document.getElementById('search-city').value;
  var geocoder= new google.maps.Geocoder();
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == 'OK') {
      loc = results[0].geometry.location;
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });

       const request = {
      
        location: loc,
        radius: '100',
        fields: ["name", "geometry", "photo", "opening_hours", "formatted_address"],
        type : ['Park'],
      };
      service = "";
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, (parkresults, parkstatus) => {
        if (parkstatus === google.maps.places.PlacesServiceStatus.OK && parkresults) {
          for (let i = 0; i < parkresults.length; i++) {
            /* createMarker(results[i]); */
            createPhotoMarker(parkresults[i]);
          }
    
          map.setCenter(results[0].geometry.location);
        }
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });

  
}
