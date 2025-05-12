// SignInGoogle.js
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';

const SignInGoogle = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '304228081724-o134mnvt5pvkc7oi8l65mk2elcimfaae.apps.googleusercontent.com',
    });
  }, []);

  // Signin with Google function
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userData = await GoogleSignin.signIn();
      console.log(userData);
      setUserInfo(userData);  
    } catch (error) {
      console.log(error);
      Alert.alert("Sign-in Error", "Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <View style={styles.userInfoContainer}>
          <Text style={styles.text}>Name: {userInfo.data.user.displayName}</Text>
          <Text style={styles.text}>Email: {userInfo.data.user.email}</Text>
          {userInfo.data.user.photo ? (
            <Image source={{ uri: userInfo.data.user.photo }} style={styles.image} />
          ) : (
            <Text style={styles.text}>No photo available</Text>
          )}
        </View>
      ) : (
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signInWithGoogle} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',  // Light background color
    padding: 20,  // Adjust padding
  },

  userInfoContainer: {
    alignItems: 'center',  // Center the content within user info container
    marginTop: 20,  // Add space above the container
  },

  text: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 50,  // To make the image circular
    marginBottom: 20,
  }
});

export default SignInGoogle;
