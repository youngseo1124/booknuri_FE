import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import CommonLayout from '../components/public/publicUtil/CommonLayout';
import Header from '../components/public/publicHeader/Header';
import {
    getBookTotalInfo,
    getBookReviewList,
    toggleLikeReview,
} from '../apis/apiFunction_book';
import DPBookInfoHeaderBlock from '../components/bookDetailpage/DPBookInfoHeaderBlock';
import DPBookInfoContentBlock from '../components/bookDetailpage/DPBookInfoContentBlock';
import DividerBlock from '../components/public/publicUtil/DividerBlock';
import DPBookRatingSummaryBlock from '../components/bookDetailpage/DPBookRatingSummaryBlock';
import ToastPopup from '../components/public/publicPopup_Alert_etc/ToastPopup';
import DPBookReviewsBlock from '../components/bookDetailpage/review/DPBookReviewsBlock.';
import DPBookReflectionsBlock from '../components/bookDetailpage/DPBookReflectionsBlock';
import {
    getBookReflectionList,
    toggleLikeReflection,
} from '../apis/apiFunction_bookReflection';
import {deleteBookQuote, getBookQuoteListByIsbn, toggleBookQuoteLike} from '../apis/apiFunction_bookQuote';
import DPBookQuotesBlock from '../components/bookDetailpage/quote/DPBookQuotesBlock';

const { width: fixwidth } = Dimensions.get('window');

const BookDetailScreen = ({ route, navigation }) => {
    const { isbn } = route.params;

    const [bookData, setBookData] = useState(null);
    const [sortedReviews, setSortedReviews] = useState([]);
    const [reviewSort, setReviewSort] = useState('new');
    const [averageRating, setAverageRating] = useState(0);
    const [ratingDistribution, setRatingDistribution] = useState({});

    const [sortedReflections, setSortedReflections] = useState([]);
    const [reflectionSort, setReflectionSort] = useState('like');
    const [reflectionAverageRating, setReflectionAverageRating] = useState(0);

    const [showToast, setShowToast] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // 리뷰
    const [reviewTotalCount, setReviewTotalCount] = useState(0);

    // 독후감
    const [reflectionTotalCount, setReflectionTotalCount] = useState(0);


    const [sortedQuotes, setSortedQuotes] = useState([]);
    const [quoteSort, setQuoteSort] = useState('like');
    const [quoteTotalCount, setQuoteTotalCount] = useState(0);

    // 📘 책 정보 불러오기
    const fetchBookData = async () => {
        const res = await getBookTotalInfo(isbn);
        setBookData(res.data);
    };

    // ✍ 리뷰 불러오기
    const fetchSortedReviews = async (sort = 'like') => {
        const res = await getBookReviewList(isbn, sort);
        setSortedReviews(res.data.reviews);
        setReviewTotalCount(res.data.totalCount);
        setReviewSort(sort);
        setAverageRating(res.data.averageRating);
        setRatingDistribution(res.data.ratingDistribution);
    };

    // 📖 독후감 불러오기
    const fetchSortedReflections = async (sort = 'like') => {
        try {
            const res = await getBookReflectionList(isbn, sort);
            setSortedReflections(res.data.reflections);
            setReflectionTotalCount(res.data.totalCount);
            setReflectionSort(sort);
            setReflectionAverageRating(res.data.averageRating);
        } catch (err) {
            console.error('❌ 독후감 로딩 실패:', err);
        }
    };

    //인용 가져오기

    const fetchSortedQuotes = async (sort = 'like') => {
        try {
            const res = await  getBookQuoteListByIsbn(isbn, sort);
            console.log('📚 인용 응답:', res.data); // 👈 여기에 콘솔 찍어서 확인해봐
            setSortedQuotes(res.data.quotes);
            setQuoteTotalCount(res.data.totalCount);
            setQuoteSort(sort);
        } catch (err) {
            console.error('❌ 인용 로딩 실패:', err);
        }
    };

    // 💛 인용 좋아요
    const handleQuoteLike = async (quoteId) => {
        try {
            await toggleBookQuoteLike(quoteId); // API 호출
            await fetchSortedQuotes(quoteSort); // 다시 불러오기
        } catch (err) {
            console.error('❌ 인용 좋아요 실패:', err);
        }
    };

// ✏️ 인용 수정 (수정 화면으로 이동)
    const handleQuoteEdit = (quoteItem) => {
        navigation.navigate('BookQuoteEditScreen', {
            quoteId: quoteItem.id,
            isbn13: isbn,
            returnScreenName: 'BookDetailScreen',
        });
    };

// 🗑️ 인용 삭제
    const handleQuoteDelete = async (quoteId) => {
        // 여기서 팝업 띄워서 확인 후 삭제할 수도 있음!
        try {
            await deleteBookQuote(quoteId); // 삭제 API
            await fetchSortedQuotes(quoteSort); // 다시 로딩
        } catch (err) {
            console.error('❌ 인용 삭제 실패:', err);
        }
    };




    // 💛 독후감 좋아요
    const handleReflectionLike = async (reflectionId) => {
        try {
            await toggleLikeReflection(reflectionId);
            await fetchSortedReflections(reflectionSort);
        } catch (err) {
            console.error('❌ 독후감 좋아요 실패:', err);
        }
    };

    // 💛 리뷰 좋아요
    const handleLike = async (reviewId) => {
        try {
            await toggleLikeReview(reviewId);
            await fetchSortedReviews(reviewSort);
        } catch (err) {
            console.error('❌ 리뷰 좋아요 실패:', err);
        }
    };

    // ✅ 전체 초기 로딩
    const initLoad = async () => {
        try {
            await Promise.all([
                fetchBookData(),
                fetchSortedReviews(),
                fetchSortedReflections(),
                fetchSortedQuotes(),
            ]);
            await new Promise((r) => setTimeout(r, 150)); // 살짝 딜레이로 부드럽게
            setIsReady(true);
        } catch (err) {
            console.error('❌ 데이터 로딩 실패:', err);
        }
    };

    // 내 책장 담기
    const handleAddToBookshelf = () => {
        setShowToast(true);
    };

    useEffect(() => {
        initLoad();
    }, [isbn]);

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



              <DPBookQuotesBlock
                quotes={sortedQuotes}
                totalCount={quoteTotalCount}
                currentSort={quoteSort}
                onSortChange={fetchSortedQuotes}
                isbn13={isbn}
                navigation={navigation}
                onLikePress={handleQuoteLike}
                onEditPress={handleQuoteEdit}
                onDeletePress={handleQuoteDelete}
              />


              <DividerBlock />

              <DPBookRatingSummaryBlock
                reviewRating={averageRating}
                reflectionRating={reflectionAverageRating} // ✅ 추가됨!
                ratingDistribution={ratingDistribution}
              />

              <DividerBlock />

              <DPBookReviewsBlock
                reviews={sortedReviews}
                totalCount={reviewTotalCount}
                onLikePress={handleLike}
                onSortChange={fetchSortedReviews}
                currentSort={reviewSort}
                isbn13={isbn}
                navigation={navigation}
              />

              <DividerBlock />

              <DPBookReflectionsBlock
                reflections={sortedReflections}
                totalCount={reflectionTotalCount}
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
