// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignInGoogle from './src/screens/SignInGoogle';
import FeedScreen from './src/screens/FeedScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import post from './src/components/Post';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInGoogle} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name="post" component={post} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { Provider as PaperProvider } from 'react-native-paper';
// import SignInGoogle from './src/screens/SignInGoogle';
// import FeedScreen from './src/screens/FeedScreen';
// import ProfileScreen from './src/screens/ProfileScreen';
// import DrawerContent from './src/components/DrawerContent';

// const Drawer = createDrawerNavigator();

// const App = () => {
//   return (
//     <PaperProvider>
//       <NavigationContainer>
//         <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
//           <Drawer.Screen name="SignIn" component={SignInGoogle} />
//           <Drawer.Screen name="Feed" component={FeedScreen} />
//           <Drawer.Screen name="Profile" component={ProfileScreen} />
//         </Drawer.Navigator>
//       </NavigationContainer>
//     </PaperProvider>
//   );
// };

// export default App;