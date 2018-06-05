const STARTING_ZIP_CODE = '30305';

// Div where map will be created
const MAP_CONTAINER = '[data-map]';
// Div where a ul and li items will be created for multiple addresses returned
// from Google
const ADDR_SELECT_CONTAINER = '[data-address-select]';
// Submit button
const SUBMIT = '[data-submit]';
// Text field where user types in zip code or address
const ADDRESS_INPUT = '[data-address-input]';
// Field where user selects minimum acceptable health score
const MIN_SCORE = '[data-health-score]';
// Table body where offender results will be injected
const OFFENDER_TABLE = '[data-offender-table]';
// For the dropdown 
const HEALTH_SCORE = "[data-health-score]";


// Class strings
const RESTAURANT_CLASS = 'text-center restaurantWidth';
const ADDRESS_CLASS = 'text-center addressWidth';
const SCORE_CLASS = 'text-center scoreWidth';

// API urls and keys

const GEO_BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?';
const GEOLOCATION_BASE_URL = 'https://www.googleapis.com/geolocation/v1/geolocate?'
const STREETVIEW_BASE_URL = 'https://maps.googleapis.com/maps/api/streetview'
const STREETVIEW_METADATA_URL = 'https://maps.googleapis.com/maps/api/streetview/metadata'

// Dan's key
const MAP_API_KEY = 'AIzaSyAVR2uRZUFdke1dVJZbkwj3X1eUeN0PSCY';
// Lisa's API key
const GEO_API_KEY = 'AIzaSyBAXU-M8aiZ0Huw-2FcR0mESGdEACgBxJA';
const GEOLOCATION_API_KEY = GEO_API_KEY;
const STREETVIEW_API_KEY = GEO_API_KEY;

