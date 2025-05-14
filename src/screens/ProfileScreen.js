import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch user data from Firestore
  const fetchUserData = async uid => {
    if (!uid) {
      console.log('No user logged in');
      setLoading(false);
      return;
    }

    try {
      const docRef = firestore().collection('users').doc(uid);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        setUserData(docSnap.data());
        console.log('User data:', docSnap.data());
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      setError('Error fetching user data');
      console.log('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(authUser => {
      setUser(authUser);
      if (authUser) {
        fetchUserData(authUser.uid);
      } else {
        setUserData(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          {user.photoURL && (
            <Image source={{uri: user.photoURL}} style={styles.profileImage} />
          )}
          <Text style={styles.text}>Welcome, {user.displayName }</Text>
          <Text style={styles.text}>Email: {user.email}</Text>

          <TouchableOpacity
            style={styles.postButton}
            onPress={() => navigation.navigate('post')}>
            <Text style={styles.buttonText}>Add Post</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Feed')}
            style={{marginTop: 10}}>
            <Text style={{color: 'blue'}}>See a Feed</Text>
          </TouchableOpacity>

        {/* see my all post  */}
        <TouchableOpacity
          onPress={() => navigation.navigate('MyPost')}
          style={{marginTop: 10}}>
          <Text style={{color: 'blue'}}>See my all post</Text>
        </TouchableOpacity>


          {/* SIgnOut Btn */}
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => {
              auth().signOut();
              navigation.navigate('SignIn');
            }}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.text}>User details not found.</Text>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
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
  errorText: {
    color: 'red',
    marginTop: 20,
  },
});

export default ProfileScreen;
