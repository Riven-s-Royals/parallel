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
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import firestore from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import { MAPBOXGL_ACCESS_TOKEN } from './secrets';
import { RNCamera } from 'react-native-camera';
import { browse } from './foursquare';
import renderAnnotation from './renderAnnotation';

MapboxGL.setAccessToken(MAPBOXGL_ACCESS_TOKEN);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userCoords: [],
      locations: [],
      permissionsGranted: null,
      foursquare: [],
    };
    this.getCoordinates = this.getCoordinates.bind(this);
    this.get4SqAnnotation = this.get4SqAnnotation.bind(this);
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
        console.log('result', result);
        if (
          result['android.permission.ACCESS_COARSE_LOCATION'] &&
          result['android.permission.ACCESS_FINE_LOCATION'] === 'granted'
        ) {
          this.getLocation();
          this.setState({
            permissionsGranted: true,
          });
        }
      });
    } catch (err) {
      console.warn('err', err);
    }
  }

  getLocation() {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('getLocation position:', position);
        this.setState({
          userCoords: [position.coords.longitude, position.coords.latitude],
        });
        console.log('this state user', this.state.userCoords);
      },
      (error) => {
        // See error code charts below.
        console.log('getLocation error:', error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('whenInUse').then((res) => {
        console.log('authorization result:', res);
      });
    }
    if (Platform.OS === 'android') {
      this.requestPermission();
    } else {
      this.getLocation();
    }
    this.getCoordinates();
    this.get4SqAnnotation();
  }

  async getCoordinates() {
    const doc = await firestore()
      .collection('locations')
      .doc('Er22DEkmMqBfzRZCQZA0')
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

  async get4SqAnnotation() {
    const [response] = await browse();
    this.setState((prevState) => {
      return {
        ...prevState,
        foursquare: [response.location.lng, response.location.lat],
      };
    });
    // console.log('this state 4s', this.state.foursquare);
  }

  render() {
    return (
      <View style={{ flex: 1, height: '100%', width: '100%' }}>
        <Button
          style={{ justifyContent: 'right' }}
          title="Camera"
          onPress={() => this.props.navigation.navigate('Camera')}
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
            {renderAnnotation('user', this.state.userCoords)}
            {renderAnnotation('firestore', this.state.locations[0])}
            {renderAnnotation('foursquare', this.state.foursquare)}
          </MapboxGL.MapView>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    );
  }
}

export default App;
