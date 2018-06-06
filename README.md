# Mysophobia
---
## [Demo Video](https://youtu.be/TCq2Ajh_fnE)

## What It Is
Mysophobia is an application that allows you to filter out restaurants and hotels that have received health scores lower than you are comfortable patronizing.

## Team Members
* Lisa Dean
* Jalani Paul
* Dan McKinney

## What we used
* Javascript
* Bootstrap
* HTML?CSS
* Code4HR API: ["/inspections", "/vendors", "/lives/", "/bulk/", "/", "/lives-file/<locality>.zip", "/vendor/<vendorid>", "/lives/<locality>", "/bulk/<filename>"]
* jQuery
* API: Google Maps, Google Streetviews, Geocoding, 
* Hutzpah
* Courage
* and
* Tenacity

## App Walkthrough

### Home Screen
Here is the home screen that users arrive at when launching the application
<p align='center'>
    <img src='images.home.png'></img>
</p>

### UI
As the page loads, drop-down lists for zip code and health scores are populated via Javascript and a Google map centered on Atlanta is loaded.

### UX
When the user clicks the submit button, the zip code and health score are used to create an array with the restaurants that are at or below the minimum health score. Then the zip code is used to draw a map centered on the zip code using the Google Maps Javascript API. The array of restaurants is used to populate and display a table of data with name, address and health score and add markers to the map for each restaurant. Each marker has a click event that displays a popup window with the name, address, health score and a streetview image if available. The image is pulled via the Google Streetview API.

The markers are green, yellow or red depending on the restaurant score's relation to the minimum health score. The range from minimum health score to the lowest health score returned in the restaurant array for that zip code was calculated. That range was divided into thirds and the color applied for the section the restaurant fell into. So, if the user chose a minimum score of 90 and the lowest score of the restaurants in that zip code is 60, restaurants from 90 to 80 will have a green marker, restaurants from 79 to 70 will have a yellow marker and ones lower than 70 will have a red marker.


### Transaction
Users are then allowed to enter the lowest health score of an establishment they are willing to patronize
<p align='center'>
    <img src='screenshots/map_view.png'></img>
</p>

### List of "Offenders"
The application returns the results with establishments below their health score standard<p align='center'>
    <img src='screenshots/subcategory.png'></img>
</p>

### Google Map
The user is now allowed to see the establishments on Google Maps easily recognized with their nefarious icon drop pin
<img src='screenshots/subcategory.png'></img>
</p>

## Challenges

### Group
This was our first real group project. We all worked well together and took suggestions from each other extremely proffesionally.
This was the first time though where we had to merge our code with others that created conflicts within the code. We had to make sure that the code was in the correct branch and wasn't deleting anything important.
<br>
<br>
### Lisa

My biggest challenge was determining how to break up the work three ways so everyone had a fair share of work to do and merge conflicts were minimized. Learning to find a git collaboration workflow was another big challenge. I'm not sure we arrived at the best way to handle merging but we managed to not lose any code and completed the project without too many headaches.
<br>
<br>
### Jalani

I was in charge of handling all tasks concerning the front-end components of Mysophobia. Being that this was my first time in charge of design, I was fairly nervous. However, the tools in the bootstrap API helped make the process much more effcient and easy-going. 
<br>
<br>
### Dan
I was tasked with compiling the data and using local API's to gather the information on the different establishment's health scores. As mentioned below; some of the counties website did not lend themselves to scraping for data nor did any available API's exist to perform the task. There were a number of programs to use and most of them involved substantial financial commitments to use for more than the very useless trial period. I used ParseHub's model to scrub the remaining counties for the health score/address/name/zip code. As Lisa mentioned there was also the challenge of delegating tasks porportionately to allow each member to use the skills they have learned and showcase them to potential business relationships.
<br>

### Layout & Positioning
The desktop browser layout was the took some configuring but we are happy with the design. There was a lot of discussion on what to display in the two smaller standard responsive layouts. Did we want to show just the map? Did we want to show just a list? Would you be able to scroll even though it is our experience that on mobile scrolling on a map can be difficult. We ended up with a very pleasant design and layout that works for the UI & UX. 
### GeoLocate
One of the functions we wanted to use was the GeoLocate API that allows the application to find your longitude and latitude based out you physical location. The following code was used to demonstrate the ability to implement this in the future:

```javascript
This function uses the browser's built-in geolocation features
function getCurrentLocation() {
  var position = navigator.geolocation;
  if (position) {
    navigator.geolocation.getCurrentPosition(position => {console.log(position);});
  } else {
    console.log('"Geolocation is not supported by this browser.');
  }
}
``` This function uses Google's Geolocation API
function getGeolocationDataAndDoStuff(stuffToDo) {
  const GEOLOCATION_BASE_URL = 'https://www.googleapis.com/geolocation/v1/geolocate?'
  $.get(GEOLOCATION_BASE_URL, {
        key: GEOLOCATION_API_KEY,
        considerIp: true
    })
    .then(stuffToDo)
    .catch(error => {
      console.log(error);
    });
}```


### Google Places Autocomplete search
Another of the functions of the website that we would like to use if we were to move forward with the application would be auto-complete address with partial data(i.e. 123 Spoo = 123 Spooner St Quahog, RI. Lisa was able to write the code for this but the GeoCode API was not working up to our standards. Below is the code:

```javascript
function getGeocodeDataAndDoStuff(address, stuffToDo, stuffYouNeed=null) {
  $.get(GEO_BASE_URL, {
        address: address,
        key: GEO_API_KEY})
    .then(data => {
      stuffToDo(data, stuffYouNeed);
    })
    .then(data => {
      if (data.results[1]) {createAddressSelectList(data.results);}
      })
    .catch(error => {
      console.log(error);
  });
}```


```javascript
function createAddressSelectList(data) {
  var $asc = $(ADDR_SELECT_CONTAINER);
  var $ul = $('<ul>');
  data.forEach(result => {
    var formattedAddress = result.formatted_address;
    var $li = $('<li>');
    var $a = $('<a>');
    $a.text(formattedAddress);
    $a.attr('href', '#');
    $li.on('click', event => {
      event.preventDefault();
      $asc.text('');
      $(ADDRESS_INPUT).attr('value', formattedAddress);
      someFunctionSimilarToSubmitRequest(formattedAddress)
    });
    $a.appendTo($li);
    $li.appendTo($ul);
  });
  $ul.appendTo($asc);
}
```
</p>

### Future Features

We have a list of features mentioned below that we would implement if we were to comidify the application:
-Include gyms, pools, hotels, etc.
-Include a list of all counties.
-Establish our own server to host the database of information. This would help if we were searching all of the establishments in the country as that amount of data being pulled from another server would lag the system.
-Build our own API that could search for data on any site that displays sanitary conditions possibly even including Diablo's bastard child Yelp.


