import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import Header from '../../components/public/publicHeader/Header';
import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import {
  updateReview,
  getMyReviewByIsbn, getBookTotalInfo,
} from '../../apis/apiFunction_book';
import ReviewFormBlock from '../../components/bookDetailpage/review/ReviewWriteFormBlock';
import CustomCheckBox from '../../components/public/publicButton/CustomCheckBox';
import WriteButton from '../../components/public/publicButton/WriteButton';
import TitleOnlyPopup from '../../components/public/publicPopup_Alert_etc/TitleOnlyPopup';
import ReviewEditFormBlock from '../../components/bookDetailpage/review/ReviewEditFormBlock';
import TextInputBox from '../../components/public/publicInput/TextInputBox';
import StarRatingBox from '../../components/public/bookpublic/StarRatingBox';
import BookMiniHeaderBlock from '../../components/public/bookpublic/BookMiniHeaderBlock';

const { width: fixwidth } = Dimensions.get('window');

const ReviewEditScreen = ({ route, navigation }) => {
  const { isbn13 } = route.params;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [containsSpoiler, setContainsSpoiler] = useState(false);
  const [reviewId, setReviewId] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [bookData, setBookData] = useState(null);

  const handleSubmit = async () => {
    try {
      await updateReview({
        reviewId,
        content: reviewText,
        rating,
        containsSpoiler,
      });
      navigation.replace('BookDetailScreen', { isbn: isbn13 });
    } catch (err) {
      console.error('❌ 리뷰 수정 실패:', err);
    }
  };

  const fetchBookData = async () => {
    try {
      const res = await getBookTotalInfo(isbn13);
      setBookData(res.data.bookInfo);
    } catch (error) {
      console.error('❌ 책 정보 불러오기 실패:', error);
    }
  };


  const fetchMyReview = async () => {
    try {
      const res = await getMyReviewByIsbn(isbn13);
      console.log('📥 내 리뷰 조회 응답:', res.data);
      const data = res.data;
      setReviewId(data.id);
      setRating(data.rating);
      setReviewText(data.content);
      setContainsSpoiler(data.containsSpoiler);
      await new Promise((r) => setTimeout(r, 150));
      setIsReady(true);
    } catch (err) {
      console.error('❌ 기존 리뷰 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchMyReview(); // 기존 리뷰 불러오기
    fetchBookData();
  }, [isbn13]);

  if (!isReady) {
    return (
      <CommonLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <Header title="리뷰 수정" />
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.innerContainer}>

              <BookMiniHeaderBlock
                imageUrl={bookData.bookImageURL}
                title={bookData.bookname}
                authors={bookData.authors}
              />

              <StarRatingBox
                value={rating}
                onChange={setRating}
              />

              <TextInputBox
                placeholder="한글 기준 100자까지 작성 가능"
                maxLength={100}
                inputHeight={fixwidth * 0.55}
                value={reviewText}
                onChangeText={setReviewText}
              />

              <CustomCheckBox
                label="스포일러 체크"
                value={containsSpoiler}
                onChange={setContainsSpoiler}
              />

              <WriteButton
                label="리뷰 수정"
                onPress={() => {
                  if (rating === 0 || reviewText.trim() === '') return;
                  setConfirmVisible(true);
                }}
              />
            </View>
          </ScrollView>

          <TitleOnlyPopup
            visible={confirmVisible}
            title="리뷰를 수정할까요?"
            onCancel={() => setConfirmVisible(false)}
            onConfirm={() => {
              setConfirmVisible(false);
              handleSubmit();
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </CommonLayout>
  );
};

export default ReviewEditScreen;

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingVertical: fixwidth * 0.05,
    paddingHorizontal: fixwidth * 0.06,
    backgroundColor: '#fff',
  },
  innerContainer: {
    gap: fixwidth * 0.037,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
