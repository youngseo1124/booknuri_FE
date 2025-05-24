import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import {
  getAllLibraries,
  getLibrariesBySi,
  getLibrariesBySiGu,
} from '../../../apis/apiFunction';

const { width: fixwidth } = Dimensions.get("window");

const LibraryList = ({ onSelectLibrary, selectedLibrary, filter }) => {
  const { width } = useWindowDimensions();

  const [libraries, setLibraries] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const getDataByFilter = async ({ si, gu, keyword, offset }) => {
    if (si && gu) return await getLibrariesBySiGu({ si, gu, keyword, offset });
    if (si) return await getLibrariesBySi({ si, keyword, offset });
    return await getAllLibraries({ keyword, offset });
  };

  const loadMoreLibraries = async () => {
    if (!hasMore) return;

    try {
      const res = await getDataByFilter({ ...filter, offset });
      if (res.data.length < 20) setHasMore(false);
      setLibraries(prev => [...prev, ...res.data]);
      setOffset(prev => prev + 20);
    } catch (err) {
      console.error("❌ 도서관 추가 로딩 실패", err);
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setOffset(0);
        setHasMore(true);
        const res = await getDataByFilter({ ...filter, offset: 0 });
        setLibraries(res.data);
        if (res.data.length < 20) setHasMore(false);
        setOffset(20);
      } catch (err) {
        console.error("❌ 도서관 목록 초기 로딩 실패", err);
        setLibraries([]);
      }
    };
    fetchInitial();
  }, [filter]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.item,
        selectedLibrary?.libCode === item.libCode && styles.selectedItem,
      ]}
      onPress={() => onSelectLibrary(item)}
    >
      <Text style={styles.name}>{item.libName}</Text>
      <Text style={styles.addr}>{item.fullAddress}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={libraries}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.libCode}_${index}`}
      onEndReached={loadMoreLibraries}
      onEndReachedThreshold={0.5}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: '100%',
  },
  item: {
    padding: fixwidth * 0.04,
    borderBottomColor: '#eee',
    marginBottom: fixwidth * 0.025,
    borderRadius: fixwidth * 0.02,
    backgroundColor: '#f5f5f5',
  },
  selectedItem: {
    backgroundColor: '#e0f7fa',
  },
  name: {
    fontWeight: 'bold',
    fontSize: fixwidth * 0.045,
  },
  addr: {
    color: '#666',
    fontSize: fixwidth * 0.035,
    marginTop: fixwidth * 0.01,
  },
});

export default LibraryList;
