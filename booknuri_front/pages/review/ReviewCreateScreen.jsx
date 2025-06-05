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
import { createReview, getBookTotalInfo } from '../../apis/apiFunction_book';
import BookMiniHeaderBlock from '../../components/public/bookpublic/BookMiniHeaderBlock';
import ReviewFormBlock from '../../components/bookDetailpage/review/ReviewWriteFormBlock';
import CustomCheckBox from '../../components/public/publicButton/CustomCheckBox';
import WriteButton from '../../components/public/publicButton/WriteButton';
import TitleOnlyPopup from '../../components/public/publicPopup_Alert_etc/TitleOnlyPopup';
import StarRatingBox from '../../components/public/etc/StarRatingBox';
import TextInputBox from '../../components/public/publicInput/TextInputBox'; // ✅ 바뀐 부분

const { width: fixwidth } = Dimensions.get('window');

const ReviewCreateScreen = ({ route, navigation }) => {
  const { isbn13, returnScreenName = 'BookDetailScreen' } = route.params;


  const [bookData, setBookData] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [containsSpoiler, setContainsSpoiler] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [isReady, setIsReady] = useState(false);

  const handleSubmit = async () => {
    try {
      await createReview({
        isbn13,
        content: reviewText,
        rating,
        containsSpoiler,
      });
      navigation.replace(returnScreenName, { isbn: isbn13 });
    } catch (err) {
      console.error('❌ 리뷰 등록 실패:', err);
    }
  };

  const fetchBookData = async () => {
    try {
      const res = await getBookTotalInfo(isbn13);
      setBookData(res.data.bookInfo);
      await new Promise((resolve) => setTimeout(resolve, 200));
      setIsReady(true);
    } catch (error) {
      console.error('❌ 책 정보 불러오기 실패:', error);
    }
  };

  useEffect(() => {
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
          <Header title="리뷰 작성" />
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
                inputHeight={fixwidth * 0.5}
                value={reviewText}
                onChangeText={setReviewText}
              />


              <CustomCheckBox
                label="스포일러 체크"
                value={containsSpoiler}
                onChange={setContainsSpoiler}
              />

              <WriteButton
                label="리뷰 작성"
                onPress={() => {
                  if (rating === 0 || reviewText.trim() === '') return;
                  setConfirmVisible(true);
                }}
              />

            </View>


          </ScrollView>

          <TitleOnlyPopup
            visible={confirmVisible}
            title="리뷰를 등록할까요?"
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

export default ReviewCreateScreen;

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
