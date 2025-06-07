import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from 'react-native';
import BookSuggestionItem from '../public/bookpublic/BookSuggestionItem';
import VerticalGap from '../public/publicUtil/VerticalGap';

const BookSuggestionCarousel = ({ books, onItemPress }) => {
  const booksPerPage = 3;
  const maxPage = 3;

  const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width);
  const [currentPage, setCurrentPage] = useState(0);

  // ✅ books null/undefined 방지
  const validBooks = Array.isArray(books) ? books : [];

  // ✅ 페이지 분할
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

  // 📌 책 없으면 아무것도 렌더 안 함 (옵션)
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
          <View
            key={pageIndex}
            style={[styles.page, { width: containerWidth }]}
          >
            {page.map((book, index) => (
              <TouchableOpacity
                key={book.bookId}
                activeOpacity={0.8}
                onPress={() => onItemPress?.(book.bookname)}
              >
                <View style={{ width: '100%' }}>
                  <BookSuggestionItem book={book} />
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
