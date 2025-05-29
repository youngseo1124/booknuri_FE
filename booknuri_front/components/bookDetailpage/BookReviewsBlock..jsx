import React from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import SectionHeader from './public/SectionHeader';
import BookReviewItem from './public/BookReviewItem';
import SortTabs from './public/SortTabs';
import MoreButton from './public/MoreButton';

const { width: fixwidth } = Dimensions.get('window');

const BookReviewsBlock = ({
                            reviews,
                            onLikePress,
                            onReportPress,
                            onSortChange,
                            currentSort,
                          }) => {
  const renderItem = ({ item }) => (
    <BookReviewItem
      item={item}
      onLikePress={onLikePress}
      onReportPress={onReportPress}
    />
  );

  const limitedReviews = reviews?.slice(0, 5) || [];

  return (
    <View style={styles.container}>
      <SectionHeader label={`리뷰 (${reviews?.length || 0})`} />
      <SortTabs currentSort={currentSort} onChange={onSortChange} />
      <FlatList
        data={limitedReviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ gap: fixwidth * 0.04 }}
      />
      <MoreButton label="리뷰 더 보기" onPress={() => { /* 네비게이션은 나중에 */ }} />
    </View>
  );
};

export default BookReviewsBlock;

const styles = StyleSheet.create({
  container: {
    width: '92%',
    alignSelf: 'center',
    paddingVertical: fixwidth * 0.07,
  },
});
