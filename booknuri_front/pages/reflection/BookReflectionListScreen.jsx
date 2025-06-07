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
import BookReflectionItem from '../../components/bookDetailpage/reflection/BookReflectionItem';
import BookDetailRatingSummaryBlock from '../../components/bookDetailpage/BookDetailRatingSummaryBlock';
import WriteButton from '../../components/public/publicButton/WriteButton';
import AlertPopup from '../../components/public/publicPopup_Alert_etc/AlertPopup';
import TitleOnlyPopup from '../../components/public/publicPopup_Alert_etc/TitleOnlyPopup';

import {
  checkAlreadyReflected,
  getBookReflectionList,
  toggleLikeReflection,
  deleteReflection,
} from '../../apis/apiFunction_bookReflection';
import {useFocusEffect} from '@react-navigation/native';

const { width: fixwidth } = Dimensions.get('window');

const ReflectionListScreen = ({ route, navigation }) => {
  const { isbn13 } = route.params;

  const [reflections, setReflections] = useState([]);
  const [sort, setSort] = useState('like');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedReflectionId, setSelectedReflectionId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const LIMIT = 20;

  const fetchReflections = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);
    try {
      const res = await getBookReflectionList(isbn13, sort, reset ? 0 : offset, LIMIT);
      const data = res.data;
      const onlyPublic = data.reflections.filter((item) => item.visibleToPublic);

      if (reset) {
        setReflections(onlyPublic);
        setOffset(LIMIT);
        setTotalCount(data.totalCount);
      } else {
        setReflections((prev) => [...prev, ...onlyPublic]);
        setOffset((prev) => prev + LIMIT);
      }

      setHasMore(data.reflections.length === LIMIT);
      setAverageRating(data.averageRating);
      setRatingDistribution(data.ratingDistribution);
      if (reset) setIsReady(true);
    } catch (err) {
      console.error('❌ 독후감 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // 독후감 리스트 새로고침
      fetchReflections(true);
    }, [sort])
  );


  useEffect(() => {
    fetchReflections(true);
  }, [sort]);

  const handleLikePress = async (id) => {
    try {
      await toggleLikeReflection(id);
      fetchReflections(true);
    } catch (err) {
      console.error('❌ 좋아요 실패:', err);
    }
  };

  const handleEditPress = (reflection) => {
    navigation.navigate('ReflectionEditScreen', { reflection, isbn13 });
  };

  const handleDeletePress = (id) => {
    setSelectedReflectionId(id);
    setDeletePopupVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReflection(selectedReflectionId);
      setDeletePopupVisible(false);
      fetchReflections(true);
    } catch (err) {
      console.error('❌ 삭제 실패:', err);
    }
  };

  const handleWritePress = async () => {
    try {
      const res = await checkAlreadyReflected(isbn13);
      if (res.data.alreadyReflected) {
        setAlertVisible(true);
        return;
      }
      navigation.navigate('ReflectionCreateScreen', { isbn13 });
    } catch (err) {
      console.error('❌ 독후감 작성 여부 확인 실패:', err);
    }
  };

  if (!isReady) {
    return (
      <CommonLayout>
        <Header title="독후감" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#aaa" />
        </View>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout>
      <Header title={`독후감 (${totalCount})`} />

      <FlatList
        data={reflections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <BookReflectionItem
              item={item}
              onLikePress={handleLikePress}
              onEditPress={handleEditPress}
              onDeletePress={handleDeletePress}
              onReportPress={(id) => console.log('신고 ID:', id)}
            />
          </View>
        )}
        onEndReached={() => fetchReflections(false)}
        onEndReachedThreshold={0.7}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            <BookDetailRatingSummaryBlock
              averageRating={averageRating}
              ratingDistribution={ratingDistribution}
            />
            <WriteButton label="독후감 쓰기" onPress={handleWritePress} />
            <SortTabs currentSort={sort} onChange={setSort} />
          </View>
        }
        ListFooterComponent={
          loading && (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="small" color="#aaa" />
            </View>
          )
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />

      <AlertPopup
        visible={alertVisible}
        title="이미 작성한 독후감이 있어요"
        message="한 권당 하나의 독후감만 작성할 수 있어요."
        onClose={() => setAlertVisible(false)}
      />

      <TitleOnlyPopup
        visible={deletePopupVisible}
        title="독후감을 삭제할까요?"
        onCancel={() => setDeletePopupVisible(false)}
        onConfirm={handleDeleteConfirm}
      />
    </CommonLayout>
  );
};

export default ReflectionListScreen;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: fixwidth * 0.11,
    paddingHorizontal: fixwidth * 0.01,
  },
  headerSection: {
    width: '94%',
    alignSelf: 'center',
    gap: fixwidth * 0.035,
    marginTop: fixwidth * 0.03,
    marginBottom: fixwidth * 0.0,
  },
  loadingWrapper: {
    marginTop: fixwidth * 0.05,
    alignItems: 'center',
  },
  itemWrapper: {
    marginBottom: fixwidth * 0.03,
    paddingHorizontal: fixwidth * 0.025,
  },
});
