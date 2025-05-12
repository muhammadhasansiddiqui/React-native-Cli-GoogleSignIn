// App.js
import React from 'react';
import { View } from 'react-native';
import SignInGoogle from './src/screens/SignInGoogle'; // Import SignInGoogle component

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <SignInGoogle /> 
    </View>
  );
};

export default App;
