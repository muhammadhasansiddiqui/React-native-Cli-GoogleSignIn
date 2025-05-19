import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import * as Progress from 'react-native-progress';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';



const Post = ({ route }) => {
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const navigation = useNavigation();
  const { post } = route.params || {};

  useEffect(() => {
    const currentUser = auth().currentUser;
    setUser(currentUser);

    if (post?.content) {
      setContent(post.content);
    }

    const unsubscribe = auth().onAuthStateChanged(user => {
      setUser(user);
    });

    return unsubscribe;
  }, [post]);


const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'Storage Permission',
          message: 'App needs access to your media to upload images.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to upload images.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  }
  return true; 
};



const requestGalleryPermission = async () => {
  let permission;

  if (Platform.OS === 'android') {
    const sdkInt = Platform.constants?.Release || 30;

    if (sdkInt >= 33) {
      permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
    } else {
      permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    }
  } else {
    permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
  }

  const result = await check(permission);
  if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
    const reqResult = await request(permission);
    return reqResult === RESULTS.GRANTED;
  }

  return result === RESULTS.GRANTED;
};


  // Select image
const handleChooseImage = async () => {
  let permissionGranted = false;

  if (Platform.OS === 'android') {
    const sdkInt = Platform.Version;

    const permission =
      sdkInt >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

    const result = await check(permission);
    if (result === RESULTS.GRANTED) {
      permissionGranted = true;
    } else {
      const requestResult = await request(permission);
      permissionGranted = requestResult === RESULTS.GRANTED;
    }
  } else {
    const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    permissionGranted = result === RESULTS.GRANTED;
  }

  if (!permissionGranted) {
    Alert.alert('Permission Denied', 'Cannot access gallery without permission.');
    return;
  }

  try {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
      Alert.alert('Image Selection Cancelled');
      return;
    }

    if (result.errorCode) {
      console.log('Image Picker Error Code:', result.errorCode);
      Alert.alert('Error', result.errorMessage || 'Unknown error');
      return;
    }

    const uri = result.assets?.[0]?.uri;
    if (uri) {
      setImageUri(uri);
      Alert.alert('Image Selected');
    } else {
      Alert.alert('No image found');
    }
  } catch (err) {
    console.error('Gallery open error:', err);
    Alert.alert('Error', 'Failed to open gallery');
  }
};



  // Upload image to Cloudinary
const uploadImage = async (uri) => {
  if (!uri) return null;

  const cloudName = 'dudx3of1n';
  const uploadPreset = 'socialmedia';

  try {
    setUploading(true);
    setTransferred(0);

    const fileName = uri.split('/').pop();

    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      type: 'image/jpeg', // adjust based on image format if needed
      name: fileName || 'upload.jpg',
    });
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = await response.json();
    console.log('Cloudinary upload response:', data);

    if (data.secure_url) {
      Alert.alert('Success', 'Image uploaded to Cloudinary!');
      setTransferred(1);
      return data.secure_url;
    } else {
      Alert.alert('Error', 'Cloudinary upload failed');
      console.error('Cloudinary upload error:', data);
      return null;
    }
  } catch (err) {
    console.error('Upload Error:', err);
    Alert.alert('Upload Failed', 'Network error or invalid image URI');
    throw err;
  } finally {
    setUploading(false);
  }
};


  // Post creation/update
  const handlePost = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please log in to post.');
      return;
    }

    if (!content.trim() && !imageUri) {
      Alert.alert('Empty Post', 'Write something or select an image.');
      return;
    }

    setLoading(true);
    let postUrl = null;

   try {
    let postUrl = post?.postUrl || null; // Keep existing URL if editing
    
    if (imageUri) {
      postUrl = await uploadImage(imageUri);
      if (!postUrl) {
        throw new Error('Image upload failed');
      }
    }

    const postData = {
      content: content.trim(),
      postUrl: postUrl,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    if (post?.id) {
      await firestore().collection('posts').doc(post.id).update(postData);
    } else {
      await firestore().collection('posts').add({
        ...postData,
        userId: user.uid,
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || null,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    }

    setContent('');
    setImageUri(null);
    navigation.navigate('Feed');
  } catch (error) {
    console.error('Post Error:', error);
    Alert.alert('Error', error.message || 'Failed to save post');
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
        editable={!loading && !uploading}
      />

      <TouchableOpacity
        onPress={handleChooseImage}
        style={styles.imagePickerButton}
        disabled={loading || uploading}>
        <Text style={styles.imagePickerButtonText}>Choose Image</Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.selectedImage} />}

      {uploading && (
        <View style={styles.progressContainer}>
          <Progress.Bar progress={transferred} width={300} color="#007bff" />
          <Text style={styles.progressText}>
            Uploading: {Math.round(transferred * 100)}%
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {loading || uploading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <Button
            title={post ? 'Update Post' : 'Post'}
            onPress={handlePost}
            disabled={(!content.trim() && !imageUri) || loading}
            color="#007bff"
          />
        )}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Feed')} style={styles.feedLink}>
        <Text style={styles.feedLinkText}>Back to Feed</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 18, marginBottom: 15, fontWeight: 'bold', color: '#333' },
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
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  imagePickerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  progressContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  progressText: {
    marginTop: 8,
    color: '#666',
  },
  buttonContainer: {
    marginVertical: 15,
  },
  feedLink: {
    marginTop: 15,
    alignSelf: 'center',
  },
  feedLinkText: {
    color: '#007bff',
    fontSize: 16,
  },
});

export default Post;
