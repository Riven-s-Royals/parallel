import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

export const uploadImageToStorage = async (path, imageName) => {
  try {
    let reference = storage().ref(imageName);
    await reference.putFile(path);
    let pathToImage = await reference.getDownloadURL();
    return pathToImage;
  } catch (error) {
    console.log('Error uploading image to storage:', error);
  }
};

export const addToFavorites = async (locationInfo, email) => {
  //adds location info to users firestore favorites
  try {
    const res = await firestore()
      .collection('users')
      .doc(email)
      .update({
        favorites: firestore.FieldValue.arrayUnion(locationInfo),
      });
  } catch (error) {
    console.log('Error adding location to favorites:', error);
  }
};

