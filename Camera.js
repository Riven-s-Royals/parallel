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
        uploadToStorage(this.state.imageUri);
      }
    } catch (error) {
      console.error(error);
    }
  };
}

// const uploadImage = (path, mime = 'application/octet-stream') => {
//   return new Promise((resolve, reject) => {
//     const imageRef = storage()
//       .ref('parallel-app-capstone')
//       .child('filename.jpg');

//     return imageRef
//       .put(path, { contentType: mime })
//       .then(() => {
//         return imageRef.getDownloadURL();
//       })
//       .then((url) => {
//         resolve(url);
//       })
//       .catch((error) => {
//         reject(error);
//         console.log('Error uploading image: ', error);
//       });
//   });
// };
uploadToStorage = (imageUri) => {
  var data = new FormData();

  data.append('file', {
    uri: imageUri,
    name: 'location' + '-' + Date.now() + '.jpg',
    type: 'image/jpg',
  });
  // Create the config object for the POST
  const config = {
    action: 'https://storage.googleapis.com/parallel-app-capstone',
    method: 'post',
    enctype: 'multipart/form-data',
    body: data,
  };
  fetch('https://storage.googleapis.com/parallel-app-capstone', config)
    .then((responseData) => {
      // Log the response form the server
      console.log('response from server', responseData);
    })
    .catch((err) => {
      console.log('Error sending picture to storage:', err);
    });
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
