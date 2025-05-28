import React from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import SectionHeader from './common/SectionHeader';
import BookReviewItem from './common/BookReviewItem';


const { width: fixwidth } = Dimensions.get('window');

const BookReviewsBlock = ({ reviews, onLikePress, onReportPress }) => {
  const renderItem = ({ item }) => (
    <BookReviewItem
      item={item}
      onLikePress={onLikePress}
      onReportPress={onReportPress}
    />
  );

  return (
    <View style={styles.container}>
      <SectionHeader label="리뷰" />
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ gap: fixwidth * 0.04 }}
      />
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
