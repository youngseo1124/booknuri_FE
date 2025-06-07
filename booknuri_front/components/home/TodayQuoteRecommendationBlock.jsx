import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import SectionHeaderWithIcon from '../public/publicHeader/SectionHeaderWithIcon';
import VerticalGap from '../public/publicUtil/VerticalGap';
import TitleOnlyPopup from '../public/publicPopup_Alert_etc/TitleOnlyPopup';
import BookQuoteBanner from '../bookDetailpage/quote/BookQuoteBanner';

import {
  getPopularBookQuotes,
  toggleBookQuoteLike,
  deleteBookQuote,
} from '../../apis/apiFunction_bookQuote';

const { width: fixwidth } = Dimensions.get('window');

const TodayQuoteRecommendationBlock = () => {
  const navigation = useNavigation();

  const [popularQuotes, setPopularQuotes] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);

  // ✅ 인기 인용 목록 불러오기
  const fetchQuotes = async () => {
    try {
      const res = await getPopularBookQuotes(0, 20);
      setPopularQuotes(res.data.quotes);
    } catch (err) {
      console.error('❌ 인기 인용 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // ✅ 좋아요 핸들러
  const handleLikeQuote = async (quoteId) => {
    try {
      await toggleBookQuoteLike(quoteId);
      await fetchQuotes(); // 갱신
    } catch (err) {
      console.error('❌ 인용 좋아요 실패:', err);
    }
  };

  // ✅ 수정 이동
  const handleEditQuote = (quoteItem) => {
    navigation.navigate('BookQuoteEditScreen', {
      quoteId: quoteItem.id,
      isbn13: quoteItem.isbn13,
      returnScreenName: 'HomeScreen',
    });
  };

  // ✅ 삭제 팝업 띄우기
  const handleDeleteQuote = (quoteId) => {
    setSelectedQuoteId(quoteId);
    setDeletePopupVisible(true);
  };

  // ✅ 삭제 확정
  const confirmDeleteQuote = async () => {
    try {
      await deleteBookQuote(selectedQuoteId);
      setDeletePopupVisible(false);
      await fetchQuotes(); // 갱신
    } catch (err) {
      console.error('❌ 인용 삭제 실패:', err);
    }
  };

  // ✅ 신고
  const handleReportQuote = (quoteId) => {
    // 신고 로직 필요시 작성
    console.log('🚨 신고:', quoteId);
  };

  return (
    <View
      style={{ width: '93%', alignSelf: 'center' }}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <SectionHeaderWithIcon label="오늘의 인용" />
      <VerticalGap height={fixwidth * 0.022} />

      {containerWidth > 0 && (
        <BookQuoteBanner
          quotes={popularQuotes}
          containerWidth={containerWidth}
          onLikePress={handleLikeQuote}
          onEditPress={handleEditQuote}
          onDeletePress={handleDeleteQuote}
          onReportPress={handleReportQuote}
          onQuotePress={(isbn13) => {
            navigation.navigate('BookDetailScreen', { isbn: isbn13 });
          }}
        />
      )}

      {/* ✅ 삭제 확인 팝업 */}
      <TitleOnlyPopup
        visible={deletePopupVisible}
        title="이 인용을 삭제할까요?"
        onCancel={() => setDeletePopupVisible(false)}
        onConfirm={confirmDeleteQuote}
      />
    </View>
  );
};

export default TodayQuoteRecommendationBlock;
