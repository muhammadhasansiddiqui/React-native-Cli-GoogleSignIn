// src/components/DrawerContent.js
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';

const DrawerContent = (props) => {
  const handleSignOut = () => {
    auth().signOut();
    props.navigation.replace('SignIn'); // replace so user can't go back
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      <View style={styles.signOutContainer}>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  signOutContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  signOutButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default DrawerContent;
