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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchPosts();
  }, []);

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
          onPress: () => navigation.navigate('post', { post: item }),
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
              <Icon name="account-circle" size={40} color="#ccc" />
            )}
            <Text style={styles.postAuthorInline}>{item.displayName}</Text>
          </View>

          <TouchableOpacity onPress={() => handleEllipsisClick(item)} style={styles.ellipsisContainer}>
            <Icon name="dots-vertical" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <Text style={{ marginTop: 5 }}>{item.content}</Text>

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
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  postCard: {
    marginBottom: 10,
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
  postAuthorInline: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  postDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  postsList: {
    paddingBottom: 20,
  },
  ellipsisContainer: {
    paddingLeft: 10,
    paddingTop: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
});

export default FeedScreen;
