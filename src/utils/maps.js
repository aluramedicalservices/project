import { Loader } from '@googlemaps/js-api-loader';

let googleInstance = null;
let loader = null;

export const initGoogleMaps = async () => {
  if (!loader) {
    loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places", "geometry", "routes"],
    });
  }

  if (!googleInstance) {
    googleInstance = await loader.load();
  }
  return googleInstance;
};

export const getGoogleMapsInstance = () => {
  if (!googleInstance) {
    throw new Error('Google Maps not initialized. Call initGoogleMaps first.');
  }
  return googleInstance;
};