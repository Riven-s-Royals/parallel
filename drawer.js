import React from "react";
import {
  StyleSheet,
  View,
  Platform,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";

export const renderHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );
};

export const renderInner = (allPointsArray) => {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Swipe Up To Explore!</Text>
      <FlatList
        data={allPointsArray}
        renderItem={(individualPoint) => renderItemComponent(individualPoint)}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={(individualPoint) => individualPoint.name}
      />
    </View>
  );
};

const renderItemComponent = (item) => {
  let individualItem = item.item;
  return (
    <View>
      <TouchableOpacity style={styles.container}>
        <Image
          style={styles.image}
          source={{
            uri: individualItem.img,
          }}
        />
      </TouchableOpacity>

      <Text>{individualItem.name}</Text>
      <Text>
        {"\n"}
        {"\n"}
        {individualItem.description}
        {"\n"}
        {"\n"}
      </Text>
    </View>
  );
};

const ItemSeparator = () => {
  return (
    <View
      style={{
        height: 2,
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        marginBottom: 5,
      }}
    />
  );
};

const styles = StyleSheet.create({
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
    height: 85,
    textAlign: "center",
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
