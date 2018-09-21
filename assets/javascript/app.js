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
        formCompleted = true;
      }
    }

    checkFormCompletion();

    // If an input marker has been placed AND the form is completed, add the data to firebase
    if (markerPlaced && formCompleted) {

      var newMusician = {
        name: name,
        email: email,
        instrument: instrument,
        experience: experience,
        youtube: youtube,
        description: description,
        position: {
          lat: latInput,
          long: longInput
        }
      }

      database.ref().push(newMusician);
    } else {
      $('#error').removeClass("d-none");
    }
  });

  database.ref().on("child_added", function (snapshot) {
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

    var marker = new google.maps.Marker({
      position: musicianPosition,
      map: mainMap,
      animation: google.maps.Animation.DROP,
    });

    var contentString =
      '<div class="info-window">' +
        '<p class="name">' + musicianName + '</p>' +
        '<p><strong>Email: </strong>' + musicianEmail + '</p>' +
        '<p><strong>Instrument: </strong>' + musicianInstrument + '</p>' +
        '<p><strong>Experience: </strong>' + musicianExp + ' years</p>' +
        '<p><strong>Description: </strong><br />' + musicianDescription + '</p>' +
      '</div>';

    var infoWindow = new google.maps.InfoWindow({
      content: contentString,
    });

    marker.addListener('click', function () {
      infoWindow.open(mainMap, marker);
    });

    markerPlaced = false;
  });
});