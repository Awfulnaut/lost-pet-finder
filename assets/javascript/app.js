// Google maps API key: AIzaSyC6GnZhTZ8RV_-JINWYAo0e2KDJQQoz7h0

var config = {
  apiKey: "AIzaSyBJUt98o2qHuICn_Ab3av5kXrG0N1lrL_4",
  authDomain: "pet-finder-6e201.firebaseapp.com",
  databaseURL: "https://pet-finder-6e201.firebaseio.com",
  projectId: "pet-finder-6e201",
  storageBucket: "",
  messagingSenderId: "434407968868"
};

firebase.initializeApp(config);

database = firebase.database();


function initMap() {

    var philly = { lat: 39.953, lng: -75.165 };

    var map = new google.maps.Map(
        document.getElementById('main-map'), { zoom: 13, center: philly });
    var map2 = new google.maps.Map(
        document.getElementById('map-input'), { zoom: 13, center: philly });

    var contentString = "<p>Test</p>"

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var marker = new google.maps.Marker({
        position: philly,
        map: map2,

    

    });
    var marker2 = new google.maps.Marker({
      position: { lat: 39.983, lng: -75.165 },
      map: map2,

    });
    marker2.addListener('click', function () {
        infowindow.open(map2, marker2);
    });
}
