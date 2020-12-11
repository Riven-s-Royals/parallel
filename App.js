import React from 'react';
import { StyleSheet, View, Platform, Text, LogBox } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomSheet from 'reanimated-bottom-sheet';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { MAPBOXGL_ACCESS_TOKEN } from './secrets';
import RenderAnnotation from './renderAnnotation';
import { renderInner, renderHeader, renderInnerFavorites } from './drawer';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import { getCurrentUserInfo, signIn } from './signIn';
import ParentModal from './ParentModal';

LogBox.ignoreAllLogs(); //Ignore all log notifications

MapboxGL.setAccessToken(MAPBOXGL_ACCESS_TOKEN);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userCoords: [],
      locations: [],
      modalVisible: false,
      email: null,
      favorites: [],
      favoriteClick: false,
      currentLocation: null,
      modalObjects: null
    };
    this.getUserLocation = this.getUserLocation.bind(this);
    this.getFirestoreLocations = this.getFirestoreLocations.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.getUserFavorites = this.getUserFavorites.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.setFormInState = this.setFormInState.bind(this)
    this.setModalToNull = this.setModalToNull.bind(this)
    this.locationsSubscriber = firestore()
      .collection('locations')
      .onSnapshot((allLocations) => {
        let placesArray = [];
        allLocations.docs.map((location) => {
          let locationObj = location.data();
          if (
            //narrows geographic range of what is rendered
            //to be in user's general area
            this.state.userCoords[1] - locationObj.coordinates.latitude >
              -0.1 &&
            this.state.userCoords[1] - locationObj.coordinates.latitude < 0.1 &&
            this.state.userCoords[0] - locationObj.coordinates.longitude >
              -0.1 &&
            this.state.userCoords[0] - locationObj.coordinates.longitude < 0.1
          ) {
            placesArray.push(locationObj);
          }
        });
        this.setState((prevState) => {
          return {
            ...prevState,
            locations: placesArray,
          };
        });
      });
    this.locationsSubscriber = this.locationsSubscriber.bind(this);
  }

  async componentDidMount() {
    //requests user permission for location
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('whenInUse').then((res) => {
        console.log('authorization result:', res);
      });
    }
    this.getUserLocation();
    // checking if user is already signed in w/ Google
    const user = await getCurrentUserInfo();
    if (user) {
      this.setState({
        email: user.email,
      });
      console.log('Signed in silently with Google!');
      await this.getUserFavorites();
    }
    await this.getFirestoreLocations();
  }

  componentWillUnmount() {
    this.locationsSubscriber = '';
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
    let placesArray = [];
    const snapshot = await firestore().collection('locations').get();
    snapshot.docs.map((doc) => {
      let docObj = doc.data();
      if (
        //narrows geographic range of what is rendered
        //to be in user's general area
        this.state.userCoords[1] - docObj.coordinates.latitude > -0.1 &&
        this.state.userCoords[1] - docObj.coordinates.latitude < 0.1 &&
        this.state.userCoords[0] - docObj.coordinates.longitude > -0.1 &&
        this.state.userCoords[0] - docObj.coordinates.longitude < 0.1
      ) {
        placesArray.push(docObj);
      }
    });
    this.setState((prevState) => {
      return {
        ...prevState,
        locations: placesArray,
      };
    });
  }

  async handleSignIn() {
    try {
      const { userInfo } = await signIn();
      if (userInfo) {
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
    //if user is already in firestore
    const snapshot = await firestore()
      .collection('users')
      .doc(this.state.email)
      .get();
    if (snapshot.exists) {
      return await Promise.all(
        snapshot.data().favorites.map(async (location) => {
          this.setState((prevState) => {
            return {
              ...prevState,
              favorites: [...prevState.favorites, location],
            };
          });
        })
      );
    } else {
      //if user is not already in firestore,
      //create an account w/ user email from this.state
      if (this.state.email !== null) {
        const data = {
          favorites: [],
        };
        const res = await firestore()
          .collection('users')
          .doc(this.state.email)
          .set(data);
      }
    }
  }


  setFormInState() {
    if (this.props.route.params.modalObject) {
      this.setState({ modalObject: this.props.route.params.modalObject })
    }
  }

  setModalToNull () {
    this.setState({ modalObject: null, currentLocation: null })
   }

  setModalVisible = (index = null) => {
    if (index) {
      this.setState({ currentLocation: this.state.locations[index] });
    }
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  myRef = React.createRef();

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.cameraButton}>
          <Icon.Button
            name="camera-retro"
            size={29}
            color="#a0a8b6"
            backgroundColor="#364f77"
            onPress={() => this.props.navigation.navigate('Camera', {setModalVisible: this.setModalVisible, setFormInState: this.setFormInState})}
          />
        </View>
        {this.state.email ? (
          <View style={styles.heartButton}>
            <Icon.Button
              name="heart"
              size={30}
              color="#a0a8b6"
              backgroundColor={this.state.favoriteClick ? '#c22f72' : '#364f77'}
              onPress={() =>
                this.setState({ favoriteClick: !this.state.favoriteClick })
              }
            />
          </View>
        ) : (
          <View style={styles.userButton}>
            <Icon.Button
              name="user"
              size={39}
              color="#a0a8b6"
              backgroundColor="#364f77"
              onPress={this.handleSignIn}
            />
          </View>
        )}

        {this.state.userCoords ? (
          <MapboxGL.MapView
            styleURL={MapboxGL.StyleURL.Street}
            zoomLevel={16}
            centerCoordinate={this.state.userCoords}
            showUserLocation={true}
            style={styles.map}
          >
            <MapboxGL.Camera
              zoomLevel={16}
              centerCoordinate={this.state.userCoords}
            ></MapboxGL.Camera>
            <RenderAnnotation
              source={'user'}
              coordinates={this.state.userCoords}
              setModal={this.setModalVisible}
            />
            {this.state.locations.length > 0 &&
              this.state.locations.map((location, idx) => {
                return (
                  <RenderAnnotation
                    key={idx}
                    source="firestore"
                    coordinates={[
                      location.coordinates.longitude,
                      location.coordinates.latitude,
                    ]}
                    idx={idx}
                    setModal={this.setModalVisible}
                  />
                );
              })}

            {this.state.modalObject && 
              <ParentModal objectDetails={this.props.route.params.modalObject} modalState={this.state.modalVisible} setModal={this.setModalVisible} setModalToNull={this.setModalToNull} />
            }
              {this.state.currentLocation && <ParentModal modalState={this.state.modalVisible} setModal={this.setModalVisible} setModalToNull={this.setModalToNull} userInfo={this.state.userInfo} currentLocation={this.state.currentLocation} />}

          </MapboxGL.MapView>
        ) : (
          <Text>Loading...</Text>
        )}
        {this.state.email && this.state.favoriteClick ? (
          <BottomSheet
            ref={this.myRef}
            snapPoints={[800, 125]}
            renderHeader={renderHeader}
            renderContent={() =>
              renderInnerFavorites(this.state.favorites, this.state.email)
            }
            initialSnap={1}
          />
        ) : (
          <BottomSheet
            ref={this.myRef}
            snapPoints={[800, 125]}
            renderHeader={renderHeader}
            renderContent={() =>
              renderInner(this.state.locations, this.state.email)
            }
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
    display: 'flex',
    alignSelf: 'flex-end',
  },
  userButton: {
    position: 'absolute',
    top: '11%',
    alignSelf: 'flex-end',
  },
  heartButton: {
    position: 'absolute',
    top: '12%',
    alignSelf: 'flex-end',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default App;
