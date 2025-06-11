import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HistoryBookCard from './HistoryBookCard';
import { getMyGroupedWrittenBooks } from '../../apis/apiFunction_myShelf';

const { width: fixwidth } = Dimensions.get('window');

const MyGroupedWrittenBooksScreen = ({ selectedType }) => {
  const [bookList, setBookList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchBooks = async (reset = false) => {
    const res = await getMyGroupedWrittenBooks(selectedType, '', reset ? 0 : page, 10);
    if (reset) {
      setBookList(res.content || []);
    } else {
      setBookList((prev) => [...prev, ...(res.content || [])]);
    }
    setTotalCount(res.totalCount || 0);
    setPage((prev) => (reset ? 1 : prev + 1));
    setHasMore((res.content?.length || 0) === 10);
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks(true); // 처음엔 초기화해서 가져옴
  }, [selectedType]);

  const fetchNextPage = () => {
    if (!hasMore || loading) return;
    fetchBooks();
  };

  const renderItem = ({ item }) => (
    <HistoryBookCard book={item} selectedType={selectedType} />
  );

  if (loading && bookList.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  return (
    <FlatList
      data={bookList}
      keyExtractor={(item) => item.isbn13}
      renderItem={renderItem}
      onEndReached={fetchNextPage}
      onEndReachedThreshold={0.1}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={styles.emptyText}>작성한 글이 있는 책이 없어요 🥲</Text>
        </View>
      }
    />
  );
};

export default MyGroupedWrittenBooksScreen;

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: fixwidth * 0.0,
    paddingTop: fixwidth * 0.0,
    paddingBottom: fixwidth * 0.2,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: fixwidth * 0.3,
  },
  emptyText: {
    fontSize: fixwidth * 0.037,
    fontFamily: 'NotoSansKR-Regular',
    color: '#555',
    textAlign: 'center',
  },
});
