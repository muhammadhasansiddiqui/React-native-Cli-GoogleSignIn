import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Card } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';



const FeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();


useEffect(() => {
  if (isFocused) {
    fetchPosts();
  }
}, [isFocused])

  const fetchPosts = async () => {
    try {
      setRefreshing(true);
      const querySnapshot = await firestore()
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .get();

      const allPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(allPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleEllipsisClick = (item) => {
    Alert.alert(
      'Options',
      'Choose an action',
      [
        {
          text: 'Edit',
          onPress: () => navigation.navigate('Create a Post', { post: item }),
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await firestore().collection('posts').doc(item.id).delete();
              Alert.alert('Post deleted successfully');
              fetchPosts();
            } catch (error) {
              console.error('Error deleting post:', error);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

const renderItem = ({ item }) => (
  <Card style={styles.postCard}>
    <Card.Content>
      <View style={styles.headerRow}>
        <View style={styles.userRow}>
          {item.photoURL ? (
            <Image source={{ uri: item.photoURL }} style={styles.profileImage} />
          ) : (
            <Icon name="menu" size={40} color="#993636" />
          )}
          <Text style={styles.postAuthorInline}>{item.displayName || 'Anonymous'}</Text>
        </View>

        <TouchableOpacity onPress={() => handleEllipsisClick(item)} style={styles.ellipsisContainer}>
<Icon name="rocket" size={30} color="#900" />
        </TouchableOpacity>
      </View>

      {item.content && <Text style={styles.postContent}>{item.content}</Text>}

      {item.postUrl && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.postUrl }} 
            style={styles.postImage}
            resizeMode="contain"
            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
          />
        </View>
      )}

      <Text style={styles.postDate}>
        {item.createdAt?.toDate
          ? `${item.createdAt.toDate().toLocaleDateString([], {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })} ${item.createdAt.toDate().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}`
          : 'No date'}
      </Text>
    </Card.Content>
  </Card>
);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.postsList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPosts} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f2f2f2' },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    color: '#333',
  },
  postsList: {
    paddingBottom: 20,
  },
  postCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#fff',
    padding: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postAuthorInline: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  postContent: {
    marginTop: 10,
    fontSize: 15,
    color: '#333',
  },
  postImage: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginTop: 12,
    resizeMode: 'cover',
  },
  postDate: {
    marginTop: 10,
    fontSize: 13,
    color: '#888',
    alignSelf: 'flex-end',
  },
   imageContainer: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5', 
  },
  ellipsisContainer: {
  padding: 4,
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
},

});

export default FeedScreen;
