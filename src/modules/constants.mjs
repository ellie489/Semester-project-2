const BASE_URL = "https://api.noroff.dev/api/v1/auction";
const REGISTER = `${BASE_URL}/auth/register`;
const LOGIN = `${BASE_URL}/auth/login`;
const LISTINGS = `${BASE_URL}/listings`;
const PROFILES = `${BASE_URL}/profiles`;
const PROFILE = `${BASE_URL}/profiles/<name>`;
const AVATAR = `${BASE_URL}/profiles/<name>/media`;
// PUT Action for setting or changing avatar media
const PROFILE_LISTINGS = `${BASE_URL}/profiles/<name>/listings`;
const PROFILE_BIDS = `${BASE_URL}/profiles/<name>/bids`;
const TAG = `${BASE_URL}/listings?_tag=my_tag&_active=true`;
// Profile properties for name, credits, wins etc.
// Query parameters: _listings = true, shows listings belongning to that profile. 
  export const API_URLS = {
    BASE_URL,
    LOGIN,
    REGISTER,
    LISTINGS,
    PROFILE,
    PROFILES,
    AVATAR,
    PROFILE_BIDS,
    PROFILE_LISTINGS,
    TAG
  }