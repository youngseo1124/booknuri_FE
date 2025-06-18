import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import SectionHeader from '../public/publicHeader/SectionHeader';
import { getRelatedBooksByIsbn } from '../../apis/apiFunction_recommend';
import BookVerticalItem from '../public/bookpublic/BookVerticalItem';
import VerticalGap from '../public/publicUtil/VerticalGap';

const { width: fixwidth } = Dimensions.get('window');

const DPAlsoViewedBooksBlock = ({ bookInfo }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookInfo?.isbn13) {
      fetchRecommendations();
    }
  }, [bookInfo?.isbn13]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await getRelatedBooksByIsbn(bookInfo.isbn13); // ✅ ISBN 기반으로 호출
      const filteredBooks = res.filter(
        (item) => item.isbn13 !== bookInfo?.isbn13
      );
      setBooks(filteredBooks);
    } catch (err) {
      console.error('📛 연관 도서 추천 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SectionHeader label=" 이 책을 본 다른 유저들이 본 책 " />
      <VerticalGap />
      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <FlatList
          data={books}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: fixwidth * 0.02 }}
          renderItem={({ item }) => <BookVerticalItem book={item} />}
          ItemSeparatorComponent={() => <View style={{ width: fixwidth * 0.027 }} />}
        />
      )}
    </View>
  );
};

export default DPAlsoViewedBooksBlock;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: fixwidth * 0.05,
    paddingHorizontal: fixwidth * 0.035,
  },
});
