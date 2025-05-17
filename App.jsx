// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';

import SignInGoogle from './src/screens/SignInGoogle';
import FeedScreen from './src/screens/FeedScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import Post from './src/components/Post';
import MyPost from './src/screens/Mypost';
import DrawerContent from './src/components/DrawerContent'; 


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

//  Drawer Screens

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Profile"
      drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Feed" component={FeedScreen} />
      <Drawer.Screen name="Create a Post" component={Post} />
      <Drawer.Screen name="MyPost" component={MyPost} />
    </Drawer.Navigator>
  );
}


//  Main App

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen
          name="SignIn"
          component={SignInGoogle}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;






// // App.js

// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import SignInGoogle from './src/screens/SignInGoogle';
// import FeedScreen from './src/screens/FeedScreen';
// import ProfileScreen from './src/screens/ProfileScreen';
// import post from './src/components/Post';
// import Mypost from './src/screens/Mypost';

// const Stack = createNativeStackNavigator();

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="SignIn">
//         <Stack.Screen name="SignIn" component={SignInGoogle} />
//         <Stack.Screen name="Profile" component={ProfileScreen} />
//         <Stack.Screen name="Feed" component={FeedScreen} />
//         <Stack.Screen name="post" component={post} />
//         <Stack.Screen name="MyPost" component={Mypost} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;

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