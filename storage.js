import storage from '@react-native-firebase/storage';

export const uploadImageToStorage = (path, imageName) => {
  let reference = storage().ref(imageName);
  let task = reference.putFile(path);
  task
    .then(async () => {
      console.log('Image uploaded to the bucket!');
      console.log('name for retrieval function:', imageName);
      const pathToFile = await reference.getDownloadURL();
      return pathToFile
    })
    .catch((e) => console.log('Error uploading image to storage:', e));
};

export const retrieveImage = async (img) => {
  try {
    const ref = await storage().ref(`/${img}`);
    const url = await ref.getDownloadURL();
    return url;
    
  } catch (error) {
    console.log(error)
  }
};
