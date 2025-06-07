import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import SectionHeader from '../public/publicHeader/SectionHeader';
import SortTabs from '../public/etc/SortTabs';
import MoreButton from '../public/publicButton/MoreButton';
import BookQuoteBanner from './quote/BookQuoteBanner';
import WriteButton from '../public/publicButton/WriteButton';
import VerticalGap from '../public/publicUtil/VerticalGap';
import TitleOnlyPopup from '../public/publicPopup_Alert_etc/TitleOnlyPopup';
import { deleteBookQuote } from '../../apis/apiFunction_bookQuote';
import PureQuoteContent from './quote/PureQuoteContent'; // ✅ 추가

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
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);

  const handleDeleteConfirm = async () => {
    try {
      await deleteBookQuote(selectedQuoteId);
      setDeletePopupVisible(false);
      onSortChange(currentSort);
    } catch (err) {
      console.error('❌ 인용 삭제 실패:', err);
    }
  };

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <SectionHeader label={`인용 (${totalCount})`} />

      {quotes?.length > 0 && containerWidth > 0 ? (
        <BookQuoteBanner
          quotes={quotes}
          containerWidth={containerWidth}
          onLikePress={onLikePress}
          onEditPress={onEditPress}
          onDeletePress={(id) => {
            setSelectedQuoteId(id);
            setDeletePopupVisible(true);
          }}
          onReportPress={onReportPress}
        />
      ) : (
        <View style={{alignItems: 'center' }}>
          <View style={{ width: '95.7%' }}>
            <VerticalGap height={fixwidth*0.01}/>
            <PureQuoteContent
              quoteText={'아직 인용이 없어요.\n첫 인용을 작성해주세요.'}
              backgroundId={18}
              fontColor={'rgba(0,0,0,0.89)'}
              fontScale={7.7}
              height={fixwidth * 0.5}
            />
          </View>
          <VerticalGap height={fixwidth*0.022}/>
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
});
