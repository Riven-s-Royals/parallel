// import { StatusBar } from 'expo-status-bar';
// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Platform } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiYnVyZGl0dGIiLCJhIjoiY2tmd3BjeDNoMW1iODJ5cWd3aG16ejR1NyJ9.6SP4_hBVmB2eXIQI_PXHtA'
);

export default App = () => {
  return (
    <View style={{ flex: 1, height: '100%', width: '100%' }}>
      <MapboxGL.MapView
        styleURL={MapboxGL.StyleURL.Street}
        zoomLevel={16}
        centerCoordinate={[3.33624, 6.57901]}
        showUserLocation={true}
        style={{ flex: 1 }}
      >
        <MapboxGL.Camera
          zoomLevel={16}
          centerCoordinate={[3.33624, 6.57901]}
        ></MapboxGL.Camera>
      </MapboxGL.MapView>
    </View>
  );
};
