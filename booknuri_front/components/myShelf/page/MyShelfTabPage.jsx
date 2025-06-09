import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl } from 'react-native';
import ShelfBookCard from '../ShelfBookCard';
import { getMyShelfBooks } from '../../../apis/apiFunction_myShelf';
import VerticalGap from '../../public/publicUtil/VerticalGap';
import MyShelfSettingBar from '../MyShelfSettingBar';

const MyShelfTabPage = ({ parentWidth }) => {
  const [bookList, setBookList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchShelfBooks = async () => {
    try {
      const data = await getMyShelfBooks(0, 10, selectedStatus);
      setBookList(data.content || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      console.error('책장 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchShelfBooks();
  }, [selectedStatus]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchShelfBooks();
    setRefreshing(false);
  };

  const styles = getStyles(parentWidth);

  return (
    <View style={{ flex: 1, width: '100%' }}>
      <View style={styles.container}>
        <MyShelfSettingBar
          totalCount={totalCount}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onSearchPress={() => console.log('검색')}
          parentWidth={parentWidth}
        />

        {bookList.length === 0 ? (
          <Text style={styles.emptyText}>책장에 추가된 책이 없습니다 📚</Text>
        ) : (
          <FlatList
            data={bookList}
            renderItem={({ item }) => (
              <ShelfBookCard book={item} parentWidth={parentWidth} />
            )}
            keyExtractor={(item) => item.shelfInfo.isbn13}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            contentContainerStyle={{ paddingHorizontal: parentWidth * 0.04 }}
          />
        )}

        <VerticalGap height={parentWidth * 0.05} />
      </View>
    </View>
  );
};

export default MyShelfTabPage;

const getStyles = (width) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      paddingTop: width * 0.01,
      paddingBottom: width * 0.07,
    },
    emptyText: {
      fontSize: width * 0.035,
      textAlign: 'center',
      marginTop: width * 0.2,
    },
  });
