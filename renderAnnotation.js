import React from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { View } from 'react-native';

const RenderAnnotation = (props) => {
  let color = props.source === 'user' ? '#c22f72' : '#364f77';
  return (
    <MapboxGL.PointAnnotation
      key={`${props.source}${props.idx}`}
      id={`${props.source}Annotation`}
      coordinate={props.coordinates}
      onSelected={ () => props.setModal(props.idx)}
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
