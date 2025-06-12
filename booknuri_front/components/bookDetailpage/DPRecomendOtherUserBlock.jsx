import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import SectionHeader from '../public/publicHeader/SectionHeader';
import { getCategoryBasedRecommendations } from '../../apis/apiFunction_recommend';
import BookVerticalItem from '../public/bookpublic/BookVerticalItem';
import VerticalGap from '../public/publicUtil/VerticalGap';

const { width: fixwidth } = Dimensions.get('window');

const shuffleArray = (array) => {
  // 배열 복사 후 Fisher-Yates 방식으로 셔플
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const DPAlsoViewedBooksBlock = ({ bookInfo }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { mainCategory, middleCategory, subCategory } = bookInfo || {};

  useEffect(() => {
    if (mainCategory) {
      fetchRecommendations();
    }
  }, [mainCategory, middleCategory, subCategory]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await getCategoryBasedRecommendations({
        mainCategoryName: mainCategory,
        middleCategoryName: middleCategory,
        subCategoryName: subCategory,
      });

      const filteredBooks = res.data.filter(
        (item) => item.isbn13 !== bookInfo?.isbn13
      );

      // 👉 랜덤 섞기
      const shuffled = shuffleArray(filteredBooks);

      setBooks(shuffled);
    } catch (err) {
      console.error('📛 관련 유저 추천 실패:', err);
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
          ItemSeparatorComponent={() => <View style={{ width: fixwidth * 0.027}} />}
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
    paddingHorizontal:fixwidth*0.037
  },
});
