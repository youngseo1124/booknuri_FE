import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from 'react-native';
import BookSuggestionItem from '../public/bookpublic/BookSuggestionItem';
import VerticalGap from '../public/publicUtil/VerticalGap';

const BookSuggestionCarousel = ({ books = [], onItemPress }) => {
  const booksPerPage = 3;
  const maxPage = 3;

  const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width);
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [];
  for (let i = 0; i < Math.min(books.length, booksPerPage * maxPage); i += booksPerPage) {
    pages.push(books.slice(i, i + booksPerPage));
  }

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newPage = Math.round(offsetX / containerWidth);
    setCurrentPage(newPage);
  };

  return (
    <View
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)} // 👈 부모의 실제 너비 측정
    >
      <ScrollView
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {pages.map((page, pageIndex) => (
          <View
            key={pageIndex}
            style={[styles.page, { width: containerWidth }]} // 👈 부모 따라가게
          >
            {page.map((book, index) => (
              <TouchableOpacity
                key={book.bookId}
                activeOpacity={0.8}
                onPress={() => onItemPress(book.bookname)}
              >
                <View style={{ width: '100%' }}>
                  <BookSuggestionItem book={book} />
                </View>
                {index !== page.length - 1 && <VerticalGap height={containerWidth * 0.017} />}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.indicatorWrapper}>
        {pages.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              { backgroundColor: currentPage === idx ? '#839bfd' : '#ccc' }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default BookSuggestionCarousel;

const styles = StyleSheet.create({
  page: {
    paddingTop: Dimensions.get('window').width * 0.01,
  },
  indicatorWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Dimensions.get('window').width * 0.03,
  },
  dot: {
    width: Dimensions.get('window').width * 0.02,
    height: Dimensions.get('window').width * 0.02,
    borderRadius: Dimensions.get('window').width * 0.01,
    marginHorizontal: Dimensions.get('window').width * 0.01,
  },
});
