import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import Header from '../../components/public/publicHeader/Header';
import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import SortTabs from '../../components/public/etc/SortTabs';
import BookReviewItem from '../../components/bookDetailpage/review/BookReviewItem';
import BookDetailRatingSummaryBlock from '../../components/bookDetailpage/BookDetailRatingSummaryBlock';
import WriteButton from '../../components/public/publicButton/WriteButton';
import AlertPopup from '../../components/public/publicPopup_Alert_etc/AlertPopup';
import TitleOnlyPopup from '../../components/public/publicPopup_Alert_etc/TitleOnlyPopup';

import {
  checkAlreadyReviewed,
  getBookReviewList,
  toggleLikeReview,
  deleteReview,
} from '../../apis/apiFunction_book';

const { width: fixwidth } = Dimensions.get('window');

const BookReviewListScreen = ({ route, navigation }) => {
  const { isbn13 } = route.params;

  const [reviews, setReviews] = useState([]);
  const [sort, setSort] = useState('like');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 10;

  const fetchReviews = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);
    try {
      const res = await getBookReviewList(isbn13, sort, reset ? 0 : offset, LIMIT);
      const data = res.data;

      if (reset) {
        setReviews(data.reviews);
        setOffset(LIMIT);
        setTotalCount(data.totalCount);
      } else {
        setReviews((prev) => [...prev, ...data.reviews]);
        setOffset((prev) => prev + LIMIT);
      }

      setHasMore(data.reviews.length === LIMIT);
      setAverageRating(data.averageRating);
      setRatingDistribution(data.ratingDistribution);
      if (reset) setIsReady(true);
    } catch (err) {
      console.error('❌ 리뷰 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(true);
  }, [sort]);

  const handleLikePress = async (id) => {
    try {
      await toggleLikeReview(id);
      fetchReviews(true);
    } catch (err) {
      console.error('좋아요 실패:', err);
    }
  };

  const handleEditPress = (review) => {
    navigation.navigate('ReviewEditScreen', { review, isbn13 });
  };

  const handleDeletePress = (id) => {
    setSelectedReviewId(id);
    setDeletePopupVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReview(selectedReviewId);
      setDeletePopupVisible(false);
      fetchReviews(true);
    } catch (err) {
      console.error('❌ 리뷰 삭제 실패:', err);
    }
  };

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

  if (!isReady) {
    return (
      <CommonLayout>
        <Header title="리뷰" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#aaa" />
        </View>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout>
      <Header title={`리뷰 (${totalCount})`} />
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewItemWrapper}>
            <BookReviewItem
              item={item}
              onLikePress={handleLikePress}
              onReportPress={(id) => console.log('신고 ID:', id)}
              onEditPress={handleEditPress}
              onDeletePress={handleDeletePress}
            />
          </View>
        )}
        onEndReached={() => fetchReviews(false)}
        onEndReachedThreshold={0.7}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            <BookDetailRatingSummaryBlock
              averageRating={averageRating}
              ratingDistribution={ratingDistribution}
            />
            <WriteButton label="리뷰 쓰기" onPress={handleWritePress} />
            <View style={styles.sortTabWrapper}>
              <SortTabs currentSort={sort} onChange={setSort} />
            </View>
          </View>
        }
        ListFooterComponent={
          loading && (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="small" color="#aaa" />
            </View>
          )
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />

      {/* 리뷰 중복 작성 알림 */}
      <AlertPopup
        visible={alertVisible}
        title="이미 리뷰를 작성했어요"
        message="리뷰는 한 권당 한 번만 작성할 수 있어요."
        onClose={() => setAlertVisible(false)}
      />

      {/* 리뷰 삭제 팝업 */}
      <TitleOnlyPopup
        visible={deletePopupVisible}
        title="리뷰를 삭제할까요?"
        onCancel={() => setDeletePopupVisible(false)}
        onConfirm={handleDeleteConfirm}
      />
    </CommonLayout>
  );
};

export default BookReviewListScreen;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: fixwidth * 0.11,
    paddingHorizontal: fixwidth * 0.01,
  },
  headerSection: {
    width: '94%',
    alignSelf: 'center',
    gap: fixwidth * 0.035,
    marginTop: fixwidth * 0.03,
  },
  sortTabWrapper: {
  },
  loadingWrapper: {
    marginTop: fixwidth * 0.05,
    alignItems: 'center',
  },
  reviewItemWrapper: {
    marginBottom: fixwidth * 0.03,
    paddingHorizontal: fixwidth * 0.025,
  },
});
