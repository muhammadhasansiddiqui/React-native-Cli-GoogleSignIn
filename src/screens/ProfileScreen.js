import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DrawerToggle from '../components/DrawerToggle'; // Import your drawer icon

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerToggle navigation={navigation} />,
    });
  }, [navigation]);

  // Fetch user data
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
        navigation.replace('SignIn');
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
          <Text style={styles.text}>Welcome, {user.displayName}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>

          <TouchableOpacity
            style={styles.postButton}
            onPress={() => navigation.navigate('Create a Post')}>
            <Text style={styles.buttonText}>➕ Add Post</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Feed')}>
            <Text style={styles.linkText}>📰 See Feed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('MyPost')}>
            <Text style={styles.linkText}>📁 See My Posts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.postButton, {backgroundColor: '#dc3545'}]}
            onPress={() => {
              auth().signOut();
              navigation.navigate('SignIn');
            }}>
            <Text style={styles.buttonText}>🚪 Sign Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.text}>User details not found.</Text>
      )}

      {/* {error && <Text style={styles.errorText}>{error}</Text>} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  postButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 10,
    
  },
  linkText: {
    color: '#007bff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
  },
});

export default ProfileScreen;
