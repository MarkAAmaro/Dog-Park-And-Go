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

  getDogBreeds();
  //Redirect 
  setTimeout(function () {
    window.location.href = 'result.html';
  }, 1000);
}

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





