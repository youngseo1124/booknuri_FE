import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import Header from '../../components/public/publicHeader/Header';
import BookQuoteItem from '../../components/bookDetailpage/quote/BookQuoteItem';
import TitleOnlyPopup from '../../components/public/publicPopup_Alert_etc/TitleOnlyPopup';
import FixedBottomButton from '../../components/public/publicButton/FixedBottomButton';
import VerticalGap from '../../components/public/publicUtil/VerticalGap';

import { getMyGroupedQuotes } from '../../apis/apiFunction_myShelf';
import { deleteBookQuote, toggleBookQuoteLike } from '../../apis/apiFunction_bookQuote';

import { useFocusEffect } from '@react-navigation/native';

const { width: fixwidth } = Dimensions.get('window');
const LIMIT = 10;

const MyQuotesScreen = ({ navigation }) => {
  const [quotes, setQuotes] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);

  const fetchQuotes = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);
    try {
      const res = await getMyGroupedQuotes(reset ? 0 : offset, LIMIT);
      const newQuotes = res.content || [];

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
      console.error('❌ 내 인용 목록 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchQuotes(true);
    }, [])
  );

  const handleLikePress = async (id) => {
    try {
      await toggleBookQuoteLike(id);
      fetchQuotes(true);
    } catch (err) {
      console.error('❌ 좋아요 실패:', err);
    }
  };

  const handleEditPress = (quote) => {
    navigation.navigate('BookQuoteEditScreen', {
      quoteId: quote.id,
      isbn13: quote.isbn13,
    });
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
    navigation.navigate('BookQuoteCreateScreen');
  };

  if (!isReady) {
    return (
      <CommonLayout>
        <Header title="내 인용" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#aaa" />
        </View>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout>
      <Header title="내 인용" />

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
          contentContainerStyle={styles.scrollContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={
            loading && (
              <View style={styles.loadingWrapper}>
                <ActivityIndicator size="small" color="#aaa" />
              </View>
            )
          }
        />
      </View>

      <FixedBottomButton label="인용 쓰기" onPress={handleWritePress} />

      <TitleOnlyPopup
        visible={deletePopupVisible}
        title="이 인용을 삭제할까요?"
        onCancel={() => setDeletePopupVisible(false)}
        onConfirm={handleDeleteConfirm}
      />
    </CommonLayout>
  );
};

export default MyQuotesScreen;

const styles = StyleSheet.create({
  listWrapper: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: fixwidth * 0.14,
    paddingHorizontal: fixwidth * 0.03,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    width: '100%',
    marginVertical: fixwidth * 0.025,
  },
  loadingWrapper: {
    marginTop: fixwidth * 0.05,
    alignItems: 'center',
  },
});
