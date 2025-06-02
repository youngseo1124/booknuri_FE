// QuoteCaptureScreen.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  NativeModules,
  Platform,
  ScrollView,
} from 'react-native';

import { getMyQuoteById } from '../apis/apiFunction_bookQuote';
import PureQuoteContent from '../components/bookDetailpage/quote/PureQuoteContent';
import IconCheckBox from '../components/public/publicButton/CustomCheckBox';
import VerticalGap from '../components/public/publicUtil/VerticalGap';

import Header from '../components/public/publicHeader/Header';
import WriteButton from '../components/public/publicButton/WriteButton';

import { captureRef } from 'react-native-view-shot';
import CommonLayout from '../components/public/publicUtil/CommonLayout';

import AlertPopup from '../components/public/publicPopup_Alert_etc/AlertPopup';  // 모달 팝업 임포트

const { width: fixwidth } = Dimensions.get('window');
const { MediaStoreModule } = NativeModules;

const QuoteCaptureScreen = ({ route, navigation }) => {
  const { quoteId } = route.params;
  const [quote, setQuote] = useState(null);
  const [includeTitle, setIncludeTitle] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false); // 모달 표시 여부
  const viewRef = useRef();

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyQuoteById(quoteId);
        setQuote(res.data);
      } catch (err) {
        console.error('❌ 인용 불러오기 실패:', err);
      }
    })();
  }, [quoteId]);

  const handleDownload = async () => {
    if (!viewRef.current) {
      return;
    }

    try {
      const uri = await captureRef(viewRef, { format: 'png', quality: 1 });

      if (Platform.OS === 'android') {
        const success = await MediaStoreModule.saveImage(uri);
        if (success) {
          setAlertVisible(true);
        } else {
          alert('이미지 저장에 실패했습니다.');
        }
      } else {
        alert('iOS는 아직 구현 안 됨');
      }
    } catch (e) {
      console.error('❌ 이미지 저장 중 오류:', e);
      alert('이미지 저장 중 오류가 발생했습니다.');
    }
  };

  // 팝업 닫을 때 (취소, 확인 모두 뒤로가기)
  const onAlertClose = () => {
    setAlertVisible(false);
    navigation.goBack();
  };

  if (!quote) return null;

  return (
    <CommonLayout>
      <Header title="인용 이미지 저장" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wrapper}>
          <VerticalGap height={fixwidth * 0.027} />

          <View collapsable={false} ref={viewRef} style={styles.captureView}>
            {includeTitle ? (
              <PureQuoteContent
                quoteText={quote.quoteText}
                fontColor={quote.fontColor}
                fontScale={quote.fontScale}
                backgroundId={quote.backgroundId}
                showTitle={true}
                bookTitle={quote.bookTitle}
                capture={true}
              />
            ) : (
              <PureQuoteContent
                quoteText={quote.quoteText}
                fontColor={quote.fontColor}
                fontScale={quote.fontScale}
                backgroundId={quote.backgroundId}
                showTitle={false}
                bookTitle=""
                capture={true}
              />
            )}
          </View>

          <VerticalGap height={fixwidth * 0.02} />

          <IconCheckBox
            label="제목 포함하여 저장하기"
            value={includeTitle}
            onChange={setIncludeTitle}
          />

          <VerticalGap height={fixwidth * 0.077} />

          <WriteButton label="이미지로 저장하기" onPress={handleDownload} />
        </View>
      </ScrollView>

      {/* 저장 완료 모달 팝업 */}
      <AlertPopup
        visible={alertVisible}
        title="저장 완료"
        message="갤러리를 확인해주세요~"
        onClose={onAlertClose}  // 이 함수에서 뒤로가기까지 처리
      />
    </CommonLayout>
  );
};

export default QuoteCaptureScreen;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: fixwidth * 0.05,
    paddingBottom: fixwidth * 0.1,
  },
  wrapper: {
    alignItems: 'center',
  },
  captureView: {
    width: fixwidth * 0.9,
    height: fixwidth * 0.55,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
});
