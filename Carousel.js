// import Carousel from 'react-native-snap-carousel';
// import React from 'react';
// import { useRef, useEffect } from 'react';
// import {
//   StyleSheet,
//   View,
//   Image,
//   Platform,
//   Text,
//   TouchableOpacity,
//   AppRegistry,
//   Alert,
//   Animated,
// } from 'react-native';

// export default class LoadingCarousel extends Component {
//     constructor(props){
//         super(props);
//         this.state = {
//           activeIndex:0,
//           carouselItems: [
//           {
//               title:"Colosseum",
//               text: "Rome, Italy",
//               img:'./assets/coliseum_slide500px.jpg'
//           },
//           {
//               title:"Eiffel Tower",
//               text: "Paris, France",
//               img:'./assets/eiffel_tower_slide500px.jpg'
//           },
//           {
//               title:"Taj Mahal",
//               text: "Agra, India",
//               img:'./assets/taj_mahal_slide500px.jpg'
//           },
//         ]
//       }
//     }

//     _renderItem({item,index}){
//         return (
//           <View style={{
//               backgroundColor:'floralwhite',
//               borderRadius: 5,
//               height: 250,
//               padding: 50,
//               marginLeft: 25,
//               marginRight: 25, }}>
//             <Text style={{fontSize: 30}}>{item.title}</Text>
//             <Text>{item.text}</Text>
//           </View>

//         )
//     }

//     render() {
//         return (
//         //   <SafeAreaView style={{flex: 1, backgroundColor:'rebeccapurple', paddingTop: 50, }}>
//             <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', }}>
//                 <Carousel
//                     autoplay={true}
//                     lockScrollWhileSnapping={true}
//                     enableMomentum={false}
//                     layout={"default"}
//                     ref={ref => this.carousel = ref}
//                     data={this.state.carouselItems}
//                     sliderWidth={300}
//                     itemWidth={300}
//                     renderItem={this._renderItem}
//                     onSnapToItem = { index => this.setState({activeIndex:index}) } />
//             </View>
//         //   </SafeAreaView>
//         );
//     }
// }

// // const styles = StyleSheet.create({
// //     slide: {
// //       flex: 1,
// //       flexDirection: 'column',
// //       backgroundColor: 'black',
// //     },
// //     title: {

// //     }
// // })