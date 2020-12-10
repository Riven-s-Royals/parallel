import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Modal,
  TouchableHighlight,
} from "react-native";

const ParentModal = (props) => {
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.modalState}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <Image
          style={styles.image}
          source={require("./assets/wakeupcat.jpg")}
        />

        <Text style={styles.text}>Name of Point</Text>

        <Text style={styles.text}>
          Description of Point Description of PointDescription of
          PointDescription of PointDescription of PointDescription of
          PointDescription of PointDescription of PointDescription of
          PointDescription of PointDescription of PointDescription of
          PointDescription of PointDescription of PointDescription of Point
        </Text>

        <TouchableHighlight style={styles.closeButton} onPress={props.setModal}>
          <Text style={styles.closeText}>Go Back</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={props.setModal}>
          <Text style={styles.buttonText}>Add To Favorites</Text>
        </TouchableHighlight>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  //   centeredView: {
  //     flex: 1,
  //     justifyContent: "center",
  //     // alignItems: "center",
  //     // marginTop: 22,
  //     borderTopLeftRadius: 10,
  //     borderTopRightRadius: 10,
  //     overflow: 'hidden',
  //   },
  //   modalView: {
  //     margin: 20,
  //     backgroundColor: "#364f77",
  //     borderRadius: 20,
  //     padding: 5,
  //     alignItems: "center",
  //     shadowColor: "#000",
  //     shadowOffset: {
  //       width: 0,
  //       height: 2,
  //     },
  //   },
  //   descriptionText: {
  //     marginBottom: 50,
  //     textAlign: "center",
  //     marginTop: 100
  //   },
  //   container: {
  //     flex: 1,
  //     height: 115,
  //     // margin: 10,
  //     marginTop:50,
  //     marginBottom:0,
  //     backgroundColor: "#FFF",
  //     borderRadius: 6,
  //     ...Platform.select({
  //       ios: {
  //         shadowOffset: { width: 0, height: 2 },
  //         shadowColor: "black",
  //         shadowOpacity: 0.8,
  //       },
  //     }),

  //   },
  //   image: {
  //     height: 350,
  //     borderRadius: 4,
  //     // marginTop: 150

  //   },
  //   buttonDesign: {
  //     backgroundColor: "#a0a8b6",
  //     borderRadius: 15,
  //     paddingVertical: 15,
  //     paddingHorizontal: 15,
  //     marginBottom:20,
  //     // marginTop:10
  //     // elevation: 8,
  //   },
  //   buttonText: {
  //     color: "white",
  //   },
  container: {
    padding: 25,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    display: "flex",
    height: 60,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#2AC062",
    shadowColor: "#2AC062",
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 25,
  },
  closeButton: {
    display: "flex",
    height: 60,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF3974",
    shadowColor: "#2AC062",
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 25,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 22,
  },
  image: {
    marginTop: 150,
    marginBottom: 10,
    width: "100%",
    height: 350,
  },
  text: {
    fontSize: 24,
    marginBottom: 30,
    padding: 40,
  },
  closeText: {
    fontSize: 24,
    color: "#00479e",
    textAlign: "center",
  },
});

export default ParentModal;
