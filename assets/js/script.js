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

  var dogSizeSelect = document.getElementById('dogSize');
  var dogSize = dogSizeSelect.options[dogSizeSelect.selectedIndex].text;

  localStorage.setItem('zipCode', zipCode);
  localStorage.setItem('dogSize', dogSize);

  //Redirect 
  setTimeout(function () {
    window.location.href = 'result.html';
  }, 1000);
}

//Here starts the javascript for result.html

//pull dog breeds from api and adds image when selected
fetch("https://dog.ceo/api/breeds/list/all")
  .then(response => response.json())
  .then(data => {
    const breedDropdown = document.getElementById("breed-dropdown");
    const breeds = data.message;
    const breedList = Object.keys(breeds);

    breedList.forEach(breed => {
      const option = document.createElement("option");
      option.value = breed;
      option.textContent = breed;
      breedDropdown.appendChild(option);
    });
  })
  .catch(error => {
    console.log("Error:", error);
  });

const breedDropdown = document.getElementById("breed-dropdown");


breedDropdown.addEventListener("change", () => {
  const selectedBreed = breedDropdown.value;


  fetch(`https://dog.ceo/api/breed/${selectedBreed}/images/random`)
    .then(response => response.json())
    .then(data => {
      const imageUrl = data.message;

      const dogImage = document.getElementById("dog-image");
      dogImage.src = imageUrl;
      dogImage.alt = selectedBreed;
    })
    .catch(error => {
      console.log("Error:", error);
    });
});

//fetch weather based on zipcode from local storage
function zipCodefromLocal() {
  var zipCode = localStorage.getItem('zipCode');
  var dogSize = localStorage.getItem('dogSize');
  if (zipCode && dogSize) {
    searchWeather(zipCode);
    searchDogParks(zipCode, dogSize);
  }
}


//pull weather based on zipcode
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
  const temperatureKelvin = data.main.temp;
  const temperatureFahrenheit = ((temperatureKelvin - 273.15) * (9/5) + 32).toFixed(2);
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const icon = data.weather[0].icon;

  document.getElementById('city-name').textContent = city;
  document.getElementById('temperature').textContent = `Temperature: ${temperatureFahrenheit} °F`;
  document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
  document.getElementById('wind-speed').textContent = `Wind Speed: ${windSpeed} m/s`;
  document.getElementById('weather-icon').innerHTML = `<img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">`;
}

//load dog parks based on zipcode
function searchDogParks(zipCode, dogSize) {
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


      switch (dogSize) {
        case 'Small, we can walk to the nearest park within 1-3 miles of us.':
          var request = {
            location: new google.maps.LatLng(lat, lng),
            radius: '4828.03', //3 miles in meters
            type: 'park',
            keyword: 'dog park',
          };
          break;
        case 'Medium to Large, we can walk to the nearest park within 3-5 miles of us.':
          var request = {
            location: new google.maps.LatLng(lat, lng),
            radius: '8046.72', //5 miles in meters
            type: 'park',
            keyword: 'dog park',
          };
          break;
        case 'We love a good car ride. Show us the nearest park within 10 miles.':
          var request = {
            location: new google.maps.LatLng(lat, lng),
            radius: '32186.9', //10 miles in meters
            type: 'park',
            keyword: 'dog park',
          };
          break;
        default:
          var request = {
            location: new google.maps.LatLng(lat, lng),
            radius: '32186.9', // 20 miles in meters
            type: 'park',
            keyword: 'dog park',
          };
          break;
      }
      service.nearbySearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
        
          //limit search results to 4
          var limitedResults = results.slice(0, 4);
          limitedResults.forEach(function (place) {
            createPhotoMarker(place);
            getParkDetails(place.place_id);
          });

          document.getElementById('map').setAttribute("class", "map")
        } else if(status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          //display message for 0 results
          var messageElement = document.createElement('p');
          messageElement.textContent = "ZERO RESULTS! Please try your search again.";
          var parkElement = document.getElementsByClassName('park')[0];
          parkElement.appendChild(messageElement);
          return;
        }else {
          console.log('Error: ', status);
        }
      });
    } else {
      console.log('Geocode was not successful for the following reason', status);
    }
  });
}
function getParkDetails(placeId) {
  var request = {
    placeId: placeId,
    fields: ['name', 'photos', 'formatted_address', 'url']
  };

  service.getDetails(request, function (place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      var photo = place.photos[0];
      var photoUrl = photo.getUrl();
      addParkToList(place, photoUrl);
    }
  })
}

function addParkToList(place, photoUrl) {
  var parkList = document.getElementById('park-card');


  var parkCard = document.createElement('li');
  parkCard.classList.add('park-card');

  var parkName = document.createElement('h3');
  parkName.textContent = place.name;
  parkName.style.textAlign = 'center';


  var parkAddress = document.createElement('p');
  parkAddress.textContent = place.formatted_address;

  var parkWebsite = document.createElement('p');
  parkWebsite.innerHTML = place.url ? '<a href="' + place.url + '" target="_blank">Visit Website</a>' : 'Website not available';

  var photoWrapper = document.createElement('div');
  photoWrapper.style.display = "flex";
  photoWrapper.style['justify-content'] = 'center';
  photoWrapper.style.marginBottom = '10px';


  var parkPhoto = document.createElement('img');
  parkPhoto.src = photoUrl;
  parkPhoto.alt = place.name;
  parkPhoto.style.width = '200px';
  parkPhoto.style.height = '150px';

  photoWrapper.appendChild(parkPhoto);

  parkCard.appendChild(parkName);
  parkCard.appendChild(photoWrapper);
  parkCard.appendChild(parkAddress);
  parkCard.appendChild(parkWebsite);

  parkList.appendChild(parkCard);
}

function initMap() {
  var options = {
    zoom: 10,
    center: { lat: 29.4252, lng: -98.4946 }
  }

  map = new google.maps.Map(document.getElementById("map"), options);

  var marker = new google.maps.Marker({
    position: { lat: 29.4260, lng: -98.4861 }, map: map,

  });

  map = new google.maps.Map(document.getElementById("map"), options);



  const request = {
    query: "pet park",
    fields: ["name", "geometry", "photo", "formatted_address"],
  };

  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (let i = 0; i < results.length; i++) {

        createPhotoMarker(results[i]);
      }

      map.setCenter(results[0].geometry.location);
    }
  });

  zipCodefromLocal();
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
    icon: photos[0].getUrl({ maxWidth: 50, maxHeight: 50 })
  });
}

function codeAddress() {
  var loc;
  var address = document.getElementById('search-city').value;
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'address': address }, function (results, status) {
    if (status == 'OK') {
      loc = results[0].geometry.location;
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });

      const request = {

        location: loc,
        radius: '10000',
        fields: ["name", "geometry", "photo", "opening_hours", "formatted_address"],
        type: 'Park',
        keyword: 'dog park',
      };
      service = "";
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, (parkresults, parkstatus) => {
        if (parkstatus === google.maps.places.PlacesServiceStatus.OK && parkresults) {
          for (let i = 0; i < parkresults.length; i++) {
            createPhotoMarker(parkresults[i]);
          }

          map.setCenter(results[0].geometry.location);
        }
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
  document.getElementById('map').setAttribute("class", "map")
}



