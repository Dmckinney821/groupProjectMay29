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
const OFFENDER_TABLE = '[data-offender-table]'

const GEO_BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?';
// This API is from Lisa's Google developer console
const GEO_API_KEY = 'AIzaSyBAXU-M8aiZ0Huw-2FcR0mESGdEACgBxJA';