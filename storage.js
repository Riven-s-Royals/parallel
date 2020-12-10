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
  const data = locationInfo;
  // const res = await firestore()
  //   .collection('users')
  //   .doc(email)
  //   .set(
  //     {
  //       favorites: [...favorites, data],
  //     },
  //     { merge: true }
  //   );
  // console.log('res?', res);
};
