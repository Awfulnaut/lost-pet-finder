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

var latInput = 0;
var longInput = 0;
var mainMap;
var markerPlaced = false;
var formCompleted = false;

function initMap() {
  var philly = { lat: 39.953, lng: -75.165 };

  mainMap = new google.maps.Map(
    document.getElementById('main-map'), { zoom: 13, center: philly });
  var inputMap = new google.maps.Map(
    document.getElementById('map-input'), { zoom: 14, center: philly });

  var newMarker;

  function placeMarker(location) {
    if (newMarker) {
      newMarker.setPosition(location);
    } else {
      newMarker = new google.maps.Marker({
        position: location,
        map: inputMap
      });
    }

    latInput = newMarker.getPosition().lat();
    longInput = newMarker.getPosition().lng();
    console.log("newMarker position: " + newMarker.getPosition())
  }

  // Listen for clicks on the input map that will place a marker
  google.maps.event.addListener(inputMap, 'click', function (event) {
    placeMarker(event.latLng);

    // Update markerPlaced boolean to validate against on submit
    markerPlaced = true;
    console.log("markerPlaced = " + markerPlaced);
  });
}

$(document).ready(function () {
  console.log("markerPlaced = " + markerPlaced);

  $("#submit-btn").on("click", function (event) {

    // if no marker was placed, prevent form submission
    if (!markerPlaced) {
      event.preventDefault();
    }

    var name;
    var email;
    var instrument;
    var experience;
    var youtube;
    var description;

    function checkFormCompletion() {
      name = $('#name-input').val().trim();
      email = $('#email-input').val().trim();
      instrument = $('#instrument-input').val().trim();
      experience = $('#experience-input').val().trim();
      youtube = $('#youtube-input').val().trim();
      description = $('#description-input').val().trim();

      //TODO: once youtube is implemented, add a check for its value here
      if (name != "" && email != "" && instrument != "" && experience != "" && youtube != "" && description != "") {
        // Format the user input to prepare it for storage in Firebase
        nameFormatted = name.charAt(0).toUpperCase() + name.substr(1);
        instrumentFormatted = instrument.charAt(0).toUpperCase() + instrument.substr(1);
        experienceFormatted = experience.charAt(0).toUpperCase() + experience.substr(1);
        descriptionFormatted = description.charAt(0).toUpperCase() + description.substr(1);

        // Mark the form as completed
        formCompleted = true;
      }
    }

    checkFormCompletion();

    // If an input marker has been placed AND the form is completed, add the data to firebase
    if (markerPlaced && formCompleted) {

      // Create an object with all the relevant, formatted data
      var newMusician = {
        name: nameFormatted,
        email: email,
        instrument: instrumentFormatted,
        experience: experienceFormatted,
        youtube: youtube,
        description: descriptionFormatted,
        position: {
          lat: latInput,
          long: longInput
        }
      }

      // Push the musician object to Firebase
      database.ref().push(newMusician);
    } else {
      $('#error').removeClass("d-none");
    }
  });

  database.ref().on("child_added", function (snapshot) {

    // Grab all relevant data from Firebase
    var childData = snapshot.val();
    var positionLat = childData.position.lat;
    var positionLong = childData.position.long;
    var musicianPosition = { lat: positionLat, lng: positionLong };
    var musicianName = childData.name;
    var musicianEmail = childData.email;
    var musicianInstrument = childData.instrument;
    var musicianExp = childData.experience;
    var musicianYT = childData.youtube;
    var musicianDescription = childData.description;

    // Place a marker based on the object's position
    var marker = new google.maps.Marker({
      position: musicianPosition,
      map: mainMap,
      animation: google.maps.Animation.DROP,
    });

    // Generate a DOM node to display the data
    var contentString =
      '<div class="info-window">' +
        '<p class="name">' + musicianName + '</p>' +
        '<p><strong>Email: </strong>' + musicianEmail + '</p>' +
        '<p><strong>Instrument: </strong>' + musicianInstrument + '</p>' +
        '<p><strong>Experience: </strong>' + musicianExp + ' years</p>' +
        '<p><strong>Description: </strong><br />' + musicianDescription + '</p>' +
      '</div>';

    // Generate an info window for the pin with the object's DOM node
    var infoWindow = new google.maps.InfoWindow({
      content: contentString,
    });

    // When the marker is clicked, open the info window
    marker.addListener('click', function () {
      infoWindow.open(mainMap, marker);
    });

    // Reset the marker placed flag
    markerPlaced = false;
  });
});