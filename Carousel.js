import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import React, { useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  AppRegistry,
  Alert,
  Animated,
  Modal,
  TouchableHighlight,
  ImageBackground,
  Dimensions
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window')

export class LoadingCarousel extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          activeIndex:0,
          carouselItems: [
          {
              title:"Colosseum",
              text: "Rome, Italy",
              img: 'https://i.ibb.co/RcJbqh6/coliseum-slide500px.jpg'
          },
          {
              title:"Eiffel Tower",
              text: "Paris, France",
              img: 'https://i.ibb.co/HHXnpQP/eiffel-tower-slide500px.jpg'
          },
          {
              title:"Taj Mahal",
              text: "Angra, India",
              img: 'https://i.ibb.co/H294z07/taj-mahal-slide500px.jpgs'
          },
        ]
      }
    }

    _renderItem = ({item, index}, parallaxProps) => {
        return (
            <View style={{
                flex: 1,
                borderRadius: 5,
                height: 200,
                // padding: 50,
                // marginLeft: 25,
                // marginRight: 25, 
            }}>
                <ParallaxImage
                    source={{ uri: item.img }}
                    containerStyle={styles.imageContainer}
                    style={styles.image}
                    parallaxFactor={0.4}
                    {...parallaxProps}
                />
                <Text style={{position: 'absolute', fontSize: 30, left: 5, bottom: 20, color:'#ffffff'}}>{item.title}</Text>
                <Text style={{position: 'absolute', left: 5, bottom: 5, color:'#ffffff'}}>{item.text}</Text>
            </View>
        );
    }

    render () {
        return (
            <View style={{ height: screenWidth - 60, width: screenWidth - 60, marginTop: 50 }}>
                <Carousel
                    hasParallaxImages={true}
                    autoplay={true}
                    autoplayDelay={500}
                    autoplayInterval={1500}
                    loop={true}
                    enableMomentum={false}
                    lockScrollWhileSnapping={true}
                    layout={"default"}
                    ref={ref => this.carousel = ref}
                    data={this.state.carouselItems}
                    sliderWidth={screenWidth}
                    sliderHeight={screenWidth}
                    itemWidth={screenWidth - 60}
                    renderItem={this._renderItem}
                    onSnapToItem = { index => this.setState({activeIndex:index}) } 
                    />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
        // backgroundColor: 'white',
        borderRadius: 8,
      },
      image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'contain',
      },
})