import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  LogBox
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomSheet from 'reanimated-bottom-sheet';

import MapboxGL from '@react-native-mapbox-gl/maps';
import { MAPBOXGL_ACCESS_TOKEN } from './secrets';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import { onGoogleButtonPress } from './signIn';

import renderAnnotation from './renderAnnotation';
import { browse } from './foursquare';
import { renderInner, renderHeader } from './drawer';
import Icon from 'react-native-vector-icons/FontAwesome';

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
      foursquare: [],
      userInfo: '',
    };

    this.getFirestoreLocations = this.getFirestoreLocations.bind(this);
    this.get4SqVenues = this.get4SqVenues.bind(this);
  }

  async requestPermission() {
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
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          userCoords: [position.coords.longitude, position.coords.latitude],
        });
        this.get4SqVenues();
      },
      (error) => {
        // See error code charts below.
        console.log('getUserLocation error:', error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  async componentDidMount() {
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
    await this.getFirestoreLocations();
   
  
  }


  async getFirestoreLocations() {
    const snapshot = await firestore().collection('locations').get();
    return snapshot.docs.map((doc) => {
      let docObj = doc.data();
      if (
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
                color="black"
                backgroundColor="grey"
                onPress={() => this.props.navigation.navigate('Camera')}
              />
            </View>
            <View style={styles.userButton}>
              <Icon.Button
                name="user"
                size={35}
                color="dimgray"
                backgroundColor="#f7f5eee8"
                onPress={() =>
                  onGoogleButtonPress().then(() =>
                    console.log('Signed in with Google!')
                  )
                }
              />
            </View>
            <MapboxGL.Camera
              zoomLevel={16}
              centerCoordinate={this.state.userCoords}
            ></MapboxGL.Camera>
            {renderAnnotation('user', this.state.userCoords)}
            {this.state.locations.map((location, idx) => {
              return renderAnnotation(
                'firestore',
                [location.coordinates.longitude, location.coordinates.latitude],
                idx
              );
            })}
            {
              venuesArray.map((venue, idx) => {
                const { lat, lng } = venue.location;
                return renderAnnotation('foursquare', [lng, lat], idx);
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
    height: '100%',
    width: '100%'
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
    position: 'absolute', //use absolute position to show button on top of the map
    top: '12%', //for center align
    alignSelf: 'flex-end', //for align to right
  },
});

export default App;
