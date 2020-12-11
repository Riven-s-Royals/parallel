import React, { useState } from 'react';
import { Text, TextInput, View, Button, Alert } from 'react-native';
import { uploadImageToStorage } from './storage';
import Geolocation from 'react-native-geolocation-service';
import firestore, { GeoPoint } from '@react-native-firebase/firestore';

export class Fields extends React.Component {
  constructor(props) {
    super (props)
    this.state = {
      name: '',
      description: '',
      userCoords: [],
      modalVisible: false
    }
    this.getUserLocation = this.getUserLocation.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('whenInUse').then((res) => {
        console.log('authorization result:', res);
      });
    }
    if (Platform.OS === 'android') {
      this.requestPermission();
    } else {
      this.getUserLocation();
    }
  }

  getUserLocation () {
    return Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          userCoords: [ position.coords.latitude, position.coords.longitude ],
        });
      },
      (error) => {
        console.log('getUserLocation error:', error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  async handleSubmit (image,name,description) {
    const imgName = 'location' + '-' + Date.now() + '.jpg'
    const imagePath = await uploadImageToStorage(image, imgName);
    const lowerCaseName = name.toLowerCase()
    await firestore() 
    .collection('locations')
    .doc(lowerCaseName)
    .set({
      coordinates: new firestore.GeoPoint(this.state.userCoords[0],this.state.userCoords[1]),
      description: description,
      img: imagePath,
      name: name,
    })
    .then(() => {
      this.props.navigation.navigate('Parallel')
      setTimeout(this.props.renderModal,1000)
    })
  }

  render () {
    return (
      <View style={{padding: 10}}>
          <Text style={{padding:5}}>Name:</Text>
          <TextInput
              style={{height: 30, backgroundColor: '#F5FFFA', borderWidth: .5, borderRadius: 13, padding: 5}}
              placeholder="  Enter Name Here"
              multiline={true}
              onChangeText={name => this.setState({...this.state, name: name})}
              defaultValue={this.state.name}
          />
          <Text style={{padding:5}}>Description:</Text>
          <TextInput
              style={{height: 30, backgroundColor: '#F5FFFA', borderWidth: .5, borderRadius: 13, padding: 5}}
              multiline={true}
              placeholder=" Enter Description Here"
              onChangeText={description => this.setState({...this.state, description: description})}
              defaultValue={this.state.description}
          />
          <Button onPress={()=>this.handleSubmit(this.props.image,this.state.name,this.state.description)} title='Submit'>Submit</Button>
      </View>
    );
  }
}




















