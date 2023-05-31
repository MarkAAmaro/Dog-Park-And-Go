//weather API
const apiKey = '599e78c3459a8c73ce2b3faeb84e514d';
var map;
var parsezip;

//save zip code to local storage
document.querySelector('main').addEventListener('click', function (event) {
  // Check if the event target is the go-button
  if (event.target.matches('#go-button')) {
    event.preventDefault();
    saveZipCode(event);
  }
});

function saveZipCode(event) {

  var zipCodeInput = document.getElementById('zipCode');
  var zipCode = zipCodeInput.value;
  parsezip = zipCodeInput.value;
  localStorage.setItem('zipCode', zipCode);

  getDogBreeds();
  //Redirect 
  setTimeout(function () {
    window.location.href = 'result.html';
  }, 1000);
}

/* document.getElementById('weather-btn').addEventListener('click', function() {
    const cityInput = document.getElementById("city-input").value;
    *searchWeather(cityInput); 
  }); */

//still need to display breeds based on userinput of small or medium
function getDogBreeds() {
  //dog API
  var dogAPIkey = 'live_ORSd6zMzFxD9kAyCD7rK2W1Q0tTLMbHWIVySWzaGXwFu0PoO8NnVxQQ4xpeDRGUX';

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("x-api-key", dogAPIkey);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("https://api.thedogapi.com/v1/breeds?limit=10&page=0", requestOptions)
    .then(response => response.text())
    .then(result => displayDogBreeds(result))
    .catch(error => console.log('error', error));
}

function displayDogBreeds(breeds) {
  var breedsSection = document.getElementById('dogBreeds-section');
  breedsSection.innerHTML = " ";

  for (var i = 0; i < breeds.length; i++) {
    var breed = breeds[i];
    var breedName = breed.name;

    var breedElement = document.createElement('p');
    breedElement.textContent = breedName;
    breedsSection.appendChild(breedElement);
  }
}


//fetch weather based on zipcode from local storage
function zipCodefromLocal() {
  var zipCode = localStorage.getItem('zipCode');
  if (zipCode) {
    searchWeather(zipCode);
    searchDogParks(zipCode);
  }
}
//pull weather based on zipcode
//copied Mark's code but will need to change code in html
function searchWeather(zipCode) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}`)
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

//function initMap() {
//    var options = {
//        zoom:15,
//        center:{lat:29.4252,lng:-98.4946}
//window.addEventListener('load', zipCodefromLocal);

//load dog parks based on zipcode
function searchDogParks(zipCode) {
  var geocoder = new google.maps.Geocoder();
  var address = zipCode;

  geocoder.geocode({ address }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      var location = results[0].geometry.location;
      var lat = location.lat();
      var lng = location.lng();

      map.setCenter(results[0].geometry.location);
      //places API
      var service = new google.maps.places.PlacesService(document.createElement('div'));
      var request = {
        location: new google.maps.LatLng(lat, lng),
        radius: '32186.9',  //within 20 miles can changes later
        type: 'park',
        keyword: 'dog park',
      };

      service.nearbySearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          results.forEach(function (place) {
            //console.log(place.name);
            //console.log(place.vicinity);
            createPhotoMarker(place);
          });
          document.getElementById('map').setAttribute("class", "map")
        } else {
          console.log('Error: ', status);
        }
      });
    } else {
      console.log('Geocode was not successful for the following reason', status);
    }
  });
}

//function initMap() {
//    var options = {
//      zoom: 12,
//      center: { lat: 29.4252, lng: -98.4946 }
//    }

//    map = new google.maps.Map(document.getElementById("map"), options);

//    var marker = new google.maps.Marker({
//      position: { lat: 29.4260, lng: -98.4861 }, map: map,
      //icon: image
//    });

//    map = new google.maps.Map(document.getElementById("map"), options);

    /*var marker = new google.maps.Marker({
        position:{lat:29.4260,lng:-98.4861},map:map
    //    icon: image
    }); */

//    const request = {
//      query: "pet park",
//      fields: ["name", "geometry", "photo", "opening_hours", "formatted_address"],
//    };

//    service = new google.maps.places.PlacesService(map);
//    service.findPlaceFromQuery(request, (results, status) => {
//      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
//        for (let i = 0; i < results.length; i++) {
          /* createMarker(results[i]); */
//          createPhotoMarker(results[i]);
//        }

//        map.setCenter(results[0].geometry.location);
//      }
//    });
//}

//function createMarker(place) {
//    if (!place.geometry || !place.geometry.location) return;

//    const marker = new google.maps.Marker({
//      map,
//      position: place.geometry.location,
//    });
//    marker.setMap(map);
    /*google.maps.event.addListener(marker, "click", () => {
      infowindow.setContent(place.name || "");
      infowindow.open(map);
    }); */
//}
//initMap();

//function createPhotoMarker(place) {
//    var photos = place.photos;
//    if (!photos) {
//      return;
//    }

//    var marker = new google.maps.Marker({
//      map: map,
//      position: place.geometry.location,
//      title: place.name,
//      icon: photos[0].getUrl({maxWidth: 50, maxHeight: 50})
//    });
//}
/* findPlace(); */

//document.getElementById('park-btn').addEventListener('click', function() {
//  codeAddress(); 
//}); 

//function codeAddress() {
//    var loc;
//    var address = document.getElementById('search-city').value;
//    var geocoder= new google.maps.Geocoder();
//    geocoder.geocode( { 'address': address}, function(results, status) {
//      if (status == 'OK') {
//        loc = results[0].geometry.location;
//        map.setCenter(results[0].geometry.location);
//        var marker = new google.maps.Marker({
//            map: map,
//            position: results[0].geometry.location
//        });

//        const request = {
      
//          location: loc,
//          radius: '10000',
//          fields: ["name", "geometry", "photo", "opening_hours", "formatted_address"],
//          type : 'Park',
//          keyword: 'dog park',
//        };
//        service = "";
//        service = new google.maps.places.PlacesService(map);
//        service.nearbySearch(request, (parkresults, parkstatus) => {
//          if (parkstatus === google.maps.places.PlacesServiceStatus.OK && parkresults) {
//            for (let i = 0; i < parkresults.length; i++) {
              /* createMarker(results[i]); */
//              createPhotoMarker(parkresults[i]);
//            }
      
//            map.setCenter(results[0].geometry.location);
//          }
//        });
//      } else {
//        alert('Geocode was not successful for the following reason: ' + status);
//      }
//    });
//    document.getElementById('map').setAttribute("class", "map")
//}

//document.getElementById('search-btn').addEventListener('click', function() {
//  const cityInput = document.getElementById('city-input').value;
//  searchWeather(cityInput); 
//}); 

//document.getElementById('park-details-btn').addEventListener('click', function() {
//  const cityInput = document.getElementById('city-input').value;
//  searchDogParks(cityInput); 
//}); 
