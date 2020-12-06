import { NavigationContext } from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  AppRegistry,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import storage from '@react-native-firebase/storage';

class Camera extends React.Component {
  constructor() {
    super();
    this.state = {
      imageUri: '',
    };
  }
  render() {
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

  takePicture = async () => {
    try {
      if (this.camera) {
        const options = { quality: 0.5, base64: true };
        const data = await this.camera.takePictureAsync(options);
        console.log(data.uri);
        this.setState({ imageUri: data.uri });
        uploadImageToStorage(
          this.state.imageUri,
          'location' + '-' + Date.now() + '.jpg'
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
}

const uploadImageToStorage = (path, imageName) => {
  let reference = storage().ref(imageName); // 2
  let task = reference.putFile(path); // 3

  task
    .then(() => {
      // 4
      console.log('Image uploaded to the bucket!');
    })
    .catch((e) => console.log('uploading image error => ', e));
};

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
});

export default Camera;
