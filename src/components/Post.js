import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Post = ({route}) => {
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null); 
  const navigation = useNavigation();
   const { post } = route.params || {};

 useEffect(() => {
  const currentUser = auth().currentUser;
  setUser(currentUser);

  if (post?.content) {
    setContent(post.content);
  }

  const subscriber = auth().onAuthStateChanged(user => {
    setUser(user);
  });

  return subscriber;
}, [post]);

 

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

    if (post?.id) {
      // yha update ho raha hai
      await firestore().collection('posts').doc(post.id).update({
        content,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert('Success', 'Post update successfully!');
    } else {
      // 👇 yhn nayi post ban rahi hai
      await firestore().collection('posts').add({
        content,
        userId: user.uid,
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || null,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      // write in english alert 
      Alert.alert('Success', 'Post created successfully!');
    
    }

    setContent('');
    setImageUri(null);
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
  title={post ? "Update Post" : "Post"}
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
