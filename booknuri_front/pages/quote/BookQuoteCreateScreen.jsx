import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import Header from '../../components/public/publicHeader/Header';
import BookMiniHeaderBlock from '../../components/public/bookpublic/BookMiniHeaderBlock';
import WriteButton from '../../components/public/publicButton/WriteButton';
import TitleOnlyPopup from '../../components/public/publicPopup_Alert_etc/TitleOnlyPopup';
import CustomCheckBox from '../../components/public/publicUtil/CustomCheckBox';



import { createBookQuote } from '../../apis/apiFunction_bookQuote';
import { getBookTotalInfo } from '../../apis/apiFunction_book';
import QuoteInputPreviewBlock from '../../components/bookDetailpage/quote/QuoteInputPreviewBlock';
import QuoteBackgroundSelector from '../../components/bookDetailpage/quote/QuoteBackgroundSelector';
import QuoteFontSizeSlider from '../../components/bookDetailpage/quote/QuoteFontSizeSlider';
import QuoteFontColorSelector from '../../components/bookDetailpage/quote/QuoteFontColorSelector';
import {StackActions} from '@react-navigation/native';

const { width: fixwidth } = Dimensions.get('window');

const BookQuoteCreateScreen = ({ route, navigation }) => {
  const { isbn13, returnScreenName = 'BookDetailScreen' } = route.params;

  const [bookData, setBookData] = useState(null);
  const [quoteText, setQuoteText] = useState('');
  const [backgroundId, setBackgroundId] = useState(1);
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [fontScale, setFontScale] = useState(7.0); // 기본값 중간
  const [visibleToPublic, setVisibleToPublic] = useState(true);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);


  const fetchBookData = async () => {
    try {
      const res = await getBookTotalInfo(isbn13);
      setBookData(res.data.bookInfo);
      await new Promise((r) => setTimeout(r, 150));
      setIsReady(true);
    } catch (err) {
      console.error('❌ 책 정보 로딩 실패:', err);
    }
  };

  const handleSubmit = async () => {
    try {
      await createBookQuote({
        isbn13,
        quoteText,
        fontScale,
        fontColor,
        backgroundId,
        visibleToPublic,
      });
      navigation.dispatch(StackActions.pop(1));

    } catch (err) {
      console.error('❌ 인용 저장 실패:', err);
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
          <Header title="인용 작성" />
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

              <QuoteInputPreviewBlock
                quoteText={quoteText}
                backgroundId={backgroundId}
                fontColor={fontColor}
                fontScale={fontScale}
                onChangeText={setQuoteText}
              />


              <QuoteFontSizeSlider
                fontScale={fontScale}
                onChange={setFontScale}
              />

              <QuoteFontColorSelector
                fontColor={fontColor}
                onSelect={setFontColor}
              />

              <QuoteBackgroundSelector
                selectedId={backgroundId}
                onSelect={setBackgroundId}
              />


              <CustomCheckBox
                label="전체공개"
                value={visibleToPublic}
                onChange={setVisibleToPublic}
              />

              <WriteButton
                label="인용 등록"
                onPress={() => {
                  if (quoteText.trim() === '') return;
                  setConfirmVisible(true);
                }}
              />
            </View>
          </ScrollView>

          <TitleOnlyPopup
            visible={confirmVisible}
            title="이 인용을 등록할까요?"
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

export default BookQuoteCreateScreen;

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
