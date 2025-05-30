import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import CommonLayout from '../components/public/bookpublic/CommonLayout';
import Header from '../components/public/publicHeader/Header';
import {
    getBookTotalInfo,
    getBookReviewList,
    toggleLikeReview,
} from '../apis/apiFunction_book';
import DPBookInfoHeaderBlock from '../components/bookDetailpage/DPBookInfoHeaderBlock';
import DPBookInfoContentBlock from '../components/bookDetailpage/DPBookInfoContentBlock';
import DividerBlock from '../components/public/bookpublic/DividerBlock';
import DPBookRatingSummaryBlock from '../components/bookDetailpage/DPBookRatingSummaryBlock';
import ToastPopup from '../components/public/publicPopup_Alert_etc/ToastPopup';
import DPBookReviewsBlock from '../components/bookDetailpage/DPBookReviewsBlock.';
import DPBookReflectionsBlock from '../components/bookDetailpage/DPBookReflectionsBlock';
import {getBookReflectionList, toggleLikeReflection} from '../apis/apiFunction_bookReflection';


const { width: fixwidth } = Dimensions.get('window');

const BookDetailScreen = ({ route, navigation }) => {
    const { isbn } = route.params;
    console.log('📘 디테일페이지 진입');

    const [bookData, setBookData] = useState(null);         // 📕 책 정보
    const [sortedReviews, setSortedReviews] = useState([]); // ✍ 리뷰 목록
    const [reviewSort, setReviewSort] = useState('new');    // 📊 정렬 기준
    const [averageRating, setAverageRating] = useState(0);  // ⭐ 평균 별점
    const [ratingDistribution, setRatingDistribution] = useState({}); // 📈 별점 분포
    const [showToast, setShowToast] = useState(false);      // ✅ 토스트 표시 여부
    const [isReady, setIsReady] = useState(false);          // ⏳ 전체 준비 여부
    const [sortedReflections, setSortedReflections] = useState([]); // 📖 독후감 목록
    const [reflectionSort, setReflectionSort] = useState('like');   // 🔠 정렬 기준



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


    //독후감 불러오기 함수
    const fetchSortedReflections = async (sort = 'like') => {
        try {
            const res = await getBookReflectionList(isbn, sort);



            setSortedReflections(res.data.reflections);
            setReflectionSort(sort);
        } catch (err) {
            console.error('독후감 로딩 실패:', err);
        }
    };

    //독후감 좋아요 함수
    const handleReflectionLike = async (reflectionId) => {
        try {
            await toggleLikeReflection(reflectionId);
            await fetchSortedReflections(reflectionSort); // 다시 불러오기
        } catch (err) {
            console.error(' 독후감 좋아요 실패:', err);
        }
    };



    //  한 번에 다 로드
    const initLoad = async () => {
        try {
            await Promise.all([
                fetchBookData(),
                fetchSortedReviews(),
                fetchSortedReflections(), // ← 이거 안 들어가 있어서 지금 아무것도 안 불렀던 거임!!
            ]);
            await new Promise((r) => setTimeout(r, 150));
            setIsReady(true);
        } catch (err) {
            console.error(' 데이터 로딩 실패:', err);
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
              <DPBookInfoHeaderBlock
                bookInfo={bookData?.bookInfo}
                onAddToBookshelf={handleAddToBookshelf}
              />

              <DividerBlock />

              <DPBookInfoContentBlock description={bookData?.bookInfo?.description} />

              <DividerBlock />

              <DPBookRatingSummaryBlock
                reviewRating={averageRating}
                ratingDistribution={ratingDistribution}
              />

              <DividerBlock />

              <DPBookReviewsBlock
                reviews={sortedReviews}
                onLikePress={handleLike}
                onSortChange={fetchSortedReviews}
                currentSort={reviewSort}
                isbn13={isbn}
                navigation={navigation}
              />

              <DividerBlock />
              <DPBookReflectionsBlock
                reflections={sortedReflections}
                onLikePress={handleReflectionLike}
                onSortChange={fetchSortedReflections}
                currentSort={reflectionSort}
                isbn13={isbn}
                navigation={navigation}
              />

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
