// BookSearchResultScreen.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Modal, ActivityIndicator, Image,
} from 'react-native';
import { searchBooks } from '../../apis/apiFunction_search';
import HomeHeader from '../../components/public/publicHeader/HomeHeader';
import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import SearchInput from '../../components/home/SearchInput';
import BookSuggestionItem from '../../components/public/bookpublic/BookSuggestionItem';
import VerticalGap from '../../components/public/publicUtil/VerticalGap';
import PaginationBar from '../../components/public/publicUtil/PaginationBar';
import DividerBlock from '../../components/public/publicUtil/DividerBlock';
import ScrollToTopButton from '../../components/public/publicUtil/ScrollToTopButton';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown, faCircle, faDotCircle } from '@fortawesome/free-solid-svg-icons';
import SearchTypeBottomSheet from '../../components/home/SearchTypeBottomSheet';

const { width: fixwidth, height } = Dimensions.get('window');

const sortOptions = [
  { key: 'like', label: '인기순' },
  { key: 'score', label: '정확도순' },
  { key: 'new', label: '최신순' },
  { key: 'old', label: '출판일순' },
  { key: 'review', label: '리뷰 많은순' },
];

const BookSearchResultScreen = ({ route, navigation }) => {
  const { libCode, keyword, libName } = route.params;

  const [bookList, setBookList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sort, setSort] = useState('like');
  const [searchType, setSearchType] = useState('bookname'); // ✅ 책 제목 or 저자
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isSearchTypeModalVisible, setIsSearchTypeModalVisible] = useState(false); // ✅
  const [page, setPage] = useState(1);
  const [searchFocused, setSearchFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const limit = 15;

  const scrollRef = useRef(null);

  const fetchBooks = async () => {
    const offset = (page - 1) * limit;
    setLoading(true);

    try {
      const res = await searchBooks({
        libCode,
        keyword,
        keywordType: searchType, // ✅ 적용
        sort,
        offset,
        limit,
      });
      setBookList(res.data.results || []);
      setTotalCount(res.data.totalCount || 0);
    } catch (err) {
      console.log('❌ 검색 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [keyword, sort, searchType]);

  useEffect(() => {
    if (!searchFocused) fetchBooks();
  }, [keyword, sort, page, searchType, searchFocused]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <CommonLayout>
      <HomeHeader title={libName || '도서 검색 결과'} />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#7ea4fa" />
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <SearchInput
            libCode={libCode}
            onFocusChange={(focus) => setSearchFocused(focus)}
            initialKeyword={keyword}
          />
          <VerticalGap height={fixwidth * 0.027} />

          {!searchFocused && (
            <>
              <DividerBlock height={fixwidth * 0.033} />
              <View style={styles.resultHeader}>
                <Text style={styles.resultText}>총 {totalCount}권</Text>

                {/* 👉 오른쪽 버튼 그룹 묶기 */}
                <View style={styles.rightButtonGroup}>
                  {/* 정렬 기준 버튼 */}
                  <TouchableOpacity onPress={() => setIsSortModalVisible(true)} style={styles.sortSelect}>
                    <Text style={styles.sortText}>
                      {sortOptions.find(opt => opt.key === sort)?.label}
                    </Text>
                    <FontAwesomeIcon icon={faChevronDown} size={fixwidth * 0.035} color="#333" style={{ marginLeft: fixwidth * 0.01 }} />
                  </TouchableOpacity>

                  {/* 검색 기준 필터 버튼 */}
                  <TouchableOpacity onPress={() => setIsSearchTypeModalVisible(true)} style={styles.settingButton}>
                    <Image
                      source={require('../../image/utill/setting_icon.png')}
                      style={{ width: fixwidth * 0.05, height: fixwidth * 0.05 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <VerticalGap height={fixwidth * 0.022} />
              <View style={styles.bookListBox}>
                {bookList.map((book, index) => (
                  <View key={book.id} style={{ width: '100%' }}>
                    <BookSuggestionItem
                      book={book}
                      thumbnailWidth={fixwidth * 0.22}
                      thumbnailHeight={fixwidth * 0.3}
                    />
                    {index !== bookList.length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </View>

              <VerticalGap height={fixwidth * 0.027} />
              <PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} />
              <VerticalGap height={fixwidth * 0.2} />
            </>
          )}
        </ScrollView>
      )}

      {!searchFocused && !loading && (
        <ScrollToTopButton onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })} />
      )}

      {/* 정렬 모달 */}
      <Modal
        visible={isSortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSortModalVisible(false)}
      >
        <TouchableOpacity activeOpacity={1} style={styles.modalBackdrop} onPressOut={() => setIsSortModalVisible(false)}>
          <View style={styles.modalContent}>
            {sortOptions.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={styles.sortItem}
                onPress={() => {
                  setSort(opt.key);
                  setIsSortModalVisible(false);
                  setPage(1);
                }}
              >
                <Text style={styles.sortItemText}>{opt.label}</Text>
                <FontAwesomeIcon
                  icon={opt.key === sort ? faDotCircle : faCircle}
                  color={opt.key === sort ? '#7ea4fa' : '#ccc'}
                  size={fixwidth * 0.045}
                />
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 검색 기준 바텀시트 */}
      {isSearchTypeModalVisible && (
        <View style={styles.backdrop} />
      )}
      <SearchTypeBottomSheet
        visible={isSearchTypeModalVisible}
        onClose={() => setIsSearchTypeModalVisible(false)}
        selectedType={searchType}
        setSelectedType={setSearchType}
      />
    </CommonLayout>
  );
};

export default BookSearchResultScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    minHeight: height,
    paddingBottom: fixwidth * 0.077,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height,
  },
  resultText: {
    fontSize: fixwidth * 0.037,
    fontFamily: 'NotoSansKR-Medium',
  },
  sortSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: fixwidth * 0.03,
    borderWidth: fixwidth * 0.0027,
    borderColor: 'rgba(0,0,0,0.17)',
    borderRadius: fixwidth * 0.011,
    backgroundColor: '#fff',
    marginLeft: fixwidth * 0.027,
  },
  sortText: {
    fontSize: fixwidth * 0.03,
    fontFamily: 'NotoSansKR-Regular',
    color: '#333',
    lineHeight: fixwidth * 0.071,
  },
  bookListBox: {
    width: '100%',
    paddingHorizontal: fixwidth * 0.03,
  },
  divider: {
    marginVertical: fixwidth * 0.02,
    backgroundColor: 'rgba(0,0,0,0.12)',
    height: fixwidth * 0.0011,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: fixwidth * 0.01,
    paddingVertical: fixwidth * 0.02,
  },
  sortItem: {
    paddingHorizontal: fixwidth * 0.04,
    paddingVertical: fixwidth * 0.035,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortItemText: {
    fontSize: fixwidth * 0.035,
    fontFamily: 'NotoSansKR-Regular',
    color: '#333',
  },
  resultHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between', // ✅ 좌우 정렬
    alignItems: 'center',
    paddingHorizontal: '5%',
    borderBottomWidth: fixwidth * 0.0024,
    borderBottomColor: 'rgba(0,0,0,0.13)',
  },

  rightButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  settingButton: {
    marginLeft: fixwidth * 0.027,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1,
  },

});
