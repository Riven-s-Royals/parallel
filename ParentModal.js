import React from "react";
import { View, Image, Text,  StyleSheet, Modal, TouchableHighlight } from "react-native";

const ParentModal = (props) => {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.modalState}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.container}>
              <Image
                style={styles.image}
                source={require("./assets/wakeupcat.jpg")}
              />
            </View>
            <View style={styles.descriptionText}>
            <Text>Name of Point{"\n"}{"\n"}</Text>

            <Text>Description of Point Description of PointDescription of PointDescription of PointDescription of PointDescription of PointDescription of PointDescription of PointDescription of PointDescription of PointDescription of PointDescription of PointDescription of PointDescription of PointDescription of Point</Text>
            </View>

            <TouchableHighlight
              style={styles.buttonDesign}
              onPress={
                props.setModal
              }
            >
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.buttonDesign}
              onPress={
                props.setModal
              }
            >
              <Text style={styles.buttonText}>Add To Favorites</Text>
            </TouchableHighlight>
          </View>
        </View>
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
centeredView: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    // marginTop: 22,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  modalView: {
    margin: 20,
    backgroundColor: "#364f77",
    borderRadius: 20,
    padding: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  descriptionText: {
    marginBottom: 50,
    textAlign: "center",
    marginTop: 100
  },
  container: {
    flex: 1,
    height: 115,
    // margin: 10,
    marginTop:50,
    marginBottom:0,
    backgroundColor: "#FFF",
    borderRadius: 6,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowColor: "black",
        shadowOpacity: 0.8,
      },
    }),
    
  },
  image: {
    height: 350,
    borderRadius: 4,
    // marginTop: 150
    
  },
  buttonDesign: {
    backgroundColor: "#a0a8b6",
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom:20,
    // marginTop:10
    // elevation: 8,
  },
  buttonText: {
    color: "white",
  },
});

export default ParentModal;
