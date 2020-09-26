import React from 'react';
import { Actions, GiftedChat } from 'react-native-gifted-chat';
import { Image, Platform, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-picker';

import Firebase from '../utils/Firebase';

class Conversation extends React.Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    Firebase.shared.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }
  componentWillUnmount() {
    Firebase.shared.off();
  }

  get user() {
    return {
      name: this.props.route.params.name,
      _id: Firebase.shared.uid,
    };
  }

  selectImage = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.showImagePicker(options, response => {
      if (!response.didCancel && !response.error && !response.customButton) {
        const { path, uri, fileName } = response;
        const image = Platform.OS === 'android' ? path : uri;
        this.setState({ image, uri, fileName });
      }
    });
  };

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={message => {
          Firebase.shared.send(this.state.uri
            ? { ...message[0], fileName: this.state.fileName, uri: this.state.uri }
            : message[0]);
          this.setState({ uri: undefined });
        }}
        user={this.user}
        renderActions={args => <Actions
          {...args}
          options={{
            ['Send Image']: () => this.selectImage(),
          }}
          icon={() => <Image source={{ uri: this.state.uri }} style={styles.imageBox} />}
        />}
      />
    );
  }
}

const styles = StyleSheet.create({
  imageBox: {
    width: 200,
    height: 200
  }
});

export default Conversation;
