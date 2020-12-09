import React from "react";
import {
  StyleSheet,
  View,
  Platform,
  Text,
  LogBox,
  Modal,
  TouchableHighlight,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import BottomSheet from "reanimated-bottom-sheet";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { MAPBOXGL_ACCESS_TOKEN } from "./secrets";
import RenderAnnotation from "./renderAnnotation";
import { renderInner, renderHeader } from "./drawer";
import Geolocation from "react-native-geolocation-service";
import firestore from "@react-native-firebase/firestore";
import { onGoogleButtonPress } from "./signIn";

LogBox.ignoreAllLogs(); //Ignore all log notifications

MapboxGL.setAccessToken(MAPBOXGL_ACCESS_TOKEN);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      permissionsGranted: null,
      loading: false,
      userCoords: [],
      locations: [],
      modalVisible: false,
      // foursquare: [],
      userInfo: "",
    };
    this.requestPermission = this.requestPermission.bind(this);
    this.getUserLocation = this.getUserLocation.bind(this);
    this.getFirestoreLocations = this.getFirestoreLocations.bind(this);
    // this.get4SqVenues = this.get4SqVenues.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  async componentDidMount() {
    //requests user permission for location
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
    await this.getFirestoreLocations();
    // await this.get4SqVenues();
  }

  async requestPermission() {
    //requests user permission for location on Android devices
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
    //once user permission is granted, get user coordinates from device
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          userCoords: [position.coords.longitude, position.coords.latitude],
        });
      },
      (error) => {
        // See error code charts below.
        console.log("getUserLocation error:", error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  async getFirestoreLocations() {
    //pulls crowsourced location submissions from firestore
    const snapshot = await firestore().collection("locations").get();
    return snapshot.docs.map((doc) => {
      let docObj = doc.data();
      if (
        //narrows geographic range of what is rendered
        //to be in user's general area
        this.state.userCoords[1] - docObj.coordinates.latitude > -0.1 &&
        this.state.userCoords[1] - docObj.coordinates.latitude < 0.1 &&
        this.state.userCoords[0] - docObj.coordinates.longitude > -0.1 &&
        this.state.userCoords[0] - docObj.coordinates.longitude < 0.1
      ) {
        this.setState((prevState) => {
          return {
            ...prevState,
            locations: [...prevState.locations, docObj],
          };
        });
      }
    });
  }

  // async get4SqVenues() {
  //   const userCoordinates = this.state.userCoords;
  //   const venuesArray = await browse(userCoordinates);
  //   this.setState((prevState) => {
  //     return {
  //       ...prevState,
  //       foursquare: venuesArray,
  //     };
  //   });
  // }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  myRef = React.createRef();

  render() {
    return (
      <View style={styles.container}>
        {this.state.userCoords ? (
          <MapboxGL.MapView
            styleURL={MapboxGL.StyleURL.Street}
            zoomLevel={16}
            centerCoordinate={this.state.userCoords}
            showUserLocation={true}
            style={styles.map}
          >
            <View style={styles.cameraButton}>
              <Icon.Button
                name="camera-retro"
                size={30}
                color="black"
                backgroundColor="grey"
                onPress={() => this.props.navigation.navigate("Camera")}
              />
            </View>
            <View style={styles.userButton}>
              <Icon.Button
                name="user"
                size={39}
                color="black"
                backgroundColor="grey"
                onPress={() =>
                  onGoogleButtonPress().then(() =>
                    console.log("Signed in with Google!")
                  )
                }
              />
            </View>
            <MapboxGL.Camera
              zoomLevel={16}
              centerCoordinate={this.state.userCoords}
            ></MapboxGL.Camera>
            <RenderAnnotation
              source={"user"}
              coordinates={this.state.userCoords}
              setModal={this.setModalVisible}
            />
            {
              this.state.locations.map((location, idx) => {
                return  (
                <RenderAnnotation
                  source={"firestore"}
                  coordinates={[
                    location.coordinates.longitude,
                    location.coordinates.latitude,
                  ]}
                  idx={idx}
                  setModal={this.setModalVisible}
                />)
              })}
            {/* {
              this.state.foursquare.map((venue, idx) => {
                const { lat, lng } = venue.location;
                return renderAnnotation('foursquare', [lng, lat], idx);
              })
            } */}
            <View style={styles.centeredView}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Hello World!</Text>

                    <TouchableHighlight
                      style={{
                        ...styles.openButton,
                        backgroundColor: "grey",
                      }}
                      onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                      }}
                    >
                      <Text style={styles.textStyle}>Hide Modal</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </Modal>
            </View>
          </MapboxGL.MapView>
        ) : (
          <Text>Loading...</Text>
        )}
        <BottomSheet
          ref={this.myRef}
          snapPoints={[800, 125]}
          renderHeader={renderHeader}
          renderContent={() => renderInner(this.state.locations)}
          initialSnap={1}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  map: {
    flex: 1,
    zIndex: -1,
  },
  cameraButton: {
    position: "absolute",
    top: "4%",
    alignSelf: "flex-end",
  },
  userButton: {
    position: "absolute",
    top: "12%",
    alignSelf: "flex-end",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default App;
