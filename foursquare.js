import axios from 'axios';
import { FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET } from './secrets';
console.log(FOURSQUARE_CLIENT_ID);
console.log(FOURSQUARE_CLIENT_SECRET);

export const browse = async () => {
  try {
    const { data } = await axios.get(
      `https://api.foursquare.com/v2/venues/search?client_id=${FOURSQUARE_CLIENT_ID}&client_secret=${FOURSQUARE_CLIENT_SECRET}&v=20200101&near=new york&intent=browse&radius=10000&query=peter luger steak house&limit=10`
    );
    // console.log('data in foursquare.js', data.response.venues);
    return data.response.venues;
  } catch (err) {
    console.log(err);
  }
};
