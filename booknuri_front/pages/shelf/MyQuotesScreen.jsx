import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Text,
} from 'react-native';

import {useRoute, useNavigation, useFocusEffect} from '@react-navigation/native';

import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import Header from '../../components/public/publicHeader/Header';
import BookQuoteItem from '../../components/bookDetailpage/quote/BookQuoteItem';
import TitleOnlyPopup from '../../components/public/publicPopup_Alert_etc/TitleOnlyPopup';
import FixedBottomButton from '../../components/public/publicButton/FixedBottomButton';
import VerticalGap from '../../components/public/publicUtil/VerticalGap';

import { deleteBookQuote, toggleBookQuoteLike } from '../../apis/apiFunction_bookQuote';
import { getMyQuotesByBookIsbn } from '../../apis/apiFunction_myShelf';

const { width: fixwidth,height } = Dimensions.get('window');

const MyQuotesScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { isbn13 } = route.params;

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);

  const fetchQuotes = async () => {
    try {
      const data = await getMyQuotesByBookIsbn(isbn13);
      setQuotes(data);
    } catch (err) {
      console.error('❌ 인용 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchQuotes();
    }, [isbn13])
  );

  const handleLikePress = async (id) => {
    try {
      await toggleBookQuoteLike(id);
      fetchQuotes(); // 갱신
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
      const updated = quotes.filter((q) => q.id !== selectedQuoteId);
      setQuotes(updated);
      setDeletePopupVisible(false);
    } catch (err) {
      console.error('❌ 인용 삭제 실패:', err);
    }
  };

  const handleWritePress = () => {
    navigation.navigate('BookQuoteCreateScreen', { isbn13 });
  };

  if (loading) {
    return (
      <CommonLayout>
        <Header title="내 인용" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#aaa" />
        </View>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout>
      <Header title="내 인용" />
      <VerticalGap height={fixwidth * 0.007} />
      <FlatList
        data={quotes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BookQuoteItem
            item={item}
            onLikePress={() => handleLikePress(item.id)}
            onEditPress={handleEditPress}
            onDeletePress={handleDeletePress}
          />
        )}
        contentContainerStyle={styles.scrollContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              아직 이 책에 대한 인용이 없어요.{'\n'}첫 인용을 작성해주세요.
            </Text>
          </View>
        }
      />

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
  scrollContent: {
    paddingBottom: fixwidth * 0.197,
    paddingHorizontal: fixwidth * 0.03,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    width: '100%',
    marginVertical: fixwidth * 0.025,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height * 0.7,
  },
  emptyText: {
    fontSize: fixwidth * 0.037,
    fontFamily: 'NotoSansKR-Regular',
    color: '#555',
    textAlign: 'center',
    lineHeight: fixwidth * 0.06,
  },
});
