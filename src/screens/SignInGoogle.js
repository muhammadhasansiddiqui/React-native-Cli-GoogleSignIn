import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const SignInGoogle = () => {
  const navigation = useNavigation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '304228081724-o134mnvt5pvkc7oi8l65mk2elcimfaae.apps.googleusercontent.com', // Your Web Client ID from Firebase Console
    });

    // Check if the user is already signed in when the component mounts
    const checkUserSignedIn = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        // If the user is signed in, navigate to the profile page
        Alert.alert('Sign-in Success', 'You have successfully signed in with Google.');
navigation.navigate('Main');
      }
    };

    checkUserSignedIn();
  }, [navigation]);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      // Sign in to Google
      const userInfo = await GoogleSignin.signIn();

      // Get the ID token
      const { idToken } = await GoogleSignin.getTokens();
      if (!idToken) throw new Error('Google ID token missing');

      console.log('✅ ID Token:', idToken);

      // Create Firebase credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign in with Firebase
      const userCredential = await auth().signInWithCredential(googleCredential);
      const user = userCredential.user;

      // Save user to Firestore
      await firestore()
        .collection('users')
        .doc(user.uid)
        .set(
          {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            id: user.uid,
            createdAt: firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

      console.log('✅ Google Sign-in Success:', user.displayName);
      Alert.alert('Sign-in Success', 'You have successfully signed in with Google.');
      
navigation.navigate('Main');
    } catch (error) {
      console.log('❌ Google Sign-in Error:', error);
      Alert.alert('Sign-in Error', error.message || 'Unknown error');
    }
  };

  return (
    <View style={styles.container}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signInWithGoogle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
});

export default SignInGoogle;
