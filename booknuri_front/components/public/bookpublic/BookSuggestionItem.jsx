// BookSuggestionItem.jsx
import { TouchableOpacity, Image, Text, View, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: fixwidth } = Dimensions.get('window');

const BookSuggestionItem = ({ book, thumbnailWidth = fixwidth * 0.167, thumbnailHeight = fixwidth * 0.23 }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('BookDetailScreen', { isbn: book.isbn13 });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.itemContainer} activeOpacity={0.77} >
      <Image
        source={{ uri: book.bookImageURL }}
        style={[styles.thumbnail, { width: thumbnailWidth, height: thumbnailHeight }]}
      />
      <View style={styles.infoBox}>
        <Text numberOfLines={1} style={styles.bookname}>{book.bookname}</Text>
        <Text numberOfLines={1} style={styles.authors}>{book.authors}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default BookSuggestionItem;


const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    flexDirection: 'row',
    padding: fixwidth * 0.017,
    overflow: 'hidden',
  },
  thumbnail: {
    borderRadius: fixwidth * 0.001,
    marginRight: fixwidth * 0.04,
    borderWidth: fixwidth * 0.0011,
    borderColor: 'rgba(0,0,0,0.38)',
    resizeMode: 'cover',
  },
  infoBox: {
    justifyContent: 'center',
    flex: 1,
  },
  bookname: {
    fontSize: fixwidth * 0.0387,
    fontWeight: '500',
    fontFamily: 'NotoSansKR-Medium',
  },
  authors: {
    fontSize: fixwidth * 0.0307,
    color: 'rgba(0,0,0,0.63)',
    fontFamily: 'NotoSansKR-Light',
  },
});
