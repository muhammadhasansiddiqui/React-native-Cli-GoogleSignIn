import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Avatar } from 'react-native-paper';

const DrawerContent = (props) => {
  const { userInfo } = props; // You'll need to pass user info from your auth context

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userInfoSection}>
        <Avatar.Image 
          source={{ uri: userInfo.data?.photo || 'https://example.com/default-avatar.jpg' }}
          size={50}
        />
        <Text style={styles.userName}>{userInfo.data?.displayName || 'Guest'}</Text>
        <Text style={styles.userEmail}>{userInfo.data?.email || ''}</Text>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => {
          // Handle logout
          props.navigation.navigate('SignIn');
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  userInfoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userName: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    padding: 15,
    margin: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  logoutText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default DrawerContent;