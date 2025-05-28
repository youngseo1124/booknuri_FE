import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import BookFallbackCover from './BookFallbackCover';

const { width: fixwidth } = Dimensions.get('window');

const BookInfoHeaderBlock = ({ bookInfo }) => {
  const [aspectRatio, setAspectRatio] = useState(0.7); // 📐 기본 비율



  const categoryColors = {
    문학: '#ffecf1',
    사회과학: '#e3f5e1',
    역사: '#fff3e0',
    예술: '#ede7f6',
    철학: '#f0e5f5',
    기술과학: '#e3f2fd',
    총류: '#f0f4c3',
    자연과학: '#e1f5fe',
    언어: '#f9fbe7',
    종교: '#fbe9e7',
    default: '#ece5e5', // 널 또는 매칭 안되는 경우
  };



  //  이미지 비율 자동 계산
  useEffect(() => {
    if (bookImageURL) {
      Image.getSize(
        bookImageURL,
        (w, h) => {
          if (w && h) {
            setAspectRatio(w / h); // 가로 ÷ 세로
          }
        },
        () => {
          setAspectRatio(0.7); // 실패시 기본값
        }
      );
    }
  }, [bookImageURL]);

  if (!bookInfo) return null;

  const {
    bookname = '제목 없음',
    authors = '저자 미상',
    publisher,
    publicationDate,
    bookImageURL,
    mainCategory,
    middleCategory,
    subCategory,
  } = bookInfo;

  const categoryText =
    mainCategory && middleCategory && subCategory
      ? ` #${mainCategory} > ${middleCategory} > ${subCategory}`
      : '  ';

  return (
    <View style={styles.container}>
      {/*  책 표지 이미지 감싸는 뷰 박스 추가 */}
      <View
        style={[
          styles.imageWrapper,
          { backgroundColor: categoryColors[mainCategory] || categoryColors.default }
        ]}
      >

      {bookImageURL ? (
          <Image
            source={{ uri: bookImageURL }}
            style={[styles.image, { aspectRatio }]}
            resizeMode="cover"
          />
        ) : (
          <BookFallbackCover title={bookname} />
        )}
      </View>

      {/*  책 기본 정보 텍스트 */}
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

export default BookInfoHeaderBlock;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '93%',
    borderRadius: fixwidth*0.02,
    overflow: 'hidden',
    backgroundColor: '#e0f3de',
    alignItems: 'center',
    paddingVertical: fixwidth*0.04,
  },

  image: {
    width: '67%',
    borderWidth: fixwidth*0.0017,
    borderColor: '#878787',
    borderRadius:fixwidth*0.0099,
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
    paddingVertical:fixwidth*0.02

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
});
