import React, { useState } from 'react';
import { Text, TextInput, View, } from 'react-native';

export const Fields = () => {
  const [text, setText] = useState({name:'', description:''});
  return (
    <View style={{padding: 10}}>
        <Text style={{padding:5}}>Name:</Text>
        <TextInput
            style={{height: 30, backgroundColor: '#F5FFFA', borderWidth: .5, borderRadius: 13, padding: 5}}
            placeholder="  Enter Name Here"
            multiline={true}
            onChangeText={name => setText({...text, name: name})}
            defaultValue={text.name}
        />
        <Text style={{padding:5}}>Description:</Text>
        <TextInput
            style={{height: 30, backgroundColor: '#F5FFFA', borderWidth: .5, borderRadius: 13, padding: 5}}
            multiline={true}
            placeholder=" Enter Description Here"
            onChangeText={description => setText({...text, description: description})}
            defaultValue={text.description}
        />
    </View>
  );
}































// import React, { Component, useState } from 'react';
// import { Text, View, StyleSheet, TextInput, Button, Alert } from 'react-native';

// export default class LandmarkForm extends Component {
//     constructor() {
//         super()
//         this.state={
//             name: '',
//             description: ''
//         }
//         this.handleSubmit = this.handleSubmit.bind(this)
//     }

//     handleSubmit() {
//         console.log(this.state.name, this.state.description)
//         Alert.alert('Landmark Submitted!')
//     }

//     render() {
//         // const [value, onChangeText] = React.useState('Useless Placeholder');
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.paragraph}>Name:</Text>
//                 <TextInput
//                     style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
//                     onChangeText={text => this.setState({name: text})}
//                     value={this.state.name}
//                 />
//                 <Text style={styles.paragraph}>Description:</Text>
//                 <TextInput
//                     style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
//                     onChangeText={text=> this.setState({description: text})}
//                     value={this.state.description}
//                 />
//                 <Button onPress={()=>this.handleSubmit}>Submit New Landmark</Button>
//             </View>
//         )
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         justifyContent: 'center',
//         marginTop: 50,
//         padding: 20,
//         backgroundColor: '#ffffff',
//     },
//     paragraph: {
//         margin: 24,
//         fontSize: 18,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         color: '#34495e'
//     },
// })