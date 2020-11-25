import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Platform } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiYnVyZGl0dGIiLCJhIjoiY2tmd3BjeDNoMW1iODJ5cWd3aG16ejR1NyJ9.6SP4_hBVmB2eXIQI_PXHtA'
);

export default App = () => {
  const renderAnnotations = () => {
    return (
      <MapboxGL.PointAnnotation
        key="pointAnnotation"
        id="pointAnnotation"
        coordinate={[-74.00928918392906, 40.70562853006794]}
      >
        <View
          style={{
            height: 30,
            width: 30,
            backgroundColor: '#00cccc',
            borderRadius: 50,
            borderColor: '#fff',
            borderWidth: 3,
          }}
        />
      </MapboxGL.PointAnnotation>
    );
  };

  return (
    <View style={{ flex: 1, height: '100%', width: '100%' }}>
      <MapboxGL.MapView
        styleURL={MapboxGL.StyleURL.Street}
        zoomLevel={16}
        centerCoordinate={[-74.00928918392906, 40.70562853006794]}
        showUserLocation={true}
        style={{ flex: 1 }}
      >
        <MapboxGL.Camera
          zoomLevel={16}
          centerCoordinate={[-74.00928918392906, 40.70562853006794]}
        ></MapboxGL.Camera>
        {renderAnnotations()}
      </MapboxGL.MapView>
    </View>
  );
};
