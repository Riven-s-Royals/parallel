import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { addToFavorites } from './storage';

const favoriteAndClose = (locationInfo, email, setModalCallback) => {
  addToFavorites(locationInfo, email);
  setModalCallback();
};

const goBack = (setModalCallback, setModalToNull) => {
  setModalCallback();
  setModalToNull();
};

const ParentModal = (props) => {
  let image = props.objectDetails
    ? { uri: props.objectDetails.image }
    : { uri: props.currentLocation.img };
  let name = props.objectDetails
    ? props.objectDetails.name
    : props.currentLocation.name;
  let description = props.objectDetails
    ? props.objectDetails.description
    : props.currentLocation.description;
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={props.modalState}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
      >
        <Image style={styles.image} source={image} />

        <Text style={styles.titleText}>{name}</Text>

        <Text style={styles.descriptionText}>{description}</Text>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => goBack(props.setModal, props.setModalToNull)}
        >
          <Text style={styles.closeText}>Go Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favoritesButton}
          onPress={() =>
            favoriteAndClose(props.currentLocation, props.email, props.setModal)
          }
        >
          <Text style={styles.buttonText}>Add To Favorites</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoritesButton: {
    display: 'flex',
    height: 60,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#00479e',
    shadowColor: 'darkblue',
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 25,
  },
  closeButton: {
    display: 'flex',
    height: 60,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a0a8b6',
    shadowColor: 'darkblue',
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 25,
    marginBottom: 10,
  },
  buttonText: {
    color: '#a0a8b6',
    fontSize: 22,
  },
  image: {
    marginTop: 90,
    marginBottom: 10,
    width: '100%',
    height: 350,
    borderRadius: 72,
  },
  titleText: {
    fontSize: 24,
    marginBottom: 5,
    padding: 20,
  },
  descriptionText: {
    fontSize: 15,
    marginBottom: 5,
    padding: 20,
  },
  closeText: {
    fontSize: 24,
    color: '#00479e',
    textAlign: 'center',
  },
});

export default ParentModal;
