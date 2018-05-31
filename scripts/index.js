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

function getCoordinates(zipCode) {
  var url = GEO_BASE_URL + zipCode + GEO_API_KEY;
  $.get(GEO_BASE_URL, {
        address: zipCode,
        key: GEO_API_KEY})
  .then(data => {
    if (data.results[1]) {
      createAddressSelectList(data.results);
    };
    var location = data.results[0].geometry.location
    initMap(location.lat, location.lng);
    })
  .catch(error => {
    console.log(error);
  });
}

function initMap(latValue=33.7676338,lngValue=-84.5606888) {
  var mapDiv = document.querySelector(MAP_CONTAINER);
  var map = new google.maps.Map(mapDiv, {
    center: {lat: latValue, lng: lngValue},
    zoom: 8
  });
  var marker = new google.maps.Marker({position: {lat: latValue, lng: lngValue},
    map: map});
}

function submitRequest(event) {
  event.preventDefault();
  var zipCode = document.querySelector(ADDRESS_INPUT).value
  if (zipCode) {
    getCoordinates(zipCode);
  }
}

function main() {
  document.querySelector(SUBMIT).addEventListener('click', submitRequest);
}

main();