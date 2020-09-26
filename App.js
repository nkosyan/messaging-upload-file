import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './src/components/Main';
import Conversation from './src/components/Conversation';

const Stack = createStackNavigator();

const App = () => <NavigationContainer>
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen name="Main" component={Main} />
    <Stack.Screen name="Conversation" component={Conversation} />
  </Stack.Navigator>
</NavigationContainer>;

export default App;
