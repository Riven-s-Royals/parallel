import storage from '@react-native-firebase/storage';

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

//obsolete retrieval function

// export const retrieveImage = async (img) => {
//   const ref = storage().ref(`/${img}`);
//   const url = await ref.getDownloadURL();
//   console.log('url from storage:', url);
//   return url;
// };

