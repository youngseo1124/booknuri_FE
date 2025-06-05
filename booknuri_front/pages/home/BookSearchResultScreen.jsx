import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
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
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import CurvedTabBar from '../../components/CurvedTabBar'; // ✅ 직접 렌더링

const { width: fixwidth, height } = Dimensions.get('window');

const sortOptions = [
  { key: 'like', label: '인기순' },
  { key: 'score', label: '정확도순' },
  { key: 'new', label: '최신순' },
  { key: 'review', label: '리뷰많은순' },
];

const BookSearchResultScreen = ({ route, navigation }) => {
  const { libCode, keyword, libName } = route.params;

  const [bookList, setBookList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sort, setSort] = useState('like');
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

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
    fetchBooks();
  }, [keyword, sort, page]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <CommonLayout>
      <HomeHeader title={libName || '도서 검색 결과'} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <SearchInput libCode={libCode} onFocusChange={() => {}} />
        <VerticalGap height={fixwidth * 0.027} />
        <DividerBlock height={fixwidth * 0.037} />

        {/* 총 N개 + 정렬 */}
        <View style={styles.resultHeader}>
          <Text style={styles.resultText}>총 {totalCount}개</Text>
          <TouchableOpacity
            onPress={() => setSortDropdownVisible(prev => !prev)}
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

        {/* 정렬 드롭다운 */}
        {sortDropdownVisible && (
          <View style={styles.dropdown}>
            {sortOptions.map(opt => (
              <TouchableOpacity
                key={opt.key}
                onPress={() => {
                  setSort(opt.key);
                  setSortDropdownVisible(false);
                  setPage(1);
                }}
              >
                <Text style={styles.dropdownItem}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 도서 리스트 */}
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

        <PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} />
        <VerticalGap height={fixwidth * 0.2} />
        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
      </ScrollView>


  {/*    // ✅ 포커스 없음 처리!
      <CurvedTabBar focusedTabName={null} navigation={navigation} />*/}


    </CommonLayout>
  );
};

export default BookSearchResultScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    minHeight: height,
  },
  resultHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    alignItems: 'center',
  },
  resultText: {
    fontSize: fixwidth * 0.04,
    fontFamily: 'NotoSansKR-Regular',
  },
  sortSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: fixwidth * 0.03,
    paddingVertical: fixwidth * 0.01,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: fixwidth * 0.015,
    backgroundColor: '#fff',
  },
  sortText: {
    fontSize: fixwidth * 0.035,
    fontFamily: 'NotoSansKR-Regular',
    color: '#333',
  },
  dropdown: {
    position: 'absolute',
    top: fixwidth * 0.47,
    right: fixwidth * 0.05,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: fixwidth * 0.01,
    zIndex: 999,
  },
  dropdownItem: {
    padding: fixwidth * 0.025,
    fontSize: fixwidth * 0.035,
    fontFamily: 'NotoSansKR-Regular',
  },
  divider: {
    marginVertical: fixwidth * 0.02,
    backgroundColor: 'rgba(0,0,0,0.09)',
    height: fixwidth * 0.001,
  },
});
