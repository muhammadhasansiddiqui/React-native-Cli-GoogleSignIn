import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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

  const renderItem = ({ item }) => (
    <Card style={styles.postCard}>
      <Card.Content>
        <Text style={styles.postAuthor}>{item.authorName}</Text>
        <Text>{item.content}</Text>
        <Text style={styles.postDate}>
          {item.createdAt?.toDate
            ? item.createdAt.toDate().toLocaleString()
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchPosts} />
        }
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
  },
  postCard: {
    marginBottom: 10,
  },
  postAuthor: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  postsList: {
    paddingBottom: 20,
  },
});

export default FeedScreen;
