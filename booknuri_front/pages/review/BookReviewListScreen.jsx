import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard, ScrollView,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';

import Header from '../../components/public/publicHeader/Header';
import CommonLayout from '../../components/public/bookpublic/CommonLayout';
import SortTabs from '../../components/public/bookpublic/SortTabs';
import BookReviewItem from '../../components/public/bookpublic/BookReviewItem';
import {checkAlreadyReviewed, getBookReviewList, toggleLikeReview} from '../../apis/apiFunction_book';
import BookDetailRatingSummaryBlock from '../../components/bookDetailpage/BookDetailRatingSummaryBlock';
import WriteButton from '../../components/public/publicButton/WriteButton';
import AlertPopup from '../../components/public/publicPopup_Alert_etc/AlertPopup';

const { width: fixwidth } = Dimensions.get('window');

const BookReviewListScreen = ({ route, navigation }) => {
  const { isbn13 } = route.params;

  const [reviews, setReviews] = useState([]);
  const [sort, setSort] = useState('like');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const LIMIT = 20;




  const fetchReviews = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);
    try {
      const res = await getBookReviewList(isbn13, sort, reset ? 0 : offset, LIMIT);
      const data = res.data;

      if (reset) {
        setReviews(data.reviews);
        setOffset(LIMIT);
      } else {
        setReviews((prev) => [...prev, ...data.reviews]);
        setOffset((prev) => prev + LIMIT);
      }

      setHasMore(data.reviews.length === LIMIT);
      setAverageRating(data.averageRating);
      setRatingDistribution(data.ratingDistribution);

      //  준비 완료 표시
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

  const renderStars = (rating) => {
    const fullStars = Math.round(rating / 2);
    return [...Array(5)].map((_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={i < fullStars ? solidStar : emptyStar}
        size={fixwidth * 0.045}
        color="#FFBC00"
        style={{ marginHorizontal: fixwidth * 0.007 }}
      />
    ));
  };

  const handleLikePress = async (id) => {
    try {
      await toggleLikeReview(id);
      fetchReviews(true);
    } catch (err) {
      console.error('좋아요 실패:', err);
    }
  };

  const handleReportPress = (id) => {
    console.log('신고 ID:', id);
  };

  const handleEditPress = (review) => {
    navigation.navigate('ReviewEditScreen', { review, isbn13 });
  };

  const handleDeletePress = (id) => {
    console.log('삭제 ID:', id);
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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#aaa" />
        </View>
      </CommonLayout>
    );
  }else

  return (
    <CommonLayout>

      <Header title={`리뷰 (${reviews.length})`} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >



        <View style={styles.innerBox}>
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


          <View style={styles.reviewListContainer}>
            {reviews.map((item) => (
              <View key={item.id} style={styles.reviewItemWrapper}>
                <BookReviewItem
                  item={item}
                  onLikePress={handleLikePress}
                  onReportPress={handleReportPress}
                  onEditPress={handleEditPress}
                  onDeletePress={handleDeletePress}
                />
              </View>
            ))}
          </View>

          {/* 로딩 인디케이터 */}
          {loading && (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="small" color="#aaa" />
            </View>
          )}
        </View>

      </ScrollView>
      <AlertPopup
        visible={alertVisible}
        title="이미 리뷰를 작성했어요"
        message="리뷰는 한 권당 한 번만 작성할 수 있어요."
        onClose={() => setAlertVisible(false)}
      />
    </CommonLayout>
  );




};

export default BookReviewListScreen;

const styles = StyleSheet.create({
  averageContainer: {
    width: '100%',
    alignItems: 'center',


  },
  scrollContent: {
    width:"100%",
    marginTop: fixwidth * 0.025,
    paddingBottom:fixwidth*0.11
  }
,
  innerBox: {
    width: '94%',
    alignSelf: 'center',
  },
  headerSection: {
    gap: fixwidth * 0.037,
  },

  starRow: {
    flexDirection: 'row',
  },

  sortTabWrapper: {
    width: '100%',
    alignSelf: 'center',
  },
  reviewListContainer: {
    gap: fixwidth * 0.04,
  },
});
