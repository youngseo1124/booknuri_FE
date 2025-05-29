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

import Header from '../../components/public/Header';
import CommonLayout from '../../components/public/CommonLayout';
import {
  updateReview,
  getMyReviewByIsbn,
} from '../../apis/apiFunction_book';
import ReviewFormBlock from '../../components/bookDetailpage/ReviewWriteFormBlock';
import CustomCheckBox from '../../components/bookpublic/CustomCheckBox';
import WriteButton from '../../components/bookpublic/WriteButton';
import TitleOnlyPopup from '../../components/public/TitleOnlyPopup';
import ReviewEditFormBlock from '../../components/bookDetailpage/ReviewEditFormBlock';

const { width: fixwidth } = Dimensions.get('window');

const ReviewEditScreen = ({ route, navigation }) => {
  const { isbn13 } = route.params;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [containsSpoiler, setContainsSpoiler] = useState(false);
  const [reviewId, setReviewId] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);

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
    fetchMyReview();
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
              <ReviewEditFormBlock
                placeholder="한글 기준 100자까지 작성 가능"
                maxLength={100}
                inputHeight={fixwidth * 0.55}
                onRatingChange={setRating}
                onTextChange={setReviewText}
                initialRating={rating}
                initialText={reviewText}
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
