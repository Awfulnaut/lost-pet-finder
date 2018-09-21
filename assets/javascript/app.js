// Google maps API key: AIzaSyC6GnZhTZ8RV_-JINWYAo0e2KDJQQoz7h0

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

function initMap() {

  var philly = { lat: 39.953, lng: -75.165 };

  mainMap = new google.maps.Map(
    document.getElementById('main-map'), { zoom: 13, center: philly });
  var inputMap = new google.maps.Map(
    document.getElementById('map-input'), { zoom: 14, center: philly });

  var placemarker;

  function placeMarker(location) {
    if (placemarker) {
      placemarker.setPosition(location);
    } else {
      placemarker = new google.maps.Marker({
        position: location,
        map: inputMap
      });
    }

    latInput = placemarker.getPosition().lat();
    longInput = placemarker.getPosition().lng();
  }


  google.maps.event.addListener(inputMap, 'click', function (event) {
    placeMarker(event.latLng);
  });
}

$(document).ready(function () {
  $('#input-map').on('click', function() {
    markerPlaced = true;
  })

  $("#submit-btn").on("click", function (event) {

    var name = $('#name-input').val().trim();
    var email = $('#email-input').val().trim();
    var instrument = $('#instrument-input').val().trim();
    var experience = $('#experience-input').val().trim();
    var youtube = $('#youtube-input').val().trim();
    var description = $('#description-input').val().trim();

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
  });

  database.ref().on("child_added", function (childSnapshot) {
    var childData = childSnapshot.val();
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
        '<p>Email: ' + musicianEmail + '</p>' +
        '<p>Instrument: ' + musicianInstrument + '</p>' +
        '<p>Experience: ' + musicianExp + ' years</p>' +
        '<p>Description: ' + musicianDescription + '</p>' +
      '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString,
    });

    marker.addListener('click', function () {
      infowindow.open(mainMap, marker);
    });

    markerPlaced = false;
  });
});