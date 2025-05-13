import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const user = auth().currentUser;

  return (
    <View style={styles.container}>
      {user ? (
        <>
          {user.photoURL && (
            <Image
              source={{ uri: user.photoURL }}
              style={styles.profileImage}
            />
          )}
          <Text style={styles.text}>Welcome, {user.displayName || 'User'}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Text style={styles.text}>UID: {user.uid}</Text>

          <TouchableOpacity
            style={styles.postButton}
            onPress={() => navigation.navigate('Post')}
          >
            <Text style={styles.buttonText}>Add Post</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.text}>User details not found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  postButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProfileScreen;