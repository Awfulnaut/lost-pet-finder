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


function initMap() {

  var philly = { lat: 39.953, lng: -75.165 };

  mainMap = new google.maps.Map(
    document.getElementById('main-map'), { zoom: 13, center: philly });
  var map2 = new google.maps.Map(
    document.getElementById('map-input'), { zoom: 14, center: philly });






  var placemarker;
  var markerPlaced = false;

  function placeMarker(location) {
    if (placemarker) {
      placemarker.setPosition(location);
    } else {
      placemarker = new google.maps.Marker({
        position: location,
        map: map2
      });
    }

    latInput = placemarker.getPosition().lat();
    longInput = placemarker.getPosition().lng();
    console.log("Latitude: " + latInput + " | Longitute: " + longInput)
  }


  google.maps.event.addListener(map2, 'click', function (event) {
    placeMarker(event.latLng);
  });
}

$(document).ready(function () {
  $("#submit-btn").on("click", function (event) {
    event.preventDefault();

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

    $('#name-input').val("")
    $('#email-input').val("")
    $('#instrument-input').val("")
    $('#experience-input').val("")
    $('#youtube-input').val("")
    $('#description-input').val("")
  });

  database.ref().on("child_added", function (childSnapshot) {
    var childData = childSnapshot.val();
    var testLat = childData.position.lat;
    var testLong = childData.position.long;
    var testposition = { lat: testLat, lng: testLong };
    var musicianName = childData.name;
    var musicianEmail = childData.email;
    var musicianInstrument = childData.instrument;
    var musicianExp = childData.experience;
    var musicianYT = childData.youtube;
    var musicianDescription = childData.description;

    var marker = new google.maps.Marker({
      position: testposition,
      map: mainMap,
      animation: google.maps.Animation.DROP,
    });
    // var $musicianProfile = $("<div class = \"info-window\">");
    // $musicianProfile.append(
    //   $("<p>").text(childData.name)
    // )
    var contentString =
      '<div class="info-window">' +
        '<p class="name">' + musicianName + '</p>' +
        '<p>Email: ' + musicianEmail + '</p>' +
        '<p>Instrument: ' + musicianInstrument + '</p>' +
        '<p>Experience: ' + musicianExp + '</p>' +
        '<p>Description: ' + musicianDescription + '</p>' +
      '</div>';


    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      
    });
    console.log(musicianName);

    marker.addListener('click', function () {
      infowindow.open(mainMap, marker);
    });




  });




});
