import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import CommonLayout from '../components/public/publicUtil/CommonLayout';
import Header from '../components/public/publicHeader/Header';
import {
    getBookTotalInfo,
    getBookReviewList,
    toggleLikeReview,
} from '../apis/apiFunction_book';
import {
    getBookReflectionList,
    toggleLikeReflection,
} from '../apis/apiFunction_bookReflection';
import {
    deleteBookQuote,
    getBookQuoteListByIsbn,
    toggleBookQuoteLike,
} from '../apis/apiFunction_bookQuote';
import DPBookInfoHeaderBlock from '../components/bookDetailpage/DPBookInfoHeaderBlock';
import DPBookInfoContentBlock from '../components/bookDetailpage/DPBookInfoContentBlock';
import DividerBlock from '../components/public/publicUtil/DividerBlock';
import DPBookRatingSummaryBlock from '../components/bookDetailpage/DPBookRatingSummaryBlock';
import DPBookReviewsBlock from '../components/bookDetailpage/review/DPBookReviewsBlock.';
import DPBookReflectionsBlock from '../components/bookDetailpage/DPBookReflectionsBlock';
import DPBookQuotesBlock from '../components/bookDetailpage/quote/DPBookQuotesBlock';
import ScrollToTopButton from '../components/public/publicUtil/ScrollToTopButton'; // ✅ 추가
import ToastPopup from '../components/public/publicPopup_Alert_etc/ToastPopup';

const { width: fixwidth } = Dimensions.get('window');

const BookDetailScreen = ({ route, navigation }) => {
    const { isbn } = route.params;

    const scrollRef = useRef(null); // ✅ 스크롤 참조

    const [bookData, setBookData] = useState(null);
    const [sortedReviews, setSortedReviews] = useState([]);
    const [reviewSort, setReviewSort] = useState('new');
    const [averageRating, setAverageRating] = useState(0);
    const [ratingDistribution, setRatingDistribution] = useState({});

    const [sortedReflections, setSortedReflections] = useState([]);
    const [reflectionSort, setReflectionSort] = useState('like');
    const [reflectionAverageRating, setReflectionAverageRating] = useState(0);

    const [sortedQuotes, setSortedQuotes] = useState([]);
    const [quoteSort, setQuoteSort] = useState('like');

    const [reviewTotalCount, setReviewTotalCount] = useState(0);
    const [reflectionTotalCount, setReflectionTotalCount] = useState(0);
    const [quoteTotalCount, setQuoteTotalCount] = useState(0);

    const [showToast, setShowToast] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // 📘 책 정보
    const fetchBookData = async () => {
        const res = await getBookTotalInfo(isbn);
        setBookData(res.data);
    };

    // ✍ 리뷰
    const fetchSortedReviews = async (sort = 'like') => {
        const res = await getBookReviewList(isbn, sort);
        setSortedReviews(res.data.reviews);
        setReviewTotalCount(res.data.totalCount);
        setReviewSort(sort);
        setAverageRating(res.data.averageRating);
        setRatingDistribution(res.data.ratingDistribution);
    };

    // 📖 독후감
    const fetchSortedReflections = async (sort = 'like') => {
        const res = await getBookReflectionList(isbn, sort);
        setSortedReflections(res.data.reflections);
        setReflectionTotalCount(res.data.totalCount);
        setReflectionSort(sort);
        setReflectionAverageRating(res.data.averageRating);
    };

    // ✨ 인용
    const fetchSortedQuotes = async (sort = 'like') => {
        const res = await getBookQuoteListByIsbn(isbn, sort);
        setSortedQuotes(res.data.quotes);
        setQuoteTotalCount(res.data.totalCount);
        setQuoteSort(sort);
    };

    const handleLike = async (reviewId) => {
        await toggleLikeReview(reviewId);
        await fetchSortedReviews(reviewSort);
    };

    const handleReflectionLike = async (reflectionId) => {
        await toggleLikeReflection(reflectionId);
        await fetchSortedReflections(reflectionSort);
    };

    const handleQuoteLike = async (quoteId) => {
        await toggleBookQuoteLike(quoteId);
        await fetchSortedQuotes(quoteSort);
    };

    const handleQuoteEdit = (quoteItem) => {
        navigation.navigate('BookQuoteEditScreen', {
            quoteId: quoteItem.id,
            isbn13: isbn,
            returnScreenName: 'BookDetailScreen',
        });
    };

    const handleQuoteDelete = async (quoteId) => {
        await deleteBookQuote(quoteId);
        await fetchSortedQuotes(quoteSort);
    };

    const handleAddToBookshelf = () => {
        setShowToast(true);
    };

    const initLoad = async () => {
        try {
            await Promise.all([
                fetchBookData(),
                fetchSortedReviews(),
                fetchSortedReflections(),
                fetchSortedQuotes(),
            ]);
            await new Promise((r) => setTimeout(r, 150));
            setIsReady(true);
        } catch (err) {
            console.error('❌ 데이터 로딩 실패:', err);
        }
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
            ref={scrollRef} // ✅ 연결
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
                reflectionRating={reflectionAverageRating}
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
          {/* ✅ 맨 위로 버튼 */}
          <ScrollToTopButton bottom={fixwidth * 0.17} right={fixwidth * 0.05}  onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })} />

          {/* ✅ 토스트 */}
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
