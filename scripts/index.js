var map;
var infoWindow;
var resultsMinScore;

// Escapes HTML characters in a template literal string, to prevent XSS.
// See https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#RULE_.231_-_HTML_Escape_Before_Inserting_Untrusted_Data_into_HTML_Element_Content
function sanitizeHTML(strings) {
  const entities = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
  let result = strings[0];
  for (let i = 1; i < arguments.length; i++) {
    result += String(arguments[i]).replace(/[&<>'"]/g, (char) => {
      return entities[char];
    });
    result += strings[i];
  }
  return result;
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

function initMap() {
  getGeocodeDataAndDoStuff(STARTING_ZIP_CODE, drawMap);
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
      ,fullscreenControl: false
      ,streetViewControl: false
      ,mapTypeControl: false
    }
  );
  var sw = data.results[0].geometry.bounds.southwest;
  var ne = data.results[0].geometry.bounds.northeast;
  map.fitBounds(new google.maps.LatLngBounds(sw, ne));

  infoWindow = new google.maps.InfoWindow();
  infoWindow.setOptions(
    {
      pixelOffset: new google.maps.Size(0, -30)
      ,maxWidth: 220
    });
}

function setMapMarker(data, restaurantData) {
  var latValue = data.results[0].geometry.location.lat;
  var lngValue = data.results[0].geometry.location.lng;
  var score = restaurantData.score;
  var minScore = $(MIN_SCORE).val();
  var scoreRange = minScore - resultsMinScore;
  var iconFile;
  var scoreRangeBreakpoint = scoreRange / 3;
  var greenLowEnd = minScore - scoreRangeBreakpoint;
  var yellowLowEnd = greenLowEnd - scoreRangeBreakpoint;
  if (score > greenLowEnd) {
    iconFile = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
  } else if (score > yellowLowEnd) {
    iconFile = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
  } else {
    iconFile = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
  }
  // icons from https://sites.google.com/site/gmapsdevelopment/
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
  marker.addListener('click', event => {
    var locationValue = latValue + ',' + lngValue;
    var content;
    $.get(STREETVIEW_METADATA_URL, {
            location: locationValue,
            key: STREETVIEW_API_KEY}
    )
    .then (data => {
      if (data.status === 'OK') {
        content = sanitizeHTML`
        <div class="info-window">
        <p><img width="200px" src="https://maps.googleapis.com/maps/api/streetview?size=300x200&location=${latValue},${lngValue}"></p>
        <p><span class="iw-name">${restaurantData.name}</span><br/>
        ${restaurantData.address}<br/></p>
        <p><span class="iw-score">Score:</b> ${restaurantData.score}</span></p>
        </div>
        `;
      } else {
        content = sanitizeHTML`
        <div class="info-window">
        <p><span class="iw-name">${restaurantData.name}</span><br/>
        ${restaurantData.address}<br/></p>
        <p><span class="iw-score">Score:</b> ${restaurantData.score}</span></p>
        </div>
        `;
      }
      infoWindow.setContent(content);
      infoWindow.setPosition({lat: latValue, lng: lngValue});
      infoWindow.open(map);
    })
  });
}

function getGeocodeDataAndDoStuff(address, stuffToDo, stuffYouNeed=null) {
  $.get(GEO_BASE_URL, {
        address: address,
        key: GEO_API_KEY})
    .then(data => {
      stuffToDo(data, stuffYouNeed);
    })
  // Future feature to allow partial address input
  // .then(data => {
  //   if (data.results[1]) {createAddressSelectList(data.results);}
  //   })
  .catch(error => {
    console.log(error);
  });
}

function updateOffenderResults(restaurantArray) {
  var $tableDiv = $(OFFENDER_TABLE_DIV);
  var $tableHeader = $(OFFENDER_TABLE_HEADER_CELL);
  $tableHeader.text("Offenders");
  var $table = $(OFFENDER_TABLE);
  $table.empty();
  var $tr1 = $('<tr>');
  var $th1 = $('<th>').addClass(RESTAURANT_CLASS).text('Restaurant').appendTo($tr1);
  var $th2 = $('<th>').addClass(ADDRESS_CLASS).text('Address').appendTo($tr1);
  var $th3 = $('<th>').addClass(SCORE_CLASS).text('Score').appendTo($tr1);
  $tr1.appendTo($table);
  restaurantArray.forEach(restaurant => {
    var $tr = $('<tr>');
    var $td1 = $('<td>').text(restaurant.name).appendTo($tr);
    var $td2 = $('<td>').text(restaurant.address).appendTo($tr);
    var $td3 = $('<td>').text(restaurant.score).appendTo($tr);
    $tr.appendTo($table);
    getGeocodeDataAndDoStuff(restaurant.address, setMapMarker, restaurant);
  });
  $tableDiv.removeClass(HIDE_TABLE);
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

function submitRequest(event) {
  event.preventDefault();
  var zipCode = $(ZIP_CODE).val();
  var minScore = $(MIN_SCORE).val();
  if (zipCode && minScore) {
    var results = getOffenders(zipCode, minScore);
    if (results[0]){
      getGeocodeDataAndDoStuff(zipCode, drawMap);
      updateOffenderResults(results);
    } else {
      showNoResultsFound();
    }
  }
var scroll = document.querySelector("#scrollHere") ;
scroll.scrollIntoView(true);
}

function showNoResultsFound() {
  var $tableDiv = $(OFFENDER_TABLE_DIV);
  var $tableHeader = $(OFFENDER_TABLE_HEADER_CELL);
  $tableHeader.text("No Results Found");
  $tableDiv.removeClass(HIDE_TABLE);
  var $table = $(OFFENDER_TABLE);
  $table.empty();
  initMap(); 
}

function populateHealthScore() {
  var $selectElement = $(HEALTH_SCORE);
  for (var index = 100; index > 0; index -= 5) {
    var options = $("<option>");
    options.text(index)
    options.appendTo($selectElement);
  }
}

function populateZipCodePulldown() {
  var $selectElement = $(ZIP_CODE);
  zipCodes.sort().forEach(zipCode => {
    var options = $("<option>");
    options.text(zipCode)
    options.appendTo($selectElement);
  })
}

function main() {
  document.querySelector(SUBMIT).addEventListener('click', submitRequest);
  populateZipCodePulldown();
  populateHealthScore();

  const TESTING = false;
  if (TESTING) {
    $(ADDRESS_INPUT).val('30607');
    $(MIN_SCORE).val('100');
  }
}

main();