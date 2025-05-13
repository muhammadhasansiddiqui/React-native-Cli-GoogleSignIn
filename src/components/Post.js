import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Post = () => {
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const currentUser = auth().currentUser;
    setUser(currentUser);
    
    const subscriber = auth().onAuthStateChanged(user => {
      setUser(user);
    });
    
    return subscriber;
  }, []);

  const handlePost = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'You need to be logged in to post');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Empty Post', 'Please write something before posting');
      return;
    }

    try {
      setLoading(true);
      await firestore().collection('posts').add({
        content,
        userId: user.uid,
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || null,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Your post was added successfully!');
      setContent('');
      navigation.goBack();
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
      
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <Button 
          title="Post" 
          onPress={handlePost} 
          disabled={!content.trim() || loading}
        />
      )}
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
});

export default Post;