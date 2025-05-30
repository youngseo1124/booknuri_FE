import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Text,
} from 'react-native';
import SectionHeader from '../public/bookpublic/SectionHeader';
import BookReviewItem from '../public/bookpublic/BookReviewItem';
import SortTabs from '../public/bookpublic/SortTabs';
import MoreButton from '../public/publicButton/MoreButton';
import WriteButton from '../public/publicButton/WriteButton';
import AlertPopup from '../public/publicPopup_Alert_etc/AlertPopup';
import TitleOnlyPopup from '../public/publicPopup_Alert_etc/TitleOnlyPopup';

import { checkAlreadyReviewed, deleteReview } from '../../apis/apiFunction_book';

const { width: fixwidth } = Dimensions.get('window');

const DPBookReviewsBlock = ({
                            reviews,
                            onLikePress,
                            onReportPress,
                            onSortChange,
                            currentSort,
                            isbn13,
                            navigation,
                          }) => {
  const [alertVisible, setAlertVisible] = useState(false); // ✅ 리뷰 작성 여부 경고
  const [deletePopupVisible, setDeletePopupVisible] = useState(false); // ✅ 삭제 팝업
  const [selectedReviewId, setSelectedReviewId] = useState(null); // ✅ 삭제 대상 ID

  const renderItem = ({ item }) => (
    <BookReviewItem
      item={item}
      onLikePress={onLikePress}
      onReportPress={onReportPress}
      onEditPress={(review) =>
        navigation.navigate('ReviewEditScreen', { review, isbn13 })
      }
      onDeletePress={(reviewId) => {
        setSelectedReviewId(reviewId);
        setDeletePopupVisible(true);
      }}
    />
  );

  const limitedReviews = reviews?.slice(0, 5) || [];

  const handleWritePress = async () => {
    try {
      const res = await checkAlreadyReviewed(isbn13);
      if (res.data.alreadyReviewed) {
        setAlertVisible(true);
        return;
      }
      navigation.navigate('ReviewCreateScreen', { isbn13 });
    } catch (err) {
      console.error('리뷰 여부 확인 실패:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReview(selectedReviewId);
      setDeletePopupVisible(false);
      onSortChange(currentSort); // 새로고침!
    } catch (err) {
      console.error('❌ 리뷰 삭제 실패:', err);
    }
  };

  return (
    <View style={styles.container}>
      <SectionHeader label={`리뷰 (${reviews?.length || 0})`} />
      <SortTabs currentSort={currentSort} onChange={onSortChange} />

      {limitedReviews.length > 0 ? (
        <FlatList
          data={limitedReviews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ gap: fixwidth * 0.04 }}
          style={{ minHeight: fixwidth * 0.17 }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>첫 리뷰를 작성해주세요.</Text>
        </View>
      )}

      <View style={styles.wrapper}>
        <MoreButton
          label="리뷰 전체 보기"
          onPress={() => navigation.navigate('BookReviewListScreen', { isbn13 })}
        />
        <WriteButton label="리뷰 쓰기" onPress={handleWritePress} />
      </View>

      {/*  리뷰 작성 여부 알림 */}
      <AlertPopup
        visible={alertVisible}
        title="이미 리뷰를 작성했어요"
        message="리뷰는 한 권당 한 번만 작성할 수 있어요."
        onClose={() => setAlertVisible(false)}
      />

      {/* 삭제 확인 팝업 */}
      <TitleOnlyPopup
        visible={deletePopupVisible}
        title="리뷰를 삭제할까요?"
        onCancel={() => setDeletePopupVisible(false)}
        onConfirm={handleDeleteConfirm}
      />
    </View>
  );
};

export default DPBookReviewsBlock;

const styles = StyleSheet.create({
  container: {
    width: '93%',
    alignSelf: 'center',
    paddingVertical: fixwidth * 0.07,
  },
  wrapper: {
    paddingTop: fixwidth * 0.025,
    gap: fixwidth * 0.03,
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
