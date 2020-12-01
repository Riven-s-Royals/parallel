import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Platform, Text } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import firestore from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiYnVyZGl0dGIiLCJhIjoiY2tmd3BjeDNoMW1iODJ5cWd3aG16ejR1NyJ9.6SP4_hBVmB2eXIQI_PXHtA'
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userCoords: [],
      locations: [],
      permissionsGranted: null,
    };
    this.getCoordinates = this.getCoordinates.bind(this);
    this.renderAnnotations = this.renderAnnotations.bind(this);
    this.renderUserAnnotation = this.renderUserAnnotation.bind(this);
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
  }

  async getCoordinates() {
    const doc = await firestore()
      .collection('locations')
      .doc('Er22DEkmMqBfzRZCQZA0')
      .get();
    console.log('doc', doc);
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

  renderUserAnnotation() {
    return (
      <MapboxGL.PointAnnotation
        key="userAnnotation"
        id="userAnnotation"
        coordinate={this.state.userCoords}
      >
        <View
          style={{
            height: 20,
            width: 20,
            backgroundColor: '#e76f51',
            borderRadius: 50,
            borderColor: '#fff',
            borderWidth: 2,
          }}
        />
      </MapboxGL.PointAnnotation>
    );
  }

  renderAnnotations() {
    return (
      <MapboxGL.PointAnnotation
        key="pointAnnotation"
        id="pointAnnotation"
        coordinate={this.state.locations[0]}
      >
        <View
          style={{
            height: 30,
            width: 30,
            backgroundColor: '#00cccc',
            borderRadius: 50,
            borderColor: '#fff',
            borderWidth: 3,
          }}
        />
      </MapboxGL.PointAnnotation>
    );
  }
  render() {
    return (
      <View style={{ flex: 1, height: '100%', width: '100%' }}>
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
            {this.renderUserAnnotation()}
            {this.renderAnnotations()}
          </MapboxGL.MapView>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    );
  }
}

export default App;
