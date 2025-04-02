import { Loader } from '@googlemaps/js-api-loader';

let googleInstance = null;

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["places", "geometry", "routes"],
});

export const initGoogleMaps = async () => {
  if (!googleInstance) {
    googleInstance = await loader.load();
  }
  return googleInstance;
};
