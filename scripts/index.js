const TESTING = true;
var map;
var resultsMinScore;

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

function getGeocodeDataAndDoShit(address, shitToDo, shitYouNeed=null) {
  $.get(GEO_BASE_URL, {
        address: address,
        key: GEO_API_KEY})
    .then(data => {
      shitToDo(data, shitYouNeed);
    })
  // .then(data => {
  //   if (data.results[1]) {createAddressSelectList(data.results);}
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

function setMapMarker(data, restaurantData) {
  var latValue = data.results[0].geometry.location.lat;
  var lngValue = data.results[0].geometry.location.lng;
  var score = restaurantData.score;
  var minScore = $(MIN_SCORE).val();
  var scoreRange = minScore - resultsMinScore;
  console.log('s: ' + score + ' m: ' + minScore + ' r: ' + scoreRange);
  // icons from https://sites.google.com/site/gmapsdevelopment/
  var iconFile;
  // if (score > scoreRange / 3 * 2) {
  //   iconFile = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
  //   console.log('green');
  // } else if (score > scoreRange / 3 * 1) {
  //   iconFile = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
  //   console.log('yellow');
  // } else {
  //   iconFile = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
  //   console.log('red');
  // }
  if (score > scoreRange / 3 * 2) {
    iconFile = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    console.log('green');
  } else if (score > scoreRange / 3 * 1) {
    iconFile = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    console.log('yellow');
  } else {
    iconFile = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    console.log('red');
  }
  console.log(restaurantData.name + ": " + restaurantData.score + ", " + iconFile);
  var marker = new google.maps.Marker(
    {
      position: {
        lat: latValue,
        lng: lngValue
      },
      map: map,
      icon: iconFile,
      animation: google.maps.Animation.DROP
    });
}

function updateOffenderResults(restaurantArray) {
  var $table = $(OFFENDER_TABLE);
  $table.empty();
  var $tr1 = $('<tr>');
  var $th1 = $('<th>').addClass('col-md-3').text('Restaurant').appendTo($tr1);
  var $th2 = $('<th>').addClass('text-center').text('Address').appendTo($tr1);
  var $th3 = $('<th>').addClass('text-center').text('Score').appendTo($tr1);
  $tr1.appendTo($table);

  restaurantArray.forEach(restaurant => {
    var $tr = $('<tr>');
    // var $td1 = $('<td>');
    // var $a = $('<a>').text(restaurant.name).attr('href', '#').appendTo($td1);
    // $td1.appendTo($tr);
    var $td1 = $('<td>').text(restaurant.name).appendTo($tr);
    var $td2 = $('<td>').text(restaurant.address).appendTo($tr);
    var $td3 = $('<td>').text(restaurant.score).appendTo($tr);
    $tr.appendTo($table);
    getGeocodeDataAndDoShit(restaurant.address, setMapMarker, restaurant);
  });
}

function getOffenders(zipCode, minScore) {
  var results = [];
  resultsMinScore = 100;
  counties.forEach(restaurant => {
    var score = parseInt(restaurant.score);
    if (score <= minScore && getZipCode(restaurant.address) === zipCode) {
      results.push(restaurant);
      if (score < resultsMinScore) {
        resultsMinScore = score;
      }
    }
  });
  results.sort((a, b) => {return a.score - b.score});
  return results;
}

function getZipCode(addressString) {
  var result = null;
  var regex = /\d{5}$/;
  try {
    result = regex.exec(addressString)[0]
  }
  catch(error) {
    // console.error('Zip code not found');
  }
  return result;
}

function submitRequest(event) {
  event.preventDefault();
  var zipCode = $(ADDRESS_INPUT).val();
  var minScore = $(MIN_SCORE).val();
  if (zipCode && minScore) {
    var results = getOffenders(zipCode, minScore);
    getGeocodeDataAndDoShit(zipCode, drawMap);
    updateOffenderResults(results);
  }
}

function main() {
  document.querySelector(SUBMIT).addEventListener('click', submitRequest);

  if (TESTING) {
    $(ADDRESS_INPUT).val('30607');
    $(MIN_SCORE).val('100');
  }
}

main();