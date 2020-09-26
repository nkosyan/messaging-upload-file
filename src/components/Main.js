import React, { useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const Main = (props) => {
  const [name, setName] = useState();

  return <View>
    <Text style={styles.title}>Enter your name:</Text>
    <TextInput
      style={styles.nameInput}
      placeholder='name'
      value={name}
      onChangeText={val => setName(val)}
    />
    <Button
      title='Join'
      onPress={() => props.navigation.navigate('Conversation', { name })}
    />
  </View>;
}

const offset = 24;
const styles = StyleSheet.create({
  title: {
    marginTop: offset,
    marginLeft: offset,
    fontSize: offset,
  },
  nameInput: {
    height: offset * 2,
    margin: offset,
    paddingHorizontal: offset,
    borderColor: '#111111',
    borderWidth: 1,
  },
});

export default Main;
