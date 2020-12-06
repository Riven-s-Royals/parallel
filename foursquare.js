import axios from "axios";
import { FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET } from "./secrets";
console.log(FOURSQUARE_CLIENT_ID);
console.log(FOURSQUARE_CLIENT_SECRET);

export const browse = async (userCoordinates) => {
  const [longitude, latitude] = userCoordinates; //will need to put coords in api call below reversed
  //console.log("inside browse func: long, lat", longitude, latitude); //-73.9622 , 40.7099
  try {
    const { data } = await axios.get(
      `https://api.foursquare.com/v2/venues/search?client_id=${FOURSQUARE_CLIENT_ID}&client_secret=${FOURSQUARE_CLIENT_SECRET}&v=20200101&ll=${latitude},${longitude}&intent=browse&radius=10000&query=museum&limit=5`
    );
    const venuesArray = data.response.venues;
    return venuesArray;
  } catch (err) {
    console.log(err);
  }
};

// `https://api.foursquare.com/v2/venues/search?client_id=${FOURSQUARE_CLIENT_ID}&client_secret=${FOURSQUARE_CLIENT_SECRET}&v=20200101&near=new york&intent=browse&radius=10000&query=peter luger steak house&limit=10`
