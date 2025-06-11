import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

const { width: fixwidth } = Dimensions.get('window');

const HistoryBookCard = ({ book, selectedType }) => {
  const navigation = useNavigation();

  const goToDetailList = () => {
    if (selectedType === 'quote') {
      navigation.navigate('MyQuotesScreen', { isbn13: book.isbn13 });
    } else if (selectedType === 'review') {
      navigation.navigate('MyReviewsScreen', { isbn13: book.isbn13 });
    } else {
      navigation.navigate('MyReflectionsScreen', { isbn13: book.isbn13 });
    }
  };

  const goToDetailSetting = () => {
    navigation.navigate('BookDetailScreen', {
      isbn: book.isbn13,
    });
  };


  const getCountText = () => {
    const typeMap = {
      quote: { label: '인용', count: book.quoteCount },
      review: { label: '리뷰', count: book.reviewCount },
      reflection: { label: '독후감', count: book.reflectionCount },
    };
    const { label, count } = typeMap[selectedType] || {};
    return `${label} ${count}개`;
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.imageWrapper} onPress={goToDetailSetting}>
        <Image source={{ uri: book.bookImageUrl }} style={styles.bookImage} />
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {book.bookTitle}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.bookAuthor}
        </Text>

        <TouchableOpacity style={styles.goto} onPress={goToDetailList}>
          <Text style={styles.gotoText}>{getCountText()}</Text>
          <FontAwesomeIcon icon={faChevronRight} size={fixwidth * 0.037} color="#555" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HistoryBookCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: fixwidth * 0.0457,
    paddingVertical: fixwidth * 0.007,
    borderRadius: fixwidth * 0.007,
    backgroundColor: '#ffffff',
    marginBottom: fixwidth * 0.087,

    borderColor: 'rgba(178,178,178,0.37)',
  },
  imageWrapper: {
    position: 'relative',
    width: fixwidth * 0.237,
    height: fixwidth * 0.357,
    marginRight: fixwidth * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookImage: {
    width: '100%',
    height: '100%',
    borderRadius: fixwidth * 0.007,
    borderWidth: fixwidth * 0.001,
    borderColor: 'rgba(0,0,0,0.57)',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    height: fixwidth * 0.15
  },
  title: {
    fontSize: fixwidth * 0.0427,
    fontFamily: 'NotoSansKR-SemiBold',
    lineHeight: fixwidth * 0.061,
    color: '#111',
    marginBottom: fixwidth * 0.01,
    paddingRight: fixwidth * 0.01,
  },
  author: {
    fontSize: fixwidth * 0.033,
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: fixwidth * 0.053,
    marginBottom: fixwidth * 0.01,
    color: '#666',
  },
  goto: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: fixwidth * 0.01,
  },
  gotoText: {
    paddingHorizontal: fixwidth * 0.003,
    fontSize: fixwidth * 0.0337,
    fontFamily: 'NotoSansKR-Medium',
    color: '#000000',
    marginRight: fixwidth * 0.01,
  },
});
