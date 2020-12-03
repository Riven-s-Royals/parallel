const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient();

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */
async function quickstart() {
  const fileName =
    '/Users/brandieburditt/Downloads/Eiffel-Tower-4c710a32fca4406c81f49815312339c7.jpg';

  // Performs landmark detection on the local file
  const [result] = await client.landmarkDetection(fileName);
  const landmarks = result.landmarkAnnotations;
  console.log('Landmarks:');
  landmarks.forEach((landmark) => console.log(landmark.locations));
}

quickstart();
