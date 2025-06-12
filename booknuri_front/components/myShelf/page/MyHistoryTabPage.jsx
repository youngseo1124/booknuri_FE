import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import FlatSegmentSelector from '../../public/selector/FlatSegmentSelector';
import MyShelfSettingBar from '../MyShelfSettingBar';
import VerticalGap from '../../public/publicUtil/VerticalGap';
import { getMyGroupedWrittenBooks } from '../../../apis/apiFunction_myShelf';
import HistoryBookCard from '../HistoryBookCard';
import { useFocusEffect } from '@react-navigation/native';

const { width: fixwidth } = Dimensions.get('window');

const tabLabelMap = {
  quote: '인용',
  reflection: '독후감',
  review: '리뷰',
};

const TAB_OPTIONS = [
  { id: 'quote', label: '인용' },
  { id: 'reflection', label: '독후감' },
  { id: 'review', label: '리뷰' },
];

const MyHistoryTabPage = ({ scrollRef }) => {
  const { width: windowWidth } = useWindowDimensions();

  const [selectedTab, setSelectedTab] = useState('quote');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  const [quoteData, setQuoteData] = useState({ list: [], totalCount: 0 });
  const [reflectionData, setReflectionData] = useState({ list: [], totalCount: 0 });
  const [reviewData, setReviewData] = useState({ list: [], totalCount: 0 });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [q, r, v] = await Promise.all([
        getMyGroupedWrittenBooks('quote', '', 0, 100),
        getMyGroupedWrittenBooks('reflection', '', 0, 100),
        getMyGroupedWrittenBooks('review', '', 0, 100),
      ]);
      setQuoteData({ list: q.content || [], totalCount: q.totalCount || 0 });
      setReflectionData({ list: r.content || [], totalCount: r.totalCount || 0 });
      setReviewData({ list: v.content || [], totalCount: v.totalCount || 0 });
    } catch (error) {
      console.warn('작성글 데이터 로드 실패:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, []);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await fetchAll();
      })();
    }, [])
  );


  const currentData =
    selectedTab === 'quote'
      ? quoteData
      : selectedTab === 'reflection'
        ? reflectionData
        : reviewData;

  const filteredList = useMemo(() => {
    if (!keyword.trim()) return currentData.list;

    return currentData.list.filter(
      (book) =>
        book.bookTitle?.toLowerCase().includes(keyword.toLowerCase()) ||
        book.bookAuthor?.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [keyword, currentData, selectedTab]);

  const renderItem = ({ item }) => (
    <HistoryBookCard book={item} selectedType={selectedTab} />
  );

  return (
    <View key={windowWidth} style={styles.container}>
      <FlatList
        ref={scrollRef}
        data={filteredList}
        keyExtractor={(item) => item.isbn13}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.topSection}>
            <VerticalGap />
            <MyShelfSettingBar
              countLabel={` 총 ${tabLabelMap[selectedTab]} ${currentData.totalCount}개`}
              onSearch={(kw) => setKeyword(kw)}
              onSearchCancel={() => setKeyword('')}
              onFilterReset={() => setKeyword('')}
              showSetting={false}
            />
            <VerticalGap height={fixwidth * 0.02} />
            <View style={styles.selectorWrapper}>
              <FlatSegmentSelector
                options={TAB_OPTIONS}
                selectedId={selectedTab}
                onSelect={setSelectedTab}
              />
            </View>
            <VerticalGap height={fixwidth * 0.0277} />
          </View>
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyWrapper}>
              <Text style={styles.emptyText}>작성한 기록이 없습니다</Text>
            </View>
          )
        }
        contentContainerStyle={styles.list}
      />

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#888" />
        </View>
      )}
    </View>
  );
};
const { height} = Dimensions.get('window');
export default MyHistoryTabPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topSection: {},
  list: {
    paddingBottom: fixwidth * 0.2,
  },
  selectorWrapper: {
    paddingHorizontal: fixwidth * 0.0437,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: fixwidth * 0.3,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    zIndex: 10,
  },

  // 기존 스타일에 추가 또는 수정
  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height*0.5,
  },
  emptyText: {
    fontSize: fixwidth * 0.034,
    fontFamily: 'NotoSansKR-Regular',
    color: '#555',
    textAlign: 'center',
  },
});
