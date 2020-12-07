import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  AppRegistry,
  Button,
  ScrollView,
  LogBox,
  FlatList,
} from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import firestore from "@react-native-firebase/firestore";
import Geolocation from "react-native-geolocation-service";
import { MAPBOXGL_ACCESS_TOKEN } from "./secrets";
import BottomSheet from "reanimated-bottom-sheet";
import { browse } from "./foursquare";
import renderAnnotation from "./renderAnnotation";
import {renderInner, renderHeader} from "./drawer";

LogBox.ignoreAllLogs(); //Ignore all log notifications

MapboxGL.setAccessToken(MAPBOXGL_ACCESS_TOKEN);


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userCoords: [],
      locations: [],
      permissionsGranted: null,
      foursquare: [],
      loading: false
    };

    this.getFbVenues = this.getFbVenues.bind(this);
    this.get4SqVenues = this.get4SqVenues.bind(this);
    // To setup an active listener to react to any
    // changes to the query
    // this.subscriber = firestore()
    //   .collection('locations')
    //   .doc('Er22DEkmMqBfzRZCQZA0')
    //   .onSnapshot((doc) => {
    //     this.setState((prevState) => {
    //       return {
    //         ...prevState,
    //         locations: [
    //           ...prevState.locations,
    //           [
    //             { ...doc.data().coordinates }[0].longitude,
    //             { ...doc.data().coordinates }[0].latitude,
    //           ],
    //         ],
    //       };
    //     });
    //     console.log('this state location', this.state.locations[0]);
    //   });
  }
  async requestPermission() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]).then((result) => {
        console.log("result", result);
        if (
          result["android.permission.ACCESS_COARSE_LOCATION"] &&
          result["android.permission.ACCESS_FINE_LOCATION"] === "granted"
        ) {
          this.getUserLocation();
          this.setState({
            permissionsGranted: true,
          });
        }
      });
    } catch (err) {
      console.warn("err", err);
    }
  }

  getUserLocation() {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log("getUserLocation position:", position);
        this.setState({
          userCoords: [position.coords.longitude, position.coords.latitude],
        });
        console.log("this state user", this.state.userCoords);
        this.get4SqVenues();
      },
      (error) => {
        // See error code charts below.
        console.log("getUserLocation error:", error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  componentDidMount() {
    if (Platform.OS === "ios") {
      Geolocation.requestAuthorization("whenInUse").then((res) => {
        console.log("authorization result:", res);
      });
    }
    if (Platform.OS === "android") {
      this.requestPermission();
    } else {
      this.getUserLocation();
    }
    this.getFbVenues();
  }

  async getFbVenues() {
    const doc = await firestore()
      .collection("locations")
      .doc("Er22DEkmMqBfzRZCQZA0")
      .get();
    // console.log('doc', doc);
    this.setState((prevState) => {
      return {
        ...prevState,
        locations: [
          ...prevState.locations,
          [
            { ...doc.data().coordinates }[0].longitude,
            { ...doc.data().coordinates }[0].latitude,
          ],
        ],
      };
    });
  }

  async get4SqVenues() {
    const userCoordinates = this.state.userCoords;
    const venuesArray = await browse(userCoordinates);

    this.setState((prevState) => {
      return {
        ...prevState,
        foursquare: venuesArray,
      };
    });
  }




  myRef = React.createRef();

  render() {
    const venuesArray = this.state.foursquare;
    return (
      <View style={{ flex: 1, height: "100%", width: "100%" }}>
        <Button
          style={{ justifyContent: "right" }}
          title="Camera"
          onPress={() => this.props.navigation.navigate("Camera")}
        />
        {this.state.userCoords ? (
          <MapboxGL.MapView
            styleURL={MapboxGL.StyleURL.Street}
            zoomLevel={16}
            centerCoordinate={this.state.userCoords}
            showUserLocation={true}
            style={{ flex: 1 }}
          >
            <MapboxGL.Camera
              zoomLevel={16}
              centerCoordinate={this.state.userCoords}
            ></MapboxGL.Camera>
            {renderAnnotation("user", this.state.userCoords)}
            {renderAnnotation("firestore", this.state.locations[0])}
            {
              venuesArray.map((venue, idx) => {
                const { lat, lng } = venue.location;
                return renderAnnotation("foursquare", [lng, lat], idx);
              }) //renderAnnotation('foursquare', this.state.foursquare)
            }
          </MapboxGL.MapView>
        ) : (
          <Text>Loading...</Text>
        )}
        <BottomSheet
          ref={this.myRef}
          snapPoints={[800, 125]}
          renderHeader={renderHeader}
          renderContent={() => renderInner(this.state.foursquare)}
          initialSnap={1}
        />
      </View>
    );
  }
}

export default App;
