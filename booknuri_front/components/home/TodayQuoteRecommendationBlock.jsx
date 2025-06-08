import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import SectionHeaderWithIcon from '../public/publicHeader/SectionHeaderWithIcon';
import VerticalGap from '../public/publicUtil/VerticalGap';
import TitleOnlyPopup from '../public/publicPopup_Alert_etc/TitleOnlyPopup';
import BookQuoteBanner from '../bookDetailpage/quote/BookQuoteBanner';

const { width: fixwidth } = Dimensions.get('window');

/**
 * 🧠 오늘의 인용 블록 (props 기반)
 * @param {Array} quotes - 인용 리스트
 * @param {Function} onLikePress - 좋아요 클릭 핸들러
 * @param {Function} onEditPress - 수정 이동 핸들러
 * @param {Function} onDeletePress - 삭제 핸들러
 * @param {Function} onReportPress - 신고 핸들러
 */
const TodayQuoteRecommendationBlock = ({
                                         quotes = [],
                                         onLikePress,
                                         onEditPress,
                                         onDeletePress,
                                         onReportPress,
                                       }) => {
  const navigation = useNavigation();
  const [containerWidth, setContainerWidth] = useState(0);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);

  // ✅ 삭제 팝업 띄우기
  const handleDelete = (quoteId) => {
    setSelectedQuoteId(quoteId);
    setDeletePopupVisible(true);
  };

  // ✅ 삭제 확정
  const confirmDelete = async () => {
    if (onDeletePress) {
      await onDeletePress(selectedQuoteId);
    }
    setDeletePopupVisible(false);
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
          quotes={quotes}
          containerWidth={containerWidth}
          onLikePress={onLikePress}
          onEditPress={onEditPress}
          onDeletePress={handleDelete}
          onReportPress={onReportPress}
          onQuotePress={(isbn13) => {
            navigation.navigate('BookDetailScreen', { isbn: isbn13 });
          }}
        />
      )}

      <TitleOnlyPopup
        visible={deletePopupVisible}
        title="이 인용을 삭제할까요?"
        onCancel={() => setDeletePopupVisible(false)}
        onConfirm={confirmDelete}
      />
    </View>
  );
};

export default TodayQuoteRecommendationBlock;
