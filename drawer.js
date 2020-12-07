import React from "react";
import {
  StyleSheet,
  View,
  Platform,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Constants from "expo-constants";
import { max } from "react-native-reanimated";
import { List, ListItem } from "react-native-elements";

// renderInner = () => (
//   <View style={styles.panel}>
//     <Text style={styles.panelTitle}>Swipe Up To Explore!</Text>
//     {/* <Text style={styles.panelSubtitle}>So Much</Text> */}
//     <Image style={styles.photo} source={require("./assets/wakeupcat.jpg")} />
//     <ScrollView style={styles.scrollView}>
//       <Text style={styles.scrollText}>First Text Box</Text>
//       <Text style={styles.scrollText}>Second Text Box</Text>
//       <Text style={styles.scrollText}>Third Text Box</Text>
//       <Text style={styles.scrollText}>Fourth Text Box</Text>
//       <Text style={styles.scrollText}>Fifth Text Box</Text>
//       <Text style={styles.scrollText}>Sixth Text Box</Text>
//       <Text style={styles.scrollText}>Seventh Text Box</Text>
//       <Text style={styles.scrollText}>Eighth Text Box</Text>
//       <Text style={styles.scrollText}>Ninth Text Box</Text>
//       <Text style={styles.scrollText}>Tenth Text Box</Text>
//     </ScrollView>
//   </View>
// );

// renderInner = () => (
//   <View style={styles.panel}>
//     <Text style={styles.panelTitle}>Swipe Up To Explore!</Text>
//   {/* <List>
//     <FlatList
//     data={this.state.foursquare}
//     renderItem={({ item }) => (
//       <ListItem
//       title={`${item.name}`}
//       />
//     )}
//     />
//   </List> */}
//   </View>
// );
export const renderHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );
};

export const renderInner = (data) => {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Swipe Up To Explore!</Text>
      <FlatList
        data={data}
        renderItem={ () => renderItemComponent(data)}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const renderItemComponent = (itemData) => {
    return (
  <TouchableOpacity style={styles.container}>

  </TouchableOpacity>
    )
}

const ItemSeparator = () => {
    return (
    <View
      style={{
        height: 2,
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    />
    )

}

const styles = StyleSheet.create({
  panelContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  panel: {
    height: 800,
    padding: 20,
    backgroundColor: "#f7f5eee8",
  },
  header: {
    backgroundColor: "#f7f5eee8",
    shadowColor: "#000000",
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: -10,
  },
  panelTitle: {
    fontSize: 20,
    height: 35,
    textAlign: "center",
  },
  panelSubtitle: {
    fontSize: 14,
    color: "black",
    height: 30,
    marginTop: 30,
    marginBottom: 10,
  },
  photo: {
    width: "100%",
    height: 300,
    marginTop: 50,
  },
  scrollContainer: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  scrollView: {
    backgroundColor: "pink",
    marginHorizontal: 20,
  },
  scrollText: {
    fontSize: 42,
  },
  image: {
    height: "100%",
    borderRadius: 4,
  },
  container: {
    height: 300,
    margin: 10,
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
});
