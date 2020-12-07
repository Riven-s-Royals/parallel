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
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import firestore from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import { MAPBOXGL_ACCESS_TOKEN } from './secrets';
import BottomSheet from 'reanimated-bottom-sheet';
import Constants from 'expo-constants';
import { browse } from './foursquare';
import renderAnnotation from './renderAnnotation';

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
        console.log('getUserLocation position:', position);
        this.setState({
          userCoords: [position.coords.longitude, position.coords.latitude],
        });
        console.log('this state user', this.state.userCoords);
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
    console.log('this.state.locations', this.state.locations);
  }

  async getFirestoreLocations() {
    const snapshot = await firestore().collection('locations').get();
    return snapshot.docs.map((doc) => {
      let docObj = doc.data();
      this.setState((prevState) => {
        return {
          ...prevState,
          locations: [...prevState.locations, docObj],
        };
      });
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
  renderInner = () => (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Swipe Up To Explore!</Text>
      {/* <Text style={styles.panelSubtitle}>So Much</Text> */}
      <Image style={styles.photo} source={require('./assets/wakeupcat.jpg')} />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.scrollText}>First Text Box</Text>
        <Text style={styles.scrollText}>Second Text Box</Text>
        <Text style={styles.scrollText}>Third Text Box</Text>
        <Text style={styles.scrollText}>Fourth Text Box</Text>
        <Text style={styles.scrollText}>Fifth Text Box</Text>
        <Text style={styles.scrollText}>Sixth Text Box</Text>
        <Text style={styles.scrollText}>Seventh Text Box</Text>
        <Text style={styles.scrollText}>Eighth Text Box</Text>
        <Text style={styles.scrollText}>Ninth Text Box</Text>
        <Text style={styles.scrollText}>Tenth Text Box</Text>
      </ScrollView>
    </View>
  );

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  myRef = React.createRef();
  render() {
    const venuesArray = this.state.foursquare;
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
          renderContent={this.renderInner}
          renderHeader={this.renderHeader}
          initialSnap={1}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  panelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  panel: {
    height: 800,
    padding: 20,
    backgroundColor: '#f7f5eee8',
  },
  header: {
    backgroundColor: '#f7f5eee8',
    shadowColor: '#000000',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: -10,
  },
  panelTitle: {
    fontSize: 20,
    height: 35,
    textAlign: 'center',
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginTop: 30,
    marginBottom: 10,
  },
  photo: {
    width: '100%',
    height: 300,
    marginTop: 50,
  },
  scrollContainer: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  scrollText: {
    fontSize: 42,
  },
});

export default App;
