import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import CommonLayout from '../components/public/CommonLayout';
import Header from '../components/public/Header';
import { getBookTotalInfo, getBookReviewList, toggleLikeReview } from '../apis/apiFunction_book';
import BookInfoHeaderBlock from '../components/bookDetailpage/BookInfoHeaderBlock';
import BookInfoContentBlock from '../components/bookDetailpage/BookInfoContentBlock';
import DividerBlock from '../components/public/DividerBlock';
import BookRatingSummaryBlock from '../components/bookDetailpage/BookRatingSummaryBlock';

import ToastPopup from '../components/public/ToastPopup';
import BookReviewsBlock from '../components/bookDetailpage/BookReviewsBlock.';

const { width: fixwidth } = Dimensions.get('window');

const BookDetailScreen = ({ route }) => {
    const { isbn } = route.params;

    const [bookData, setBookData] = useState(null);         // 책 정보
    const [sortedReviews, setSortedReviews] = useState([]); // 정렬된 리뷰 목록
    const [reviewSort, setReviewSort] = useState('new');    // 현재 정렬 기준
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [ratingDistribution, setRatingDistribution] = useState({});
    // 책 정보 불러오기
    const fetchBookData = async () => {
        try {
            const res = await getBookTotalInfo(isbn);
            setBookData(res.data);
        } catch (error) {
            console.error('X 책 상세 정보 가져오기 실패:', error);
        }
    };

    // 리뷰 리스트 불러오기
    const fetchSortedReviews = async (sort = 'new') => {
        try {
            const res = await getBookReviewList(isbn, sort);
            setSortedReviews(res.data.reviews);
            setReviewSort(sort);

            //  새로 추가된 리뷰 통계 값들 설정
            setAverageRating(res.data.averageRating);
            setRatingDistribution(res.data.ratingDistribution);
        } catch (err) {
            console.error('X 리뷰 목록 가져오기 실패:', err);
        }
    };

    // 초기 로딩
    useEffect(() => {
        fetchBookData();
        fetchSortedReviews(); // 기본 정렬: 최신순
    }, [isbn]);

    // 리뷰 좋아요 핸들러
    const handleLike = async (reviewId) => {
        try {
            await toggleLikeReview(reviewId);
            await fetchSortedReviews(reviewSort); // 좋아요 후 같은 정렬로 다시 fetch
        } catch (err) {
            console.error('좋아요 실패:', err);
        }
    };

    //  책장 담기 핸들러
    const handleAddToBookshelf = () => {
        setShowToast(true); // 토스트 띄우기
    };

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
});
