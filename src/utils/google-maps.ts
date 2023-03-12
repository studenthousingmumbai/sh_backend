import axios from "axios";
import config from "../config";

export async function getCoordinates(address: string) {
    const apiKey = config.GOOGLE_MAPS_API_KEY;
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
    try {
      const response = await axios.get(apiUrl);

      if (response.data.status === 'OK') {
        const lat = response.data.results[0].geometry.location.lat;
        const lng = response.data.results[0].geometry.location.lng;
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);

        return { lat, lng };
      } 
      else {
        console.error(`Geocoding failed: ${response.data.status}`);
        return {};
      }
    } 
    catch (error) {
      console.error(`Error fetching geocoding data: ${error}`);
      return {};
    }
}