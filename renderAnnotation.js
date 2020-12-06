import React from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { View } from 'react-native';

const renderAnnotation = (source, coordinates) => {
  let color = source === 'user' ? '#023e8a' : '#00b4d8';
  return (
    <MapboxGL.PointAnnotation coordinate={coordinates}>
      <View
        style={{
          height: 20,
          width: 20,
          backgroundColor: color,
          borderRadius: 50,
          borderColor: '#fff',
          borderWidth: 2,
        }}
      />
    </MapboxGL.PointAnnotation>
  );
};

export default renderAnnotation;
