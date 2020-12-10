import React from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { View } from 'react-native';

const RenderAnnotation = (props) => {
  let color = props.source === 'user' ? '#023e8a' : '#00b4d8';
  return (
    <MapboxGL.PointAnnotation
      key={`${props.source}${props.idx}`}
      id={`${props.source}Annotation`}
      coordinate={props.coordinates}
      onSelected={props.setModal}
    >
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

export default RenderAnnotation;
