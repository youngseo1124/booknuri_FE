import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl } from 'react-native';
import ShelfBookCardWithStatusSelector from './ShelfBookCardWithStatusSelector';
import {getMyShelfBooks} from '../../apis/apiFunction_myShelf';

const MyShelfTabPage = () => {
  const [bookList, setBookList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchShelfBooks = async () => {
    try {
      const data = await getMyShelfBooks(0, 10);
      setBookList(data.content || []);
    } catch (err) {
      console.error('책장 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchShelfBooks();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchShelfBooks();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <ShelfBookCardWithStatusSelector book={item} />
  );

  return (
    <View style={styles.container}>
      {bookList.length === 0 ? (
        <Text style={styles.emptyText}>책장에 추가된 책이 없습니다 📚</Text>
      ) : (
        <FlatList
          data={bookList}
          renderItem={renderItem}
          keyExtractor={(item) => item.shelfInfo.isbn13}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
};

export default MyShelfTabPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    fontFamily: 'NotoSansKR-Regular',
    color: '#666',
  },
});
