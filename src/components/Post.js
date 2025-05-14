import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker'; // Updated image picker

const Post = () => {
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null); // To store the selected image URI
  const navigation = useNavigation();

  useEffect(() => {
    const currentUser = auth().currentUser;
    setUser(currentUser);
    
    const subscriber = auth().onAuthStateChanged(user => {
      setUser(user);
    });
    
    return subscriber;
  }, []);

  // Function to handle image selection from the gallery or camera
  // const handleChooseImage = () => {
  //   const options = {
  //     title: 'Select Image',
  //     storageOptions: {
  //       skipBackup: true,
  //       path: 'images',
  //     },
  //   };

  //   launchImageLibrary(options, response => {
  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.errorCode) {
  //       console.log('ImagePicker Error:', response.errorMessage);
  //     } else {
  //       setImageUri(response.assets[0].uri); // Set the selected image URI
  //     }
  //   });
  // };

  // Function to upload the image to Firebase Storage
  // const uploadImage = async () => {
  //   if (!imageUri) return null;

  //   const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
  //   const reference = storage().ref('postImages').child(fileName);
    
  //   await reference.putFile(imageUri); // Upload the image
  //   const imageUrl = await reference.getDownloadURL(); // Get the download URL

  //   return imageUrl;
  // };

  const handlePost = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'You need to be logged in to post');
      return;
    }

    if (!content.trim() && !imageUri) {
      Alert.alert('Empty Post', 'Please write something or select an image before posting');
      return;
    }

    try {
      setLoading(true);

      // Upload image if it exists
      // const imageUrl = await uploadImage();

      // Add the post to Firestore
      await firestore().collection('posts').add({
        content,
        userId: user.uid,
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || null,
        // image: imageUrl || null, // Save the image URL if the image exists
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Your post was added successfully!');
      console.log('Post added successfully');
      setContent('');
      setImageUri(null); // Clear the image URI after posting
      navigation.navigate('Feed');
    } catch (error) {
      console.error('Post Error:', error);
      Alert.alert('Error', `Failed to post: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>What's on your mind?</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        value={content}
        onChangeText={setContent}
        placeholder="Share your thoughts..."
        editable={!loading}
      />
      
      {/* Image Picker Button */}
      {/* <TouchableOpacity onPress={handleChooseImage} style={styles.imagePickerButton}>
        <Text style={styles.imagePickerButtonText}>Choose Image</Text>
      </TouchableOpacity> */}

      {/* Display selected image */}
      {/* {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.selectedImage} />
      )} */}

      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <Button 
          title="Post" 
          onPress={handlePost} 
          disabled={!content.trim() && !imageUri || loading}
        />
      )}

      {/* See the feed button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Feed')}
        style={{ marginTop: 10 }}
      >
        <Text style={{ color: 'blue' }}>See a Feed</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    minHeight: 150,
    textAlignVertical: 'top',
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  imagePickerButton: {
    backgroundColor: '#007bff',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  imagePickerButtonText: {
    color: 'white',
    fontSize: 16,
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 8,
  },
});

export default Post;
