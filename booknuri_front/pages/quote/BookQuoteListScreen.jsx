import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import Header from '../../components/public/publicHeader/Header';
import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import SortTabs from '../../components/public/etc/SortTabs';
import BookQuoteItem from '../../components/bookDetailpage/quote/BookQuoteItem';
import {
  getBookQuoteListByIsbn,
  toggleBookQuoteLike,
  deleteBookQuote,
} from '../../apis/apiFunction_bookQuote';

import WriteButton from '../../components/public/publicButton/WriteButton';
import TitleOnlyPopup from '../../components/public/publicPopup_Alert_etc/TitleOnlyPopup';
import VerticalGap from '../../components/public/publicUtil/VerticalGap';
import {useFocusEffect} from '@react-navigation/native';

const { width: fixwidth } = Dimensions.get('window');

const BookQuoteListScreen = ({ route, navigation }) => {
  const { isbn13 } = route.params;

  const [quotes, setQuotes] = useState([]);
  const [sort, setSort] = useState('like');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [totalCount, setTotalCount] = useState(0);


  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);

  const LIMIT = 10;

  const fetchQuotes = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);
    try {
      const res = await getBookQuoteListByIsbn(isbn13, sort, reset ? 0 : offset, LIMIT);
      const newQuotes = res.data.quotes;
      if (reset) setTotalCount(res.data.totalCount);

      if (reset) {
        setQuotes(newQuotes);
        setOffset(LIMIT);
      } else {
        setQuotes((prev) => [...prev, ...newQuotes]);
        setOffset((prev) => prev + LIMIT);
      }

      setHasMore(newQuotes.length === LIMIT);
      if (reset) setIsReady(true);
    } catch (err) {
      console.error('❌ 인용 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  // 인용 리스트 새로고침
  useFocusEffect(
    useCallback(() => {
      fetchQuotes(true);
    }, [sort])
  );




  useEffect(() => {
    fetchQuotes(true);
  }, [sort]);

  const handleLikePress = async (id) => {
    try {
      await toggleBookQuoteLike(id);
      fetchQuotes(true);
    } catch (err) {
      console.error('좋아요 실패:', err);
    }
  };

  const handleEditPress = (quote) => {
    navigation.navigate('BookQuoteEditScreen', { quoteId: quote.id, isbn13 });
  };

  const handleDeletePress = (id) => {
    setSelectedQuoteId(id);
    setDeletePopupVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteBookQuote(selectedQuoteId);
      setDeletePopupVisible(false);
      fetchQuotes(true);
    } catch (err) {
      console.error('❌ 인용 삭제 실패:', err);
    }
  };

  const handleWritePress = () => {
    navigation.navigate('BookQuoteCreateScreen', { isbn13 });
  };

  if (!isReady) {
    return (
      <CommonLayout>
        <Header title="인용" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#aaa" />
        </View>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout>

      <Header title={`인용 (${totalCount})`} />

      <VerticalGap height={fixwidth * 0.022} />


      <View style={styles.listWrapper}>
        <FlatList
          data={quotes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BookQuoteItem
              item={item}
              onLikePress={handleLikePress}
              onEditPress={handleEditPress}
              onDeletePress={handleDeletePress}
            />
          )}
          onEndReached={() => fetchQuotes(false)}
          onEndReachedThreshold={0.7}
          ListHeaderComponent={
            <View style={styles.headerGroup}>
              <WriteButton label="인용 쓰기" onPress={handleWritePress} />
              <VerticalGap/>
              <View style={styles.sortTabWrapper}>
                <SortTabs currentSort={sort} onChange={setSort} visibleOptions={['like', 'new']} />
              </View>
            </View>
          }
          ListFooterComponent={
            loading && (
              <View style={styles.loadingWrapper}>
                <ActivityIndicator size="small" color="#aaa" />
              </View>
            )
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />} // ✅ 구분선 추가
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <TitleOnlyPopup
        visible={deletePopupVisible}
        title="이 인용을 삭제할까요?"
        onCancel={() => setDeletePopupVisible(false)}
        onConfirm={handleDeleteConfirm}
      />
    </CommonLayout>
  );
};

export default BookQuoteListScreen;

const styles = StyleSheet.create({
  topSection: {
    width: '94%',
    alignSelf: 'center',
    marginTop: fixwidth * 0.03,
    marginBottom: fixwidth * 0.015,
  },
  listWrapper: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: fixwidth * 0.1,
    paddingHorizontal: fixwidth * 0.03,
  },
  sortTabWrapper: {
    marginBottom: fixwidth * 0.0,
  },
  loadingWrapper: {
    marginTop: fixwidth * 0.05,
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    width: '100%',
    marginVertical: fixwidth * 0.025,
  },
});
