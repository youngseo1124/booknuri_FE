import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
  InteractionManager,
  ActivityIndicator,
} from 'react-native';

import ShelfBookCard from '../ShelfBookCard';
import { getMyShelfBooks } from '../../../apis/apiFunction_myShelf';
import VerticalGap from '../../public/publicUtil/VerticalGap';
import MyShelfSettingBar from '../MyShelfSettingBar';
import { useFocusEffect } from '@react-navigation/native';
import ShelfFilterBottomSheet from '../ShelfFilterBottomSheet';
import {useShelf} from '../../../contexts/ShelfContext';

// ... import 생략
const MyShelfTabPage = ({ parentWidth, scrollRef, scrollOffsetY, setScrollOffsetY }) => {
  const [bookList, setBookList] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [lifeBookOnly, setLifeBookOnly] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [keyword, setKeyword] = useState('');
  const { shelfMap } = useShelf();

  const restoredRef = useRef(false);
  const skipScrollCountRef = useRef(0);
  const internalFlatListRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [prevStatus, setPrevStatus] = useState(null);
  const [prevLifeBookOnly, setPrevLifeBookOnly] = useState(false);

  const fetchShelfBooks = useCallback(async () => {
    setIsLoading(true);
    const data = await getMyShelfBooks(0, 10, selectedStatus, lifeBookOnly, keyword);
    setBookList(data.content || []);
    setTotalCount(data.totalCount || 0);
    setPage(1);
    setHasMore((data.content?.length || 0) === 10);
    restoredRef.current = false;
    setIsLayoutReady(false);
    setIsLoading(false);
  }, [selectedStatus, lifeBookOnly, keyword]);

  useEffect(() => {
    fetchShelfBooks();
  }, [fetchShelfBooks]);

  const handleUpdateShelfBookInfo = (isbn13, updatedFields) => {
    if (updatedFields === null) {
      //  삭제된 경우: 리스트에서 제거
      setBookList((prev) => prev.filter((book) => book.shelfInfo.isbn13 !== isbn13));
    } else {
      //  상태 변경 or 인생책 변경
      setBookList((prev) =>
        prev.map((book) =>
          book.shelfInfo.isbn13 === isbn13
            ? {
              ...book,
              shelfInfo: {
                ...book.shelfInfo,
                ...updatedFields,
              },
            }
            : book
        )
      );
    }
  };


  useEffect(() => {
    // 책장 Map이 바뀌면 다시 불러오도록!
    fetchShelfBooks();
  }, [shelfMap]);

  const fetchNextPage = async () => {
    if (!hasMore) return;
    const data = await getMyShelfBooks(page, 10, selectedStatus, lifeBookOnly, keyword);
    const newBooks = data.content || [];
    setBookList((prev) => {
      const merged = [...prev, ...newBooks];
      const uniqueBooksMap = new Map();
      merged.forEach((book) => {
        uniqueBooksMap.set(book.shelfInfo.isbn13, book);
      });
      return Array.from(uniqueBooksMap.values());
    });
    const nextPage = page + 1;
    setPage(nextPage);
    setHasMore(nextPage * 10 < (data.totalCount || 0));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchShelfBooks();
    setRefreshing(false);
  };

  const styles = getStyles(parentWidth);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, width: '100%' }}>
      {filterVisible && <View style={styles.overlayBackground} />}

      <ShelfFilterBottomSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        lifeBookOnly={lifeBookOnly}
        setLifeBookOnly={setLifeBookOnly}
        onApply={(newStatus, newLifeBookOnly) => {
          setSelectedStatus(newStatus);
          setLifeBookOnly(newLifeBookOnly);
          setFilterVisible(false);
        }}
      />

      <FlatList
        data={bookList}
        ref={(ref) => {
          scrollRef.current = ref;
          internalFlatListRef.current = ref;
        }}
        onLayout={() => setIsLayoutReady(true)}
        keyExtractor={(item) => item.shelfInfo.isbn13}
        renderItem={({ item }) => (
          <ShelfBookCard
            book={item}
            parentWidth={parentWidth}
            onUpdateShelfBookInfo={handleUpdateShelfBookInfo}
          />
        )}
        onScroll={(e) => {
          if (skipScrollCountRef.current > 0) {
            skipScrollCountRef.current -= 1;
            return;
          }
          setScrollOffsetY(e.nativeEvent.contentOffset.y);
        }}
        ListHeaderComponent={
          <MyShelfSettingBar
            totalCount={totalCount}
            onSettingPress={() => setFilterVisible(true)}
            onSearch={(keyword) => {
              setPrevStatus(selectedStatus);
              setPrevLifeBookOnly(lifeBookOnly);
              setSelectedStatus(null);
              setLifeBookOnly(false);
              setKeyword(keyword);
            }}
            onSearchCancel={() => {
              setKeyword('');
              setSelectedStatus(prevStatus);
              setLifeBookOnly(prevLifeBookOnly);
            }}
            onFilterReset={() => {
              setSelectedStatus(null);
              setLifeBookOnly(false);
            }}
          />
        }
        ListFooterComponent={<VerticalGap height={parentWidth * 0.07} />}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.01}
        ListEmptyComponent={
          <Text style={styles.emptyText}>책장에 추가된 책이 없습니다 📚</Text>
        }
      />
    </View>
  );
};


export default MyShelfTabPage;

const getStyles = (width) =>
  StyleSheet.create({
    container: {
      paddingTop: width * 0.01,
      paddingBottom: width * 0.07,
      paddingHorizontal: width * 0.007,
    },
    emptyText: {
      fontSize: width * 0.035,
      textAlign: 'center',
      marginTop: width * 0.2,
      fontFamily: 'NotoSansKR-Regular',
    },
    overlayBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.17)',
      zIndex: 9,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: width * 0.02,
      fontSize: width * 0.038,
      fontFamily: 'NotoSansKR-Regular',
      color: '#666',
    },
  });
