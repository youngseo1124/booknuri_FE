;import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  RefreshControl,
  ActivityIndicator,
  StyleSheet, Dimensions,
} from 'react-native';

import ShelfBookCard from '../ShelfBookCard';
import { getMyShelfBooks } from '../../../apis/apiFunction_myShelf';
import VerticalGap from '../../public/publicUtil/VerticalGap';
import MyShelfSettingBar_two from '../MyShelfSettingBar_two';
import ShelfFilterBottomSheet from '../ShelfFilterBottomSheet';
import { useShelf } from '../../../contexts/ShelfContext';

const MyShelfTabPage = ({ parentWidth, scrollRef, scrollOffsetY, setScrollOffsetY }) => {
  const [bookList, setBookList] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // ✅ 최초 로딩
  const [loadingMore, setLoadingMore] = useState(false);      // ✅ 추가 로딩

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [lifeBookOnly, setLifeBookOnly] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [keyword, setKeyword] = useState('');

  const [inputKeyword, setInputKeyword] = useState('');
  const [searching, setSearching] = useState(false);
  const [prevStatus, setPrevStatus] = useState(null);
  const [prevLifeBookOnly, setPrevLifeBookOnly] = useState(false);

  const { shelfMap } = useShelf();
  const skipScrollCountRef = useRef(0);
  const internalFlatListRef = useRef(null);

  const fetchShelfBooks = useCallback(async () => {
    setInitialLoading(true);
    const data = await getMyShelfBooks(0, 10, selectedStatus, lifeBookOnly, keyword);
    setBookList(data.content || []);
    setTotalCount(data.totalCount || 0);
    setPage(1);
    setHasMore((data.content?.length || 0) === 10);
    setInitialLoading(false);
  }, [selectedStatus, lifeBookOnly, keyword]);

  useEffect(() => {
    fetchShelfBooks();
  }, [fetchShelfBooks, shelfMap]);

  const fetchNextPage = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
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
    setPage(page + 1);
    setHasMore((page + 1) * 10 < (data.totalCount || 0));
    setLoadingMore(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchShelfBooks();
    setRefreshing(false);
  };

  const styles = getStyles(parentWidth || 360);

  // ✅ 최초 로딩 중일 땐 스피너만 보여주기
  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
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
        keyExtractor={(item) => item.shelfInfo.isbn13}
        renderItem={({ item }) => (

          <ShelfBookCard
            book={item}
            parentWidth={parentWidth}
            onUpdateShelfBookInfo={(isbn13, update) => {
              if (!update) {
                //  삭제된 경우: 리스트에서 제거
                setBookList(prev => prev.filter(b => b.shelfInfo.isbn13 !== isbn13));
                setTotalCount((prev) => Math.max(0, prev - 1));
              } else {
                // 업데이트된 필드 반영 (status, lifeBook 등)
                setBookList(prev =>
                  prev.map(b =>
                    b.shelfInfo.isbn13 === isbn13
                      ? { ...b, shelfInfo: { ...b.shelfInfo, ...update } }
                      : b
                  )
                );
              }
            }}
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
          <MyShelfSettingBar_two
            totalCount={totalCount}
            searching={searching}
            setSearching={setSearching}
            keyword={inputKeyword}
            setKeyword={setInputKeyword}
            onSearch={() => {
              setPrevStatus(selectedStatus);
              setPrevLifeBookOnly(lifeBookOnly);
              setSelectedStatus(null);
              setLifeBookOnly(false);
              setKeyword(inputKeyword);
            }}
            onSearchCancel={() => {
              setKeyword('');
              setInputKeyword('');
              setSelectedStatus(prevStatus);
              setLifeBookOnly(prevLifeBookOnly);
              setSearching(false);
            }}
            onFilterReset={() => {
              setPrevStatus(selectedStatus);
              setPrevLifeBookOnly(lifeBookOnly);
              setSelectedStatus(null);
              setLifeBookOnly(false);
            }}
            onSettingPress={() => setFilterVisible(true)}
          />
        }
        ListFooterComponent={
          <View style={{ paddingVertical: (parentWidth || 360) * 0.07 }}>
            {loadingMore && <ActivityIndicator size="small" color="#888" />}
            <VerticalGap />
          </View>
        }
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.01}
        ListEmptyComponent={() => (
          <View style={styles.emptyWrapper}>
            <Text style={styles.emptyText}>책장에 추가된 책이 없습니다</Text>
          </View>
        )}
      />
    </View>
  );
};

const { height} = Dimensions.get('window');

export default MyShelfTabPage;

const getStyles = (width) =>
  StyleSheet.create({
    container: {
      paddingTop: width * 0.01,
      paddingBottom: width * 0.07,
      paddingHorizontal: width * 0.007,
    },
    emptyText: {
      fontSize: width * 0.037,
      textAlign: 'center',
      fontFamily: 'NotoSansKR-Regular',
      color:  'rgba(41,41,41,0.77)',

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
      backgroundColor: 'white',
    },
    // 스타일 추가
    emptyWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: height*0.62,
      paddingVertical: 50,
    },

  });
