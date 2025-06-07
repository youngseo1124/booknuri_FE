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
import CustomCheckBox from '../../components/public/publicButton/CustomCheckBox';

import { getBookTotalInfo } from '../../apis/apiFunction_book';
import { getMyQuoteById, updateBookQuote } from '../../apis/apiFunction_bookQuote';

import QuoteInputPreviewBlock from '../../components/bookDetailpage/quote/QuoteInputPreviewBlock';
import QuoteBackgroundSelector from '../../components/bookDetailpage/quote/QuoteBackgroundSelector';
import QuoteFontSizeSlider from '../../components/bookDetailpage/quote/QuoteFontSizeSlider';
import QuoteFontColorSelector from '../../components/bookDetailpage/quote/QuoteFontColorSelector';
import {StackActions} from '@react-navigation/native';

const { width: fixwidth } = Dimensions.get('window');

const BookQuoteEditScreen = ({ route, navigation }) => {
  const { quoteId, isbn13, returnScreenName = 'BookDetailScreen' } = route.params;

  const [bookData, setBookData] = useState(null);
  const [quoteText, setQuoteText] = useState('');
  const [backgroundId, setBackgroundId] = useState(1);
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [fontScale, setFontScale] = useState(7.0);
  const [visibleToPublic, setVisibleToPublic] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const fetchInitialData = async () => {
    try {
      const [bookRes, quoteRes] = await Promise.all([
        getBookTotalInfo(isbn13),
        getMyQuoteById(quoteId),
      ]);

      setBookData(bookRes.data.bookInfo);

      const q = quoteRes.data;
      setQuoteText(q.quoteText);
      setBackgroundId(q.backgroundId);
      setFontColor(q.fontColor);
      setFontScale(q.fontScale);
      setVisibleToPublic(q.visibleToPublic);

      await new Promise((r) => setTimeout(r, 150));
      setIsReady(true);
    } catch (err) {
      console.error('❌ 데이터 로딩 실패:', err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (quoteText.trim() === '') return;
      await updateBookQuote({
        quoteId,
        quoteText,
        fontScale,
        fontColor,
        backgroundId,
        visibleToPublic,
      });
      navigation.dispatch(StackActions.pop(1));

    } catch (err) {
      console.error('❌ 인용 수정 실패:', err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [quoteId]);

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
          <Header title="인용 수정" />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.contentContainer}
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
                label="인용 수정"
                onPress={handleSubmit} // ✅ 바로 수정되게 변경
              />
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </CommonLayout>
  );
};

export default BookQuoteEditScreen;

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
