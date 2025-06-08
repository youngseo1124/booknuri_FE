import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import { LoginContext } from '../../contexts/LoginContextProvider';
import { BannerRefreshContext } from '../../contexts/BannerRefreshContext';

import HomeHeader from '../../components/public/publicHeader/HomeHeader';
import SearchInput from '../../components/home/SearchInput';
import BestsellerRecommendationBlock from '../../components/home/BestsellerRecommendationBlock';
import DemographicRecommendationBlock from '../../components/home/DemographicRecommendationBlock';
import TodayQuoteRecommendationBlock from '../../components/home/TodayQuoteRecommendationBlock';
import PrivateRecommendBannerCarousel from '../../components/home/PrivateRecommendBannerCarousel';
import ScrollToTopButton from '../../components/public/publicUtil/ScrollToTopButton';
import VerticalGap from '../../components/public/publicUtil/VerticalGap';
import SectionHeaderWithIcon from '../../components/public/publicHeader/SectionHeaderWithIcon';

import {
    getPersonalRecommendations,
    getBestsellerBooks,
    getDemographicRecommendations,
    getMainCategoryList,
} from '../../apis/apiFunction_recommend';

import {
    getPopularBookQuotes,
    toggleBookQuoteLike,
    deleteBookQuote,
} from '../../apis/apiFunction_bookQuote';

const { width: fixwidth } = Dimensions.get('window');

const HomeScreen = () => {
    const { userInfo } = useContext(LoginContext);
    const { refreshPrivateBanner: bannerTrigger } = useContext(BannerRefreshContext);
    const navigation = useNavigation();
    const scrollRef = useRef(null);

    const [searchFocused, setSearchFocused] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const [personalBooks, setPersonalBooks] = useState([]);
    const [bestsellerBooks, setBestsellerBooks] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [bestsellerPeriod, setBestsellerPeriod] = useState('weekly');
    const [bestsellerCategory, setBestsellerCategory] = useState(null);

    const [todayQuotes, setTodayQuotes] = useState([]);
    const [demographicBooks, setDemographicBooks] = useState([]);

    const [libName, setLibName] = useState('');
    const [libCode, setLibCode] = useState('');
    const [ageGroup, setAgeGroup] = useState('');
    const [gender, setGender] = useState('');

    // 🧠 유저 정보에서 연령/성별/도서관 추출
    useEffect(() => {
        if (userInfo) {
            const birthYear = Math.floor(userInfo.birth / 10000);
            const age = new Date().getFullYear() - birthYear;
            const decade = Math.floor(age / 10) * 10;
            setAgeGroup(`${decade}`);
            setGender(userInfo.gender);
            setLibName(userInfo.myLibrary?.libName || '');
            setLibCode(userInfo.myLibrary?.libCode || '');
        }
    }, [userInfo]);


    // 책 5권보면 배너 api 재호출
    useEffect(() => {
        if (!userInfo) return;

        const fetchUpdatedPersonal = async () => {
            try {
                const res = await getPersonalRecommendations();
                setPersonalBooks(res.data);
            } catch (e) {
                console.error('📛 배너 갱신 실패:', e);
            }
        };

        fetchUpdatedPersonal();
    }, [bannerTrigger]); // ✅ 이게 핵심!

    // ✅ 초기 데이터 한꺼번에 로딩
    useEffect(() => {
        if (!userInfo) return;

        const fetchInitial = async () => {
            try {
                const [
                    categoryRes,
                    personalRes,
                    bestsellerRes,
                    quoteRes,
                    demographicRes,
                ] = await Promise.all([
                    getMainCategoryList(),
                    getPersonalRecommendations(),
                    getBestsellerBooks({ period: bestsellerPeriod }),
                    getPopularBookQuotes(0, 10),
                    getDemographicRecommendations({
                        gender: userInfo.gender,
                        birthYearGroup: Math.floor((new Date().getFullYear() - Math.floor(userInfo.birth / 10000)) / 10) * 10,
                    }),
                ]);

                setCategoryList(categoryRes.data);
                setPersonalBooks(personalRes.data);
                setBestsellerBooks(bestsellerRes.data);
                setTodayQuotes(quoteRes.data.quotes);
                setDemographicBooks(demographicRes.data);

                setIsReady(true);
            } catch (err) {
                console.error('홈 추천 데이터 로딩 실패❌:', err);
            }
        };

        fetchInitial();
    }, [userInfo]);

    // ✅ 베스트셀러 필터 변경 시 재요청
    useEffect(() => {
        if (!userInfo) return;
        const fetchFilteredBestseller = async () => {
            try {
                const res = await getBestsellerBooks({
                    period: bestsellerPeriod,
                    mainCategoryId: bestsellerCategory ?? undefined,
                });
                setBestsellerBooks(res.data);
            } catch (e) {
                console.error('🔥 베스트셀러 갱신 실패:', e);
            }
        };

        fetchFilteredBestseller();
    }, [bestsellerPeriod, bestsellerCategory]);

    // ✅ 인용 좋아요/삭제/수정 핸들러
    const handleLikePress = async (quoteId) => {
        try {
            await toggleBookQuoteLike(quoteId);
            const updated = await getPopularBookQuotes(0, 10);
            setTodayQuotes(updated.data.quotes);
        } catch (e) {
            console.error('좋아요 실패❌', e);
        }
    };

    const handleDeletePress = async (quoteId) => {
        try {
            await deleteBookQuote(quoteId);
            const updated = await getPopularBookQuotes(0, 10);
            setTodayQuotes(updated.data.quotes);
        } catch (e) {
            console.error('삭제 실패❌', e);
        }
    };

    const handleEditPress = (quoteItem) => {
        navigation.navigate('BookQuoteEditScreen', {
            quoteId: quoteItem.id,
            isbn13: quoteItem.isbn13,
            returnScreenName: 'HomeScreen',
        });
    };

    const handleReportPress = (quoteId) => {
        console.log('🚨 신고 기능 미구현! quoteId:', quoteId);
    };

    return (
      <CommonLayout>
          <HomeHeader title={libName || '마이 홈'} />

          {isReady ? (
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
                <View style={{ width: '100%' }}>
                    <SearchInput libCode={libCode} onFocusChange={setSearchFocused} />
                </View>

                {!searchFocused && (
                  <>
                      <View style={{ width: '100%', paddingHorizontal: fixwidth * 0.03, alignItems: 'flex-start' }}>
                          <VerticalGap height={fixwidth * 0.0147} />
                          <SectionHeaderWithIcon label="맞춤 추천" />
                      </View>

                      <View style={{ height: fixwidth * 0.47, justifyContent: 'flex-start' }}>
                          <PrivateRecommendBannerCarousel
                            key={bannerTrigger ? 'A' : 'B'}
                            bookList={personalBooks}
                          />
                      </View>

                      <View style={styles.horizontalLine} />
                      <BestsellerRecommendationBlock
                        books={bestsellerBooks}
                        categoryList={categoryList}
                        selectedPeriod={bestsellerPeriod}
                        selectedCategory={bestsellerCategory}
                        onPeriodChange={setBestsellerPeriod}
                        onCategoryChange={setBestsellerCategory}
                      />

                      <View style={styles.horizontalLine} />
                      <TodayQuoteRecommendationBlock
                        quotes={todayQuotes}
                        onLikePress={handleLikePress}
                        onDeletePress={handleDeletePress}
                        onEditPress={handleEditPress}
                        onReportPress={handleReportPress}
                      />

                      <View style={styles.horizontalLine} />
                      <DemographicRecommendationBlock books={demographicBooks} />
                  </>
                )}
            </ScrollView>
          ) : (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#333" />
            </View>
          )}

          {!searchFocused && isReady && (
            <ScrollToTopButton onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })} />
          )}
      </CommonLayout>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingTop: fixwidth * 0.01,
        paddingBottom: fixwidth * 0.27,
        backgroundColor: '#ffffff',
    },
    horizontalLine: {
        width: '94%',
        height: fixwidth * 0.00097,
        backgroundColor: 'rgba(0,0,0,0.27)',
        marginVertical: fixwidth * 0.057,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});
