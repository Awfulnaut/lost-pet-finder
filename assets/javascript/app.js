var config = {
  apiKey: "AIzaSyDDqeSFBecW0z7ho68WE5ZwcTusl6hVits",
  authDomain: "musician-finder-f0e28.firebaseapp.com",
  databaseURL: "https://musician-finder-f0e28.firebaseio.com",
  projectId: "musician-finder-f0e28",
  storageBucket: "",
  messagingSenderId: "495490109784"
};

firebase.initializeApp(config);
database = firebase.database();

// Declare Maps/forms variables
var latInput = 0;
var longInput = 0;
var mainMap;
var inputMap;
var markerPlaced = false;
var formCompleted = false;

// Declare pet variables
var name;
var phone;
var petName;
var petType;
var petAge;
var petImage;
var description;

// Declare weather variables
var maxTemp;
var minTemp;
var currentTemp;
var weatherMessage;

function initMap() {
  var currentLocation = { lat: 39.953, lng: -75.165 }; // default location: Philadelphia

  // If the user allows current location detection...
  if (navigator.geolocation) {
    // Get current location and reassign the currentLocation var
    navigator.geolocation.getCurrentPosition(function (position) {
      currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Pan both maps to the user's location
      mainMap.panTo(currentLocation);
      inputMap.panTo(currentLocation);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {

    handleLocationError(false, infoWindow, map.getCenter());
  }

  mainMap = new google.maps.Map(
    document.getElementById('main-map'), { zoom: 13, center: currentLocation });
  inputMap = new google.maps.Map(
    document.getElementById('map-input'), { zoom: 17, center: currentLocation });

  var newMarker;

  function placeMarker(location) {

    if (newMarker) {
      // If the marker has already be placed, update the marker's position
      newMarker.setPosition(location);
    } else {
      // If the marker has not been placed, create a new marker
      newMarker = new google.maps.Marker({
        position: location,
        map: inputMap
      });
    }

    // Store the marker's coordinates
    latInput = newMarker.getPosition().lat();
    longInput = newMarker.getPosition().lng();
  }

  // Listen for clicks on the input map that will place a marker
  google.maps.event.addListener(inputMap, 'click', function (event) {
    placeMarker(event.latLng);

    // Update markerPlaced boolean to validate against on submit
    markerPlaced = true;
  });
}

function generateNewPet() {
  // Create an object with all the relevant, formatted data
  var newPet = {
    name: nameFormatted,
    phone: phone,
    petName: petNameFormatted,
    petType: petTypeFormatted,
    petAge: petAgeFormatted,
    petImage: petImage,
    description: descriptionFormatted,
    position: {
      lat: latInput,
      long: longInput
    }
  }

  // Push the pet object to Firebase
  database.ref().push(newPet);
}

function generateWeatherMessage() {
  // Set the weather message depending on the temperature
  if (maxTemp > 85) {
    weatherMessage = "<span class=\"red\">Warning:</span> the max temperature in this area for today is <span class=\"red\">" +
      Math.round(maxTemp) + "&#176;F</span>.";
  } else if (minTemp < 32) {
    weatherMessage = "<span class=\"red\">Warning:</span> The low temperature in this area for today is <span class=\"blue\">" +
      Math.round(minTemp) + "&#176;F</span>.";
  } else {
    weatherMessage = "The current temperature in this area is <span class=\"green\">" + Math.round(currentTemp) + "&#176;F</span>.";
  }
}

$(document).ready(function () {

  function checkFormCompletion() {
    // Store form values
    name = $('#name-input').val().trim();
    phone = $('#phone-input').val().trim();
    petName = $('#pet-name-input').val().trim();
    petType = $('#pet-type-input').val().trim()
    petAge = $('#pet-age-input').val().trim();
    petImage = $('#pet-image-input').val().trim();
    description = $('#description-input').val().trim();

    // If all input fields have been filled out...
    if (name != "" && phone != "" && petName != "" && petType != "" && petAge != "" && petImage != "" && description != "") {
      // Format the user input to prepare it for storage in Firebase
      nameFormatted = name.charAt(0).toUpperCase() + name.substr(1);
      petNameFormatted = petName.charAt(0).toUpperCase() + petName.substr(1);
      petTypeFormatted = petType.charAt(0).toUpperCase() + petType.substr(1);
      petAgeFormatted = petAge.charAt(0).toUpperCase() + petAge.substr(1);
      descriptionFormatted = description.charAt(0).toUpperCase() + description.substr(1);

      // Mark the form as completed
      formCompleted = true;
    }
  }

  // Submit the form
  $("#submit-btn").on("click", function (event) {

    // if no marker was placed, prevent form submission
    if (!markerPlaced) {
      event.preventDefault();
    }

    // Check for form completion
    checkFormCompletion();

    // If an input marker has been placed AND the form is completed, add the data to firebase
    if (markerPlaced && formCompleted) {
      generateNewPet();
    } else {
      // Display the error message if no pin was placed
      $('#error').removeClass("d-none");
    }
  });

  database.ref().on("child_added", function (snapshot) {

    // Grab all relevant data from Firebase
    var childData = snapshot.val();
    var positionLat = childData.position.lat;
    var positionLong = childData.position.long;
    var petPosition = { lat: positionLat, lng: positionLong };
    var ownerName = childData.name;
    var ownerPhone = childData.phone;
    var petName = childData.petName;
    var petAge = childData.petAge;
    var petType = childData.petType;
    var petImage = childData.petImage;
    var petDescription = childData.description;

    // Place a marker based on the object's position
    var marker = new google.maps.Marker({
      position: petPosition,
      map: mainMap,
      animation: google.maps.Animation.DROP,
    });

    // Make the AJAX call to OpenWeather
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?appid=09eea35e73f9bec0e5e5fbc8981164b5&units=imperial" + "&lat=" + positionLat + "&lon=" + positionLong;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      maxTemp = response.main.temp_max;
      minTemp = response.main.temp_min;
      currentTemp = response.main.temp;

      generateWeatherMessage();

      // Generate a DOM node to display the data
      var contentString =
        '<div class="info-window">' +
        '<p class="name">' + petName + ', age ' + petAge + '</p>' +
        '<img src="' + petImage + '">' +
        '<p><strong>Pet Type: </strong><br />' + petType + '</p>' +
        '<p><strong>Description: </strong><br />' + petDescription + '</p>' +
        '<p><strong>Contact: </strong><br />' + 'If found, please contact <strong>' + ownerName + '</strong> at <a href=\"tel:' + ownerPhone + '">' + ownerPhone + '</a>.</p>' +
        '<hr>' +
        '<p class="text-center">' + weatherMessage + '</p>' +
        '</div>';

      // Generate an info window for the pin with the object's DOM node
      var infoWindow = new google.maps.InfoWindow({
        content: contentString,
      });

      // When the marker is clicked, open the info window
      marker.addListener('click', function () {
        infoWindow.open(mainMap, marker);
      });

      // If an infoWindow is open and you click the map, close the previously opened infoWindow
      google.maps.event.addListener(mainMap, 'click', function () {
        infoWindow.close();
      });
    });
  });
});