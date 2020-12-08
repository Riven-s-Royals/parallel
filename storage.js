import storage from '@react-native-firebase/storage';

export const uploadImageToStorage = (path, imageName) => {
  let reference = storage().ref(imageName);
  let task = reference.putFile(path);
  task
    .then(async () => {
      console.log('Image uploaded to the bucket!');
      const pathToFile = await reference.getDownloadURL();
      return pathToFile;
    })
    .catch((e) => console.log('Error uploading image to storage:', e));
};

//obsolete retrieval function

// export const retrieveImage = async (img) => {
//   const ref = storage().ref(`/${img}`);
//   const url = await ref.getDownloadURL();
//   console.log('url from storage:', url);
//   return url;
// };
