import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const BookSuggestionItem = ({ book }) => {
  return (
    <View style={styles.itemContainer}>
      <Image source={{ uri: book.bookImageURL }} style={styles.thumbnail} />
      <View style={styles.infoBox}>
        <Text numberOfLines={1} style={styles.bookname}>{book.bookname}</Text>
        <Text numberOfLines={1} style={styles.authors}>{book.authors}</Text>
      </View>
    </View>
  );
};

export default BookSuggestionItem;

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    flexDirection: 'row',
    padding: fixwidth * 0.017,
    overflow: 'hidden',
  /*  borderColor: 'rgba(0,0,0,0.19)',
    borderWidth: fixwidth * 0.0017,
    borderRadius: fixwidth * 0.02,*/

  },
  thumbnail: {
    width: fixwidth * 0.157,
    height: fixwidth * 0.222,
    borderRadius: fixwidth * 0.001,
    marginRight: fixwidth * 0.04,
    borderWidth: fixwidth * 0.0011,
    borderColor: 'rgba(0,0,0,0.38)',
  },
  infoBox: {
    justifyContent: 'center',
    flex: 1,
  },
  bookname: {
    fontSize: fixwidth * 0.037,
    fontWeight: '500',
    fontFamily: 'NotoSansKR-Medium',
    numberOfLines: 1,
  },
  authors: {
    fontSize: fixwidth * 0.03,
    color: 'rgba(0,0,0,0.63)',
    fontFamily: 'NotoSansKR-Light',
  },
});
