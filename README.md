# Lost Pet Finder
The [Lost Pet Finder](https://awfulnaut.github.io/lost-pet-finder/ "Lost Pet Finder") caters to pet owners who have lost their pets.  Individuals that find an abandoned pet can go to the site and submit their pet’s last known location by placing a pin on the map. Owners post in hopes that others will reach out with good news.

We used two APIs—OpenWeatherMap and Google Maps—to create a dynamic web application. We leveraged Google Maps to display pins with info windows containing the user submitted information, along with the weather information pulled from OpenWeatherMap based on that location.

## APIs and Frameworks
**Google Maps API** - Pins submitted by users are placed on the map to display information about the lost pets.

**Open Weather Map API** - Allows the user to know dangerous conditions that their pet is in based on the location’s weather data.

**Bootstrap 4** - We used Bootstrap to quickly stand up a responsive site displaying a main map with user submitted pins and a form with an input map.

**JQuery** - JQuery was used to handle click events, dynamic behavior, and form value collection.

**Firebase Real-Time Database** - Firebase is used to store user input and then referenced to display information to all users.

**GitHub Pages** - Our app was deployed using Github Pages (visible [here](https://awfulnaut.github.io/lost-pet-finder/ "Lost Pet Finder"))

## Leveraging Google Maps
- Both maps are initialized and automatically detect and pan to your current location
- The main map drops pins with information on all previously submitted lost pets
- The form validates inputs, including the detection of a dropped pin, in order to submit
- Data is passed to Firebase and then pulled into the main map

## Google Maps + Open Weather Map AJAX Calls
- Latitude and longitude data is provided by the user through Google Maps, and then passed through the Open Weather Map API to obtain location specific weather data
- Once the data is obtained, we display the temperature in the info window of that pin, along with a warning if the pet is in extreme conditions

## Future Ideas
- Faster pet location by utilizing a sidebar to displays the first ~5 images from each visible pins on the map, which would link directly to the associated pin
- Create user accounts so that people who post a lost pet can edit and remove their listings
- A feed that displays the most recent lost pets
- Integration with  microchip IDs for real-time tracking

---

For more information, contact Cadin McQueen at cadin.mcqueen@gmail.com.