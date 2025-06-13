import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import SectionHeader from '../public/publicHeader/SectionHeader';
import BookVerticalItem from '../public/bookpublic/BookVerticalItem';
import VerticalGap from '../public/publicUtil/VerticalGap';

const { width: fixwidth } = Dimensions.get('window');

const RecentViewedBookBlock = ({ books = [] }) => {
  return (
    <View style={styles.container}>
      <SectionHeader label="최근에 본 책" />
      <VerticalGap />
      {books.length === 0 ? (
        <Text style={styles.emptyText}>최근 본 책이 없어요!</Text>
      ) : (
        <FlatList
          data={books}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.isbn13}
          contentContainerStyle={{ paddingHorizontal: fixwidth * 0.02 }}
          renderItem={({ item }) => (
            <BookVerticalItem
              book={{
                isbn13: item.isbn13,
                bookname: item.bookTitle,
                authors: item.bookAuthor,
                bookImageURL: item.bookImageUrl,
              }}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ width: fixwidth * 0.027 }} />}
        />
      )}
    </View>
  );
};

export default RecentViewedBookBlock;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: fixwidth * 0.03,
    paddingVertical: fixwidth * 0.037,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: fixwidth * 0.038,
    color: '#999',
  },
});
