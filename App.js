import React, { useEffect, useRef } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomSheet from 'reanimated-bottom-sheet';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { MAPBOXGL_ACCESS_TOKEN } from './secrets';
import { browse } from './foursquare';
import renderAnnotation from './renderAnnotation';
import { renderInner, renderHeader } from './drawer';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import { signIn, getCurrentUserInfo } from './signIn';

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
      // foursquare: [],
      userInfo: '',
      email: null,
      favorites: [],
      favoriteClick: false,
    };
    this.requestPermission = this.requestPermission.bind(this);
    this.getUserLocation = this.getUserLocation.bind(this);
    this.getFirestoreLocations = this.getFirestoreLocations.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.getUserFavorites = this.getUserFavorites.bind(this);
    // this.get4SqVenues = this.get4SqVenues.bind(this);
  }

  async componentDidMount() {
    //requests user permission for location
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('whenInUse').then((res) => {
        console.log('authorization result:', res);
      });
    }
    if (Platform.OS === 'android') {
      this.requestPermission();
    } else {
      this.getUserLocation();
    }
    //checking if user is already signed in w/ Google
    //if not, they will be asked to sign in
    const { userInfo } = await getCurrentUserInfo();
    if (userInfo.user.email) {
      this.setState({
        email: userInfo.user.email,
      });
      await this.getUserFavorites();
    }
    console.log('Signed in silently with Google!');

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
        console.log('result', result);
        if (
          result['android.permission.ACCESS_COARSE_LOCATION'] &&
          result['android.permission.ACCESS_FINE_LOCATION'] === 'granted'
        ) {
          this.getUserLocation();
          this.setState({
            permissionsGranted: true,
          });
        }
      });
    } catch (err) {
      console.warn('err', err);
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
        console.log('getUserLocation error:', error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  async getFirestoreLocations() {
    //pulls crowsourced location submissions from firestore
    const snapshot = await firestore().collection('locations').get();
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

  async handleSignIn() {
    try {
      const { userInfo } = await signIn();
      if (userInfo.user.email) {
        this.setState({
          email: userInfo.user.email,
        });
        this.getUserFavorites();
      }
      console.log('Signed in with Google!');
    } catch (error) {
      console.log('Error signing in -> handleSignIn:', error);
    }
  }

  async getUserFavorites() {
    //pulls crowsourced location submissions from firestore
    const snapshot = await firestore()
      .collection('users')
      .doc(this.state.email)
      .get();
    if (snapshot.exists) {
      return await Promise.all(
        snapshot.data().favorites.map(async (ref) => {
          const location = await ref.get();
          this.setState((prevState) => {
            return {
              ...prevState,
              favorites: [...prevState.favorites, location.data()],
            };
          });
        })
      );
    } else {
      console.log('No such document!');
    }
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
                size={35}
                color="dimgray"
                backgroundColor="#f7f5eee8"
                onPress={() => this.props.navigation.navigate('Camera')}
              />
            </View>
            <View style={styles.userButton}>
              <Icon.Button
                name="user"
                size={35}
                color="dimgray"
                backgroundColor="#f7f5eee8"
                onPress={this.handleSignIn}
              />
            </View>
            {this.state.email && (
              <View style={styles.heartButton}>
                <Icon.Button
                  name="heart"
                  size={35}
                  color="dimgray"
                  backgroundColor={
                    this.state.favoriteClick ? 'silver' : '#f7f5eee8'
                  }
                  onPress={() =>
                    this.setState({ favoriteClick: !this.state.favoriteClick })
                  }
                />
              </View>
            )}
            <MapboxGL.Camera
              zoomLevel={16}
              centerCoordinate={this.state.userCoords}
            ></MapboxGL.Camera>
            {renderAnnotation('user', this.state.userCoords)}
            {this.state.locations &&
              this.state.locations.map((location, idx) => {
                return renderAnnotation(
                  'firestore',
                  [
                    location.coordinates.longitude,
                    location.coordinates.latitude,
                  ],
                  idx
                );
              })}
          </MapboxGL.MapView>
        ) : (
          <Text>Loading...</Text>
        )}
        {this.state.favoriteClick ? (
          this.state.favorites.length > 0 && (
            <BottomSheet
              ref={this.myRef}
              snapPoints={[800, 125]}
              renderHeader={renderHeader}
              renderContent={() => renderInner(this.state.favorites)}
              initialSnap={1}
            />
          )
        ) : (
          // ||
          // (this.state.favorites.length === 0 && (
          //   <BottomSheet
          //     ref={this.myRef}
          //     snapPoints={[800, 125]}
          //     renderHeader={<Text>No Favorites Yet</Text>}
          //     initialSnap={1}
          //   />
          // ))
          <BottomSheet
            ref={this.myRef}
            snapPoints={[800, 125]}
            renderHeader={renderHeader}
            renderContent={() => renderInner(this.state.locations)}
            initialSnap={1}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
    zIndex: -1,
  },
  cameraButton: {
    position: 'absolute',
    top: '4%',
    alignSelf: 'flex-end',
  },
  userButton: {
    position: 'absolute',
    top: '12%',
    alignSelf: 'flex-end',
  },
  heartButton: {
    position: 'absolute',
    top: '20%',
    alignSelf: 'flex-end',
  },
});

export default App;

/* const ref = {
  "_documentPath": {
    "_parts": ["locations", "portal down to old new york"]},
  "_firestore": {
    "_app": {
      "_automaticDataCollectionEnabled": true, "_deleteApp": [Function "bound deleteApp"], "_deleted": false,
      "_initialized": true,
      "_name": "[DEFAULT]",
      "_nativeInitialized": true,
      "_options": [Object]},
    "_config": {
      "ModuleClass": [Function "FirebaseFirestoreModule"],
      "hasCustomUrlOrRegionSupport": false, "hasMultiAppSupport": true,
      "namespace": "firestore",
      "nativeEvents": [Array],
      "nativeModuleName": [Array],
      "statics": [Object],
      "version": "10.1.1"},
    "_customUrlOrRegion": undefined,
    "_nativeModule": {
        "RNFBFirestoreCollectionModule": true, "RNFBFirestoreDocumentModule": true, "RNFBFirestoreModule": true, "RNFBFirestoreTransactionModule": true, "clearPersistence": [Function "anonymous"], "collectionGet": [Function "anonymous"], "collectionOffSnapshot": [Function "anonymous"], "collectionOnSnapshot": [Function "anonymous"], "disableNetwork": [Function "anonymous"], "documentBatch": [Function "anonymous"], "documentDelete": [Function "anonymous"], "documentGet": [Function "anonymous"], "documentOffSnapshot": [Function "anonymous"], "documentOnSnapshot": [Function "anonymous"], "documentSet": [Function "anonymous"], "documentUpdate": [Function "anonymous"], "enableNetwork": [Function "anonymous"], "getConstants": [Function "anonymous"], "setLogLevel": [Function "anonymous"], "settings": [Function "anonymous"],
        "terminate": [Function "anonymous"], "transactionApplyBuffer": [Function "anonymous"], "transactionBegin": [Function "anonymous"], "transactionDispose": [Function "anonymous"], "transactionGetDocument": [Function "anonymous"], "waitForPendingWrites": [Function "anonymous"]},
      "_referencePath": {
        "_parts": [Array]
      },
        "_transactionHandler": {
          "_firestore": ["Circular"],
          "_pending": [Object]}}} */
