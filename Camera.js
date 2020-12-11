import React, { useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  AppRegistry,
  Alert,
  Animated,
  Modal,
  TouchableHighlight,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { uploadImageToStorage } from './storage';
import ml from '@react-native-firebase/ml';
import {Fields} from './LandmarkForm'
import {LoadingCarousel} from './Carousel'

const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
};

class Camera extends React.Component {
  constructor() {
    super();
    this.state = {
      imageUri: '',
      isVisible: false,
      modalVisible: false,
    };
    this.takePicture = this.takePicture.bind(this);
    this.renderModal = this.renderModal.bind(this);
  }

  landmarkAlert (locations) {
    Alert.alert(`Landmark: ${locations[0].landmark}`)
  }

  renderModal () {
    this.props.route.params.setModalVisible()
  }

  takePicture = async () => {
    try {
      if (this.camera) {
        this.setState({ isVisible: true })
        const options = { quality: 0.5, base64: true };
        const data = await this.camera.takePictureAsync(options);
        console.log(data.uri);
        this.setState({ imageUri: data.uri });
        setTimeout(()=>this.setState({isVisible: false}),5000)
        // const landmarks = await processLandmarks(data.uri)
        // const landmarks = await processLandmarks('/Users/jamesgill/Downloads/bean_dawn_5d5624c9-38bc-42c6-a0bc-3b84be7dca9b.jpg')
        // console.log(landmarks)
        const landmarks = [];
        if (landmarks.length > 0) {
          this.landmarkAlert(landmarks)
        } else {
          this.setState({modalVisible: true})
        }
      }
    } catch (error) {
        console.error(error);
    }
  };
  
render() {
    const { modalVisible } = this.state;
    if(modalVisible)
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Enter Landmark Information Here</Text>
              <Fields renderModal={this.renderModal} navigation={this.props.navigation} image={this.state.imageUri} />
              </View>
            </View>
          </Modal>

          <TouchableHighlight
            style={styles.openButton}
            onPress={() => {
              this.setModalVisible(true);
            }}
          >
            <Text style={styles.textStyle}>Show Modal</Text>
          </TouchableHighlight>
        </View>
      );
    if (this.state.isVisible)
      return (
        <FadeInView style={styles.loading}>
          <LoadingCarousel />
          <Image resizeMode='contain' style={styles.logo} source={require('./assets/parallel_mock_logo2.png')}/>
        </FadeInView>)
    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          captureAudio={false}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
        />
        <View
          style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}
        >
          <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            style={styles.capture}
          >
            <Text style={{ fontSize: 14 }}> SNAP </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

async function processLandmarks(localPath) {
  const landmarks = await ml().cloudLandmarkRecognizerProcessImage(localPath);
  // landmarks.forEach(landmark => {
  //   console.log('Landmark name: ', landmark.landmark);
  // //   console.log('Landmark locations: ', block.locations);
  // //   console.log('Confidence score: ', block.confidence);
  // });
  // console.log('LANDMARKS INSIDE FUNCTION', landmarks)
  return landmarks;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
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
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  loading: {
    flex: 1,
    backgroundColor: '#0053df',
  },
  logo: {
    flex: 1,
    alignSelf: 'center',
    height: 350,
    width: 350,
  },
});

export default Camera;
