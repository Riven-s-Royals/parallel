import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { addToFavorites } from './storage';

export const renderHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );
};

export const renderInner = (allPointsArray, email) => {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Swipe Up To Explore!</Text>
      <FlatList
        data={allPointsArray}
        renderItem={(individualPoint) =>
          renderItemComponent(individualPoint, email)
        }
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={(individualPoint) => individualPoint.name}
      />
    </View>
  );
};

export const renderInnerFavorites = (allPointsArray, email) => {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>
        {allPointsArray.length > 0
          ? 'Swipe Up To See Your Favorites!'
          : 'No Favorites (Yet!)'}
      </Text>
      {allPointsArray.length > 0 && (
        <FlatList
          data={allPointsArray}
          renderItem={(individualPoint) =>
            renderItemComponent(individualPoint, email)
          }
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={(individualPoint) => individualPoint.name}
        />
      )}
    </View>
  );
};

const renderItemComponent = (item, email) => {
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
        {'\n'}
        {'\n'}
        {individualItem.description}
        {'\n'}
        {'\n'}
      </Text>
      {email && (
        <View style={styles.heartButton}>
          <Icon.Button
            name="heart"
            size={25}
            color="dimgrey"
            backgroundColor="#f7f5eee8"
            onPress={() => addToFavorites(individualItem, email)}
          />
        </View>
      )}
    </View>
  );
};

const ItemSeparator = () => {
  return (
    <View
      style={{
        height: 2,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginBottom: 5,
      }}
    />
  );
};

const styles = StyleSheet.create({
  panel: {
    height: 800,
    padding: 20,
    backgroundColor: '#f7f5eee8',
  },
  header: {
    backgroundColor: '#f7f5eee8',
    shadowColor: '#000000',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: -10,
  },
  panelTitle: {
    fontSize: 20,
    height: 85,
    textAlign: 'center',
  },
  image: {
    height: '100%',
    borderRadius: 4,
  },
  container: {
    height: 300,
    margin: 10,
    backgroundColor: '#FFF',
    borderRadius: 6,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.8,
      },
    }),
  },
  heartButton: {
    alignSelf: 'flex-end',
    marginBottom: '2%',
  },
});
