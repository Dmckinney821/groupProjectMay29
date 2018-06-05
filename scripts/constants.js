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
// For the dropdowns
const HEALTH_SCORE = "[data-health-score]";
const ZIP_CODE = "[data-zip-code]";
const OFFENDER_TABLE_DIV = "[data-offenders]";
const OFFENDER_TABLE_HEADER_CELL = "[data-offenders-header]"


// Class strings
const RESTAURANT_CLASS = 'text-center restaurantWidth';
const ADDRESS_CLASS = 'text-center addressWidth';
const SCORE_CLASS = 'text-center scoreWidth';
const HIDE_TABLE = 'hideTable';

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

// Unique zip codes in counties.js data
const zipCodes = [30014, 30018, 30656, 30054, 30655, 30025, 30671, 30627, 30630, 30648, 30621, 30677, 30647, 30628, 30629, 30662, 30633, 30646, 30604, 30608, 30602, 30603, 30683, 30622, 30605, 30606, 30601, 30203, 30666, 30011, 30680, 30620, 30678, 30669, 30642, 30665, 30530, 30575, 30657, 30607, 30558, 30506, 30565, 30548, 30529, 30517, 30549];
// const zipCodes = [30014, 30018, 30656, 30054, 30655, 30025, 30671, 30627, 30630, 30648, 30621, 30677, 30647, 30628, 30629, 30662, 30633, 30646, 30604, 30608, 30602, 30603, 30683, 30622, 30605, 30606, 30601, 30203, 30666, 30011, 30680, 30620, 30678, 30669, 30642, 30665, 30530, 30575, 30657, 30607, 30558, 30506, 30565, 30548, 30529, 30517, 30549, '﨟﨟￿﨟﨟﨟￿﨟﨟﨟￿﨟﨟﨟￿﨟﨟﨟￿'];