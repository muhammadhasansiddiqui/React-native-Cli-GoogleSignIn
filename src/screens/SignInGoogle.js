import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';

const SignInGoogle = () => {
  const navigation = useNavigation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '304228081724-o134mnvt5pvkc7oi8l65mk2elcimfaae.apps.googleusercontent.com',
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      // 1. Check if Google Play Services is available
      await GoogleSignin.hasPlayServices();
      
      // 2. Get user's ID token
      const { idToken } = await GoogleSignin.signIn();
      
      // 3. Create Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
      // 4. Sign-in with credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      // 5. Navigate to Profile screen after successful sign-in
      navigation.navigate('Profile');
      
 } catch (error) {
  console.log('Google Sign-In Error:', error);

  let code = 'UNKNOWN_ERROR';
  let message = 'An unknown error occurred during sign-in.';

  if (error && typeof error === 'object') {
    code = error.code || code;
    message = error.message || message;
  } else if (typeof error === 'string') {
    message = error;
  }

  Alert.alert('Sign-in Error', `${message} (Code: ${code})`);
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
