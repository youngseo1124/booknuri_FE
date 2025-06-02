import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import SectionHeader from '../../public/bookpublic/SectionHeader';
import SortTabs from '../../public/bookpublic/SortTabs';
import MoreButton from '../../public/publicButton/MoreButton';
import BookQuoteBanner from './BookQuoteBanner';
import WriteButton from '../../public/publicButton/WriteButton';
import VerticalGap from '../../public/publicUtil/VerticalGap';
import TitleOnlyPopup from '../../public/publicPopup_Alert_etc/TitleOnlyPopup'; // ✅ 삭제 팝업
import { deleteBookQuote } from '../../../apis/apiFunction_bookQuote'; // ✅ 인용 삭제 API

const { width: fixwidth } = Dimensions.get('window');

const DPBookQuotesBlock = ({
                             quotes,
                             totalCount,
                             currentSort,
                             onSortChange,
                             isbn13,
                             navigation,
                             onLikePress,
                             onEditPress,
                             onReportPress,
                           }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false); // ✅ 삭제 팝업 상태
  const [selectedQuoteId, setSelectedQuoteId] = useState(null); // ✅ 선택된 ID

  // ✅ 삭제 확인 처리
  const handleDeleteConfirm = async () => {
    try {
      await deleteBookQuote(selectedQuoteId); // API 호출
      setDeletePopupVisible(false);
      onSortChange(currentSort); // 새로고침
    } catch (err) {
      console.error('❌ 인용 삭제 실패:', err);
    }
  };

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)} // ✅ 퍼센트 폭 측정
    >
      <SectionHeader label={`인용 (${totalCount})`} />

      {quotes?.length > 0 && containerWidth > 0 ? (
        <BookQuoteBanner
          quotes={quotes}
          containerWidth={containerWidth}
          onLikePress={onLikePress}
          onEditPress={onEditPress}
          onDeletePress={(id) => {
            setSelectedQuoteId(id); // ✅ 인용 ID 저장
            setDeletePopupVisible(true); // ✅ 팝업 열기
          }}
          onReportPress={onReportPress}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>아직 인용이 없어요.</Text>
        </View>
      )}

      <MoreButton
        label="인용 전체 보기"
        onPress={() => navigation.navigate('BookQuoteListScreen', { isbn13 })}
      />
      <VerticalGap height={fixwidth * 0.02} />
      <WriteButton
        label="인용 쓰기"
        onPress={() =>
          navigation.navigate('BookQuoteCreateScreen', {
            isbn13,
            returnScreenName: 'BookDetailScreen',
          })
        }
      />

      {/* ✅ 삭제 팝업 */}
      <TitleOnlyPopup
        visible={deletePopupVisible}
        title="이 인용을 삭제할까요?"
        onCancel={() => setDeletePopupVisible(false)}
        onConfirm={handleDeleteConfirm}
      />
    </View>
  );
};

export default DPBookQuotesBlock;

const styles = StyleSheet.create({
  container: {
    width: '93%',
    alignSelf: 'center',
    paddingVertical: fixwidth * 0.07,
  },
  emptyContainer: {
    minHeight: fixwidth * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: fixwidth * 0.02,
  },
  emptyText: {
    fontSize: fixwidth * 0.033,
    color: '#888',
    fontFamily: 'NotoSansKR-Regular',
  },
});
