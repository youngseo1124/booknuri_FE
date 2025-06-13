
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import SectionHeader from '../public/publicHeader/SectionHeader';
import {getCategoryBasedRecommendations} from '../../apis/apiFunction_recommend';
import BookVerticalItem from '../public/bookpublic/BookVerticalItem';
import VerticalGap from '../public/publicUtil/VerticalGap';


const { width: fixwidth } = Dimensions.get('window');

const DPRecomendCategoryBestsellerBlock = ({ bookInfo }) => {
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

      setBooks(filteredBooks);
    } catch (err) {
      console.error('📛 카테고리 추천 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SectionHeader label=" 이 분야의 베스트셀러 " />
      <VerticalGap/>
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

export default DPRecomendCategoryBestsellerBlock;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: fixwidth * 0.05,
    paddingHorizontal:fixwidth*0.035
  },
});
