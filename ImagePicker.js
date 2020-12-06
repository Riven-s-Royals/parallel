import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  Image,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  Text,
} from 'react-native';
import storage from '@google-cloud/storage';
import ImagePicker from 'react-native-image-picker';
export default class ImageSelector extends React.Component {
  state = {
    // placeholder image
    imagePath: require('./img/default.jpg'),
  };

  chooseFile = () => {
    var options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true, // do not backup to iCloud
        path: 'images', // store camera images under Pictures/images for android and Documents/images for iOS
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker', storage());
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let path = this.getPlatformPath(response).value;
        let fileName = this.getFileName(response.fileName, path);
        this.setState({ imagePath: path });
      }
    });
  };

  /**
   * Get the file name and handle the invalid null case
   */
  getFileName(name, path) {
    if (name != null) {
      return name;
    }

    if (Platform.OS === 'ios') {
      path = '~' + path.substring(path.indexOf('/Documents'));
    }
    return path.split('/').pop();
  }

  /**
   * Get platform specific value from response
   */
  getPlatformPath({ path, uri }) {
    return Platform.select({
      android: { value: path },
      ios: { value: uri },
    });
  }

  /**
   * Get platform-specific Uri with the required format
   */
  getPlatformURI(imagePath) {
    let imgSource = imagePath;
    if (isNaN(imagePath)) {
      imgSource = { uri: this.state.imagePath };
      if (Platform.OS == 'android') {
        imgSource.uri = 'file:///' + imgSource.uri;
      }
    }
    return imgSource;
  }

  render() {
    let { imagePath } = this.state;
    let imgSource = this.getPlatformURI(imagePath);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.imgContainer}>
          <Image style={styles.uploadImage} source={imgSource} />
          <View style={styles.eightyWidthStyle}>
            <Button title={'Upload Image'} onPress={this.chooseFile}></Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#e6e6fa',
  },
  imgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  eightyWidthStyle: {
    width: '80%',
    margin: 2,
  },
  uploadImage: {
    width: '80%',
    height: 300,
  },
});
