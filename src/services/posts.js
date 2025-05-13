import firestore from '@react-native-firebase/firestore';

export const createPost = async (userId, userName, content) => {
  try {
    await firestore().collection('posts').add({
      userId,
      authorName: userName,
      content,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error creating post: ", error);
    return false;
  }
};
