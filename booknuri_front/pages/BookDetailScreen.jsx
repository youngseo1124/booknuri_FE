import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import CommonLayout from '../components/public/CommonLayout';
import Header from '../components/public/Header';
import {
    getBookTotalInfo,
    getBookReviewList,
    toggleLikeReview,
} from '../apis/apiFunction_book';
import BookInfoHeaderBlock from '../components/bookDetailpage/BookInfoHeaderBlock';
import BookInfoContentBlock from '../components/bookDetailpage/BookInfoContentBlock';
import DividerBlock from '../components/public/DividerBlock';
import BookRatingSummaryBlock from '../components/bookDetailpage/BookRatingSummaryBlock';
import ToastPopup from '../components/public/ToastPopup';
import BookReviewsBlock from '../components/bookDetailpage/BookReviewsBlock.';

const { width: fixwidth } = Dimensions.get('window');

const BookDetailScreen = ({ route, navigation }) => {
    const { isbn } = route.params;

    const [bookData, setBookData] = useState(null);         // 📕 책 정보
    const [sortedReviews, setSortedReviews] = useState([]); // ✍ 리뷰 목록
    const [reviewSort, setReviewSort] = useState('new');    // 📊 정렬 기준
    const [averageRating, setAverageRating] = useState(0);  // ⭐ 평균 별점
    const [ratingDistribution, setRatingDistribution] = useState({}); // 📈 별점 분포
    const [showToast, setShowToast] = useState(false);      // ✅ 토스트 표시 여부
    const [isReady, setIsReady] = useState(false);          // ⏳ 전체 준비 여부

    //  책 정보 불러오기
    const fetchBookData = async () => {
        const res = await getBookTotalInfo(isbn);
        setBookData(res.data);
    };

    //  리뷰 리스트 불러오기
    const fetchSortedReviews = async (sort = 'like') => {
        const res = await getBookReviewList(isbn, sort);
        setSortedReviews(res.data.reviews);
        setReviewSort(sort);
        setAverageRating(res.data.averageRating);
        setRatingDistribution(res.data.ratingDistribution);
    };

    //  한 번에 다 로드
    const initLoad = async () => {
        try {
            await Promise.all([fetchBookData(), fetchSortedReviews()]);
            await new Promise((r) => setTimeout(r, 150)); // 부드러운 로딩 처리
            setIsReady(true);
        } catch (err) {
            console.error('❌ 데이터 로딩 실패:', err);
        }
    };

    useEffect(() => {
        initLoad();
    }, [isbn]);

    // 좋아요 토글
    const handleLike = async (reviewId) => {
        try {
            await toggleLikeReview(reviewId);
            await fetchSortedReviews(reviewSort);
        } catch (err) {
            console.error('❌ 좋아요 실패:', err);
        }
    };

    // 책장 담기
    const handleAddToBookshelf = () => {
        setShowToast(true);
    };

    // 아직 준비 안됐을 때 로딩 보여주기
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
          <Header title="책 상세 페이지" />
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
              <BookInfoHeaderBlock
                bookInfo={bookData?.bookInfo}
                onAddToBookshelf={handleAddToBookshelf}
              />

              <DividerBlock />

              <BookInfoContentBlock description={bookData?.bookInfo?.description} />

              <DividerBlock />

              <BookRatingSummaryBlock
                reviewRating={averageRating}
                ratingDistribution={ratingDistribution}
              />

              <DividerBlock />

              <BookReviewsBlock
                reviews={sortedReviews}
                onLikePress={handleLike}
                onSortChange={fetchSortedReviews}
                currentSort={reviewSort}
                isbn13={isbn}
                navigation={navigation}
              />

              <DividerBlock />
          </ScrollView>

          {showToast && (
            <ToastPopup
              message="내 책장에 담겼습니다!"
              onClose={() => setShowToast(false)}
            />
          )}
      </CommonLayout>
    );
};

export default BookDetailScreen;

const styles = StyleSheet.create({
    content: {
        alignItems: 'center',
        paddingVertical: fixwidth * 0.02,
    },
    divider: {
        width: '100%',
        height: fixwidth * 0.057,
        backgroundColor: '#f3f3f3',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
