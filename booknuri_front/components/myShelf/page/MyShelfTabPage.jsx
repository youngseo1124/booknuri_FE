import React, { useEffect, useState } from 'react';
import {View, FlatList, StyleSheet, Text, RefreshControl, Dimensions} from 'react-native';
import ShelfBookCard from '../ShelfBookCard';
import {getMyShelfBooks} from '../../../apis/apiFunction_myShelf';
import VerticalGap from '../../public/publicUtil/VerticalGap';
import MyShelfSettingBar from '../MyShelfSettingBar';
const { width: fixwidth } = Dimensions.get('window');

const MyShelfTabPage = () => {
  const [bookList, setBookList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null); // null = 전체
  const [totalCount, setTotalCount] = useState(0);

  const fetchShelfBooks = async () => {
    try {
      const data = await getMyShelfBooks(0, 10, selectedStatus);
      setBookList(data.content || []);
      setTotalCount(data.totalCount || 0); // 총 권 수 저장
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

  const renderItem = ({ item }) => (
    <ShelfBookCard book={item} />
  );

  return (
    <View style={styles.container}>

      <MyShelfSettingBar
        totalCount={totalCount}
        selectedStatus={selectedStatus}
        onStatusChange={() => {
          // 상태 필터 변경 모달 띄우는 방식이면 이 안에서 처리!
        }}
        onSearchPress={() => {
          // 검색 버튼 눌렀을 때 이벤트 처리
          console.log('검색 눌림');
        }}
      />

      {bookList.length === 0 ? (
        <Text style={styles.emptyText}>책장에 추가된 책이 없습니다 📚</Text>
      ) : (
        <FlatList
          data={bookList}
          renderItem={renderItem}
          keyExtractor={(item) => item.shelfInfo.isbn13}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}

      <VerticalGap height={fixwidth * 0.057} />
    </View>
  );
};

export default MyShelfTabPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:fixwidth*0.01,
    paddingBottom:fixwidth*0.077,
  },
});
