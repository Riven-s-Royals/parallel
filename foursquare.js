import axios from "axios";
import { FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET } from "./secrets";
console.log(FOURSQUARE_CLIENT_ID);
console.log(FOURSQUARE_CLIENT_SECRET);

export const browse = async (userCoordinates) => {
  const [longitude, latitude] = userCoordinates; //willl need to go in api call below reversed
  //console.log("inside browse func: long, lat", longitude, latitude); //-73.9622 , 40.7099
  try {
    const { data } = await axios.get(
      `https://api.foursquare.com/v2/venues/search?client_id=${FOURSQUARE_CLIENT_ID}&client_secret=${FOURSQUARE_CLIENT_SECRET}&v=20200101&ll=${latitude},${longitude}&intent=checkin&radius=200&query=&limit=1`
    );
    //console.log("data in foursquare.js", data);
    const { lat, lng } = data.response.venues[0].location;
    console.log("inside browse end", lat, lng);
    return [lat, lng];
  } catch (err) {
    console.log(err);
  }
};

// https://api.foursquare.com/v2/venues/search?client_id=RKZORYMVD1KSQTM5LPYNT34DWS0XCWDVTW1ALCU1QC5I0YSV&client_secret=410SOXFM5UFHDCB3VMUX0CVYRZDAXZ5UUSERXVU3HCUZEG04&v=20200101&ll=40.7099,-73.9622&intent=checkin&radius=200&query=&limit=5

// `https://api.foursquare.com/v2/venues/search?client_id=${FOURSQUARE_CLIENT_ID}&client_secret=${FOURSQUARE_CLIENT_SECRET}&v=20200101&near=new york&intent=browse&radius=10000&query=peter luger steak house&limit=10`
