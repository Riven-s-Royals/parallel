import React, { useState, Component } from "react";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { View } from "react-native";

class RenderAnnotation extends React.Component {
  render() {
    let color = this.props.source === "user" ? "#023e8a" : "#00b4d8";
    console.log("PROPS IN RENDANO", this.props);
    return (
      <MapboxGL.PointAnnotation
        key={this.props.idx}
        id={`${this.props.source}Annotation`}
        coordinate={this.props.coordinates}
        onSelected={() => this.props.setModal()}
      >
        <View
          style={{
            height: 20,
            width: 20,
            backgroundColor: color,
            borderRadius: 50,
            borderColor: "#fff",
            borderWidth: 2,
          }}
        />
      </MapboxGL.PointAnnotation>
    );
  }
}

export default RenderAnnotation;
