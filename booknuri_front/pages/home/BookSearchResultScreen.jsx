import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { searchBooks } from '../../apis/apiFunction_search';
import HomeHeader from '../../components/public/publicHeader/HomeHeader';
import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import SearchInput from '../../components/home/SearchInput';
import BookSuggestionItem from '../../components/public/bookpublic/BookSuggestionItem';
import VerticalGap from '../../components/public/publicUtil/VerticalGap';
import PaginationBar from '../../components/public/publicUtil/PaginationBar';
import { Divider } from 'react-native-paper';
import DividerBlock from '../../components/public/publicUtil/DividerBlock';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown, faCircle, faDotCircle } from '@fortawesome/free-solid-svg-icons';

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
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [searchFocused, setSearchFocused] = useState(false); // ✅ 포커스 여부 상태 추가
  const limit = 15;

  const fetchBooks = async () => {
    const offset = (page - 1) * limit;
    try {
      const res = await searchBooks({ libCode, keyword, sort, offset, limit });
      setBookList(res.data.results || []);
      setTotalCount(res.data.totalCount || 0);
    } catch (err) {
      console.log('❌ 검색 실패:', err);
    }
  };

  useEffect(() => {
    if (!searchFocused) {
      fetchBooks();
    }
  }, [keyword, sort, page, searchFocused]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <CommonLayout>
      <HomeHeader title={libName || '도서 검색 결과'} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <SearchInput libCode={libCode} onFocusChange={setSearchFocused} />
        <VerticalGap height={fixwidth * 0.027} />


        {!searchFocused && (
          <>
            {/* 총 N개 + 정렬 */}
            <DividerBlock height={fixwidth * 0.033} />
            <View style={styles.resultHeader}>
              <Text style={styles.resultText}>총 {totalCount}권</Text>
              <TouchableOpacity
                onPress={() => setIsSortModalVisible(true)}
                style={styles.sortSelect}
              >
                <Text style={styles.sortText}>
                  {sortOptions.find(opt => opt.key === sort)?.label}
                </Text>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  size={fixwidth * 0.035}
                  color="#333"
                  style={{ marginLeft: fixwidth * 0.01 }}
                />
              </TouchableOpacity>
            </View>

            <VerticalGap height={fixwidth * 0.022} />

            {/* 도서 리스트 View로 래핑 */}
            <View style={styles.bookListBox}>
              {bookList.map((book, index) => (
                <View key={book.id} style={{ width: '100%' }}>
                  <BookSuggestionItem
                    book={book}
                    thumbnailWidth={fixwidth * 0.22}
                    thumbnailHeight={fixwidth * 0.3}
                  />
                  {index !== bookList.length - 1 && (
                    <Divider style={styles.divider} />
                  )}
                </View>
              ))}
            </View>

            <VerticalGap height={fixwidth * 0.027} />

            <PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} />
            <VerticalGap height={fixwidth * 0.2} />
          </>
        )}
      </ScrollView>

      {/* 정렬 조건 선택 모달 */}
      <Modal
        visible={isSortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSortModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBackdrop}
          onPressOut={() => setIsSortModalVisible(false)}
        >
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
  resultHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    alignItems: 'center',
    borderBottomWidth: fixwidth * 0.0024,
    borderBottomColor: 'rgba(0,0,0,0.13)',
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
    borderRadius: fixwidth * 0.02,
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
});
