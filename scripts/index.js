var map;

function createAddressSelectList(data) {
  var $asc = $(ADDR_SELECT_CONTAINER);
  var $ul = $('<ul>');
  data.forEach(result => {
    var formattedAddress = result.formatted_address;
    // console.log(formattedAddress);
    var $li = $('<li>');
    var $a = $('<a>');
    $a.text(formattedAddress);
    $a.attr('href', '#');
    $li.on('click', event => {
      event.preventDefault();
      $asc.text('');
      $(ADDRESS_INPUT).attr('value', formattedAddress);
      getCoordinates(formattedAddress)
    });
    $a.appendTo($li);
    $li.appendTo($ul);
  });
  $ul.appendTo($asc);
}

function getGeocodeDataAndDoShit(address, shitToDo) {
  $.get(GEO_BASE_URL, {
        address: address,
        key: GEO_API_KEY})
    .then(shitToDo)
  // .then(data => {
  //   if (data.results[1]) {
  //     createAddressSelectList(data.results);
  //   };
  //   var location = data.results[0].geometry.location
  //   stuffToDo(location.lat, location.lng);
  //   })
  .catch(error => {
    console.log(error);
  })
  ;
}

function getCurrentLocation() {
  var position = navigator.geolocation;
  if (position) {
    navigator.geolocation.getCurrentPosition(position => {console.log(position);});
  } else {
    console.log('"Geolocation is not supported by this browser.');
  }
}

function getGeolocationDataAndDoShit(shitToDo) {
  $.get(GEOLOCATION_BASE_URL, {
        key: GEOLOCATION_API_KEY,
        considerIp: true
    })
    .then(shitToDo)
    .catch(error => {
      console.log(error);
    });
}

function initMap(latValue=33.7676338,lngValue=-84.5606888) {
  var startingZipCode = '30305';
  getGeocodeDataAndDoShit(startingZipCode, drawMap);
}

function drawMap(data) {
  var latValue = data.results[0].geometry.location.lat;
  var lngValue = data.results[0].geometry.location.lng;
  var mapDiv = document.querySelector(MAP_CONTAINER);
  map = new google.maps.Map(
    mapDiv,
    {
      center:
      {
        lat: latValue,
        lng: lngValue
      },
      zoom: 8
      ,styles: mapStyle
    }
  );
  var sw = data.results[0].geometry.bounds.southwest;
  var ne = data.results[0].geometry.bounds.northeast;
  map.fitBounds(new google.maps.LatLngBounds(sw, ne));
}

function setMapMarker(data) {
  var latValue = data.results[0].geometry.location.lat;
  var lngValue = data.results[0].geometry.location.lng;
  // var score = 
  var marker = new google.maps.Marker(
    {
      position: {
        lat: latValue,
        lng: lngValue
      },
      map: map
      // ,icon: {
      //   url: 'favicon-96x96.png',
      //   scaledSize: new google.maps.Size(iconDimension, iconDimension)
      // }
      ,icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
      ,animation: google.maps.Animation.DROP
    });
}

function updateOffenderResults(restaurantArray) {
  var $table = $(OFFENDER_TABLE);
  $table.empty();
  var $tr1 = $('<tr>');
  var $th1 = $('<th>').addClass(RESTAURANT_CLASS).text('Restaurant').appendTo($tr1);
  var $th2 = $('<th>').addClass(ADDRESS_CLASS).text('Address').appendTo($tr1);
  var $th3 = $('<th>').addClass(SCORE_CLASS).text('Score').appendTo($tr1);
  $tr1.appendTo($table);

  restaurantArray.forEach(restaurant => {
    var $tr = $('<tr>');
    var $td1 = $('<td>');
    var $a = $('<a>').text(restaurant.name).attr('href', '#').appendTo($td1);
    $td1.appendTo($tr);
    var $td2 = $('<td>').text(restaurant.address).appendTo($tr);
    var $td3 = $('<td>').text(restaurant.score).appendTo($tr);
    $tr.appendTo($table);

    getGeocodeDataAndDoShit(restaurant.address, setMapMarker);
  });
}

function getOffenders(zipCode, minScore) {
  var results = [];
  counties.forEach(restaurant => {
    if (parseInt(restaurant.score) <= minScore && getZipCode(restaurant.address) === zipCode) {
      results.push(restaurant);
    }
  });
  return results;
}

function getZipCode(addressString) {
  var result = null;
  var regex = /\d{5}$/;
  try {
    result = regex.exec(addressString)[0]
  }
  catch(error) {
    console.error('Zip code not found');
  }
  return result;
}

function populateHealthScore() {
  var $selectElement = $(HEALTH_SCORE);
  for (let index = 100; index > 0; index--) {
    var options = $("<option>");
    options.text(index)
    options.appendTo($selectElement);
  }
}

function submitRequest(event) {
  event.preventDefault();
  var zipCode = document.querySelector(ADDRESS_INPUT).value;
  var minScore = document.querySelector(MIN_SCORE).value;
  if (zipCode) {
    var results = getOffenders(zipCode, minScore);
    getGeocodeDataAndDoShit(zipCode, drawMap);
    updateOffenderResults(results);
  }
}

function main() {
  document.querySelector(SUBMIT).addEventListener('click', submitRequest);
  populateHealthScore();
}

main();