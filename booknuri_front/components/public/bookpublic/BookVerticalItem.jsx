
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: fixwidth } = Dimensions.get('window');

const BookVerticalItem = ({ book, width = fixwidth * 0.29, height = fixwidth * 0.417 }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>

        navigation.push('BookDetailScreen', {
          isbn: book.isbn13,
          scrollToTop: true,
        })
      }
      style={styles.container}
    >
      <Image source={{ uri: book.bookImageURL }} style={[styles.image, { width, height }]} />

      <View style={{ width: '100%' }}>
        <Text style={styles.title} numberOfLines={2}>
          {book.bookname}
        </Text>
        <Text style={styles.author} numberOfLines={1}>{book.authors}</Text>
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: fixwidth * 0.3,
  },
  image: {
    borderRadius: fixwidth * 0.001,
    resizeMode: 'cover',
    borderWidth: fixwidth * 0.001,
    borderColor: 'rgba(0,0,0,0.77)',
  },
  title: {
    marginTop: fixwidth * 0.01,
    fontSize: fixwidth * 0.033,
    fontFamily: 'NotoSansKR-SemiBold',
    lineHeight: fixwidth * 0.047
  },
  author: {
    paddingTop:fixwidth * 0.007,
    fontSize: fixwidth * 0.0297,
    color: '#555',
    fontFamily: 'NotoSansKR-Light',
    textAlign: 'left',
    lineHeight: fixwidth * 0.045
  },
});

export default BookVerticalItem;
