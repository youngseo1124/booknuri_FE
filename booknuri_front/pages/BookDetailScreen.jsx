import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Text } from 'react-native';
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
import DPBookReviewsBlock from '../components/bookDetailpage/DPBookReviewsBlock.';
import DPBookReflectionsBlock from '../components/bookDetailpage/DPBookReflectionsBlock';
import DPBookQuotesBlock from '../components/bookDetailpage/DPBookQuotesBlock';
import ScrollToTopButton from '../components/public/publicUtil/ScrollToTopButton';
import ToastPopup from '../components/public/publicPopup_Alert_etc/ToastPopup';
import { useFocusEffect } from '@react-navigation/native';

const { width: fixwidth } = Dimensions.get('window');

const BookDetailScreen = ({ route, navigation }) => {
    const { isbn } = route.params;
    const scrollRef = useRef(null);

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

    // ✅ 로그용
    useEffect(() => {
        console.log('[📗 bookData 변경됨]', bookData);
        if (bookData?.bookInfo) {
            console.log('✅ bookInfo 있음!', bookData.bookInfo.title);
        } else {
            console.log('❌ bookInfo 없음!');
        }
    }, [bookData]);

    useFocusEffect(
      useCallback(() => {
          initLoad();
      }, [isbn])
    );

    const fetchBookData = async () => {
        const res = await getBookTotalInfo(isbn);
        setBookData(res.data);
    };

    const fetchSortedReviews = async (sort = 'like') => {
        const res = await getBookReviewList(isbn, sort);
        setSortedReviews(res.data.reviews);
        setReviewTotalCount(res.data.totalCount);
        setReviewSort(sort);
        setAverageRating(res.data.averageRating);
        setRatingDistribution(res.data.ratingDistribution);
    };

    const fetchSortedReflections = async (sort = 'like') => {
        const res = await getBookReflectionList(isbn, sort);
        setSortedReflections(res.data.reflections);
        setReflectionTotalCount(res.data.totalCount);
        setReflectionSort(sort);
        setReflectionAverageRating(res.data.averageRating);
    };

    const fetchSortedQuotes = async (sort = 'like') => {
        const res = await getBookQuoteListByIsbn(isbn, sort);
        setSortedQuotes(res.data.quotes);
        setQuoteTotalCount(res.data.totalCount);
        setQuoteSort(sort);
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
            scrollRef.current?.scrollTo({ y: 0, animated: false }); // ✅ 강제 초기 스크롤 위치 고정
            setIsReady(true);
        } catch (err) {
            console.error('❌ 데이터 로딩 실패:', err);
        }
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
            ref={scrollRef}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
              {bookData?.bookInfo ? (
                <>

                    <DPBookInfoHeaderBlock
                      key={bookData.bookInfo.isbn13}
                      bookInfo={bookData.bookInfo}
                      onAddToBookshelf={handleAddToBookshelf}
                    />
                </>
              ) : (
                <Text style={{ color: 'red' }}>📛 책 정보 없음</Text>
              )}

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

          <ScrollToTopButton bottom={fixwidth * 0.17} right={fixwidth * 0.05} onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })} />

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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
