import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import AddToBookshelfButton from './AddToBookshelfButton';

const { width: fixwidth } = Dimensions.get('window');
const DEFAULT_BOOK_COVER = require('../../image/book/bookcover.png');

const DPBookInfoHeaderBlock = ({ bookInfo, isInShelf, onAddToBookshelf }) => {
  const [aspectRatio, setAspectRatio] = useState(0.7);

  const {
    bookname = '제목 없음',
    authors = '저자 미상',
    publisher,
    publicationDate,
    bookImageURL,
    mainCategory,
    middleCategory,
    subCategory,
  } = bookInfo || {};

  const isValidImage = bookImageURL && bookImageURL.trim() !== '';
  const imageSource = isValidImage ? { uri: bookImageURL } : DEFAULT_BOOK_COVER;
  const finalAspectRatio = isValidImage ? aspectRatio : 0.7;

  useEffect(() => {
    if (isValidImage) {
      Image.getSize(
        bookImageURL,
        (w, h) => setAspectRatio(w / h),
        () => setAspectRatio(0.7)
      );
    } else {
      setAspectRatio(0.7); // ✅ 기본 이미지일 때도 비율 고정
    }
  }, [bookImageURL]);

  if (!bookInfo) return null;

  const categoryColors = {
    문학: '#cdf3ee',
    사회과학: '#e3f5e1',
    역사: '#fff3e0',
    예술: '#ede7f6',
    철학: '#f0e5f5',
    기술과학: '#e3f2fd',
    총류: '#f0f4c3',
    자연과학: '#e1f5fe',
    언어: '#f9fbe7',
    종교: '#fbe9e7',
    default: '#ece5e5',
  };

  const categoryText =
    mainCategory && middleCategory && subCategory
      ? ` #${mainCategory} > ${middleCategory} > ${subCategory}`
      : '  ';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.imageWrapper,
          { backgroundColor: categoryColors[mainCategory] || categoryColors.default },
        ]}
      >
        <Image
          source={imageSource}
          style={
            isValidImage
              ? [styles.image, { aspectRatio }] // ✅ 외부 이미지: 비율 기반
              : [styles.image, styles.fallbackImage] // ✅ 기본 이미지: 고정 크기
          }
          resizeMode="cover"
        />

        <AddToBookshelfButton
          onPress={onAddToBookshelf}
          isInShelf={isInShelf}
        />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.title}>{bookname}</Text>
        <Text style={styles.author}>{authors}</Text>
        <Text style={styles.publisher}>
          {publisher} / {publicationDate}
        </Text>
        <Text style={styles.category}>{categoryText}</Text>
      </View>
    </View>
  );
};

export default DPBookInfoHeaderBlock;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    borderRadius: fixwidth * 0.0,
    overflow: 'hidden',
    backgroundColor: '#e0f3de',
    alignItems: 'center',
    paddingVertical: fixwidth * 0.04,
  },
  image: {
    width: '62.7%',
    borderWidth: fixwidth * 0.0017,
    borderColor: '#878787',
    borderRadius: fixwidth * 0.0099,
  },
  textBlock: {
    width: '90%',
    paddingVertical: fixwidth * 0.04,
  },
  title: {
    fontSize: fixwidth * 0.05,
    textAlign: 'left',
    fontFamily: 'NotoSansKR-Bold',
    lineHeight: fixwidth * 0.067,
    paddingVertical: fixwidth * 0.02,
  },
  author: {
    fontSize: fixwidth * 0.037,
    textAlign: 'left',
    fontFamily: 'NotoSansKR-Medium',
    lineHeight: fixwidth * 0.07,
  },
  publisher: {
    fontSize: fixwidth * 0.037,
    color: '#000000',
    textAlign: 'left',
    fontFamily: 'NotoSansKR-Light',
    lineHeight: fixwidth * 0.07,
  },
  category: {
    fontSize: fixwidth * 0.037,
    color: '#6f6f6f',
    textAlign: 'left',
    fontFamily: 'NotoSansKR-Light',
    lineHeight: fixwidth * 0.07,
  },
  fallbackImage: {
    height: fixwidth * 0.97,
    width: fixwidth * 0.67,
  },
});
