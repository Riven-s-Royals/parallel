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
    };
    // this.getCoordinates = this.getCoordinates.bind(this);
    // this.renderAnnotations = this.renderAnnotations.bind(this);
    // this.subscriber = firestore()
    //   .collection('locations')
    //   .doc('Er22DEkmMqBfzRZCQZA0')
    //   .onSnapshot((doc) => {
    //     this.setState({
    //       latitude: { ...doc.data().coordinates }[0].latitude,
    //       longitude: { ...doc.data().coordinates }[0].longitude,
    //     });
    //     console.log('latitude?!', this.state.latitude);
    //     console.log('longitude?!', this.state.longitude);
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
  }
  // componentDidMount() {
  // this.getCoordinates();
  // }
  // async getCoordinates() {
  //   const coordinatesDocument = await firestore()
  //     .collection('locations')
  //     .doc('Er22DEkmMqBfzRZCQZA0')
  //     .get();
  //   console.log('coordinatesDocumet', coordinatesDocument);
  // }

  // renderAnnotations() {
  //   return (
  //     <MapboxGL.PointAnnotation
  //       key="pointAnnotation"
  //       id="pointAnnotation"
  //       coordinate={[this.state.longitude, this.state.latitude]}
  //     >
  //       <View
  //         style={{
  //           height: 30,
  //           width: 30,
  //           backgroundColor: '#00cccc',
  //           borderRadius: 50,
  //           borderColor: '#fff',
  //           borderWidth: 3,
  //         }}
  //       />
  //     </MapboxGL.PointAnnotation>
  //   );
  // }
  render() {
    return (
      <View style={{ flex: 1, height: '100%', width: '100%' }}>
        <MapboxGL.MapView
          styleURL={MapboxGL.StyleURL.Street}
          zoomLevel={16}
          centerCoordinate={[-74.00928918392906, 40.70562853006794]}
          showUserLocation={true}
          style={{ flex: 1 }}
        >
          <MapboxGL.Camera
            zoomLevel={16}
            centerCoordinate={[-74.00928918392906, 40.70562853006794]}
          ></MapboxGL.Camera>
          {/* {this.renderAnnotations()} */}
        </MapboxGL.MapView>
      </View>
    );
  }
}

export default App;
