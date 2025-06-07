import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from 'react-native';
import BookSuggestionItem from './BookSuggestionItem';
import VerticalGap from '../publicUtil/VerticalGap';

const { width: fixwidth } = Dimensions.get('window');

const BookSuggestionCarousel = ({
                                  books,
                                  onItemPress,
                                  booksPerPage = 3,
                                  maxPage = 3,
                                  thumbnailWidth = fixwidth * 0.167,     // ✅ 썸네일 크기 default 추가
                                  thumbnailHeight = fixwidth * 0.23,
                                }) => {
  const [containerWidth, setContainerWidth] = useState(fixwidth);
  const [currentPage, setCurrentPage] = useState(0);

  const validBooks = Array.isArray(books) ? books : [];

  const pages = [];
  for (let i = 0; i < Math.min(validBooks.length, booksPerPage * maxPage); i += booksPerPage) {
    const sliced = validBooks.slice(i, i + booksPerPage);
    if (sliced.length > 0) {
      pages.push(sliced);
    }
  }

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newPage = Math.round(offsetX / containerWidth);
    setCurrentPage(newPage);
  };

  if (pages.length === 0) return null;

  return (
    <View onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      <ScrollView
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {pages.map((page, pageIndex) => (
          <View key={pageIndex} style={[styles.page, { width: containerWidth }]}>
            {page.map((book, index) => (
              <TouchableOpacity
                key={book.bookId}
                activeOpacity={0.8}
                onPress={() => onItemPress?.(book.bookname)}
              >
                <View style={{ width: '100%' }}>
                  <BookSuggestionItem
                    book={book}
                    thumbnailWidth={thumbnailWidth}        // ✅ 전달
                    thumbnailHeight={thumbnailHeight}
                  />
                </View>
                {index !== page.length - 1 && (
                  <VerticalGap height={containerWidth * 0.017} />
                )}
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
    paddingTop: fixwidth * 0.01,
  },
  indicatorWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: fixwidth * 0.03,
  },
  dot: {
    width: fixwidth * 0.023,
    height: fixwidth * 0.023,
    borderRadius: fixwidth * 0.1,
    marginHorizontal: fixwidth * 0.012,
  },
});
