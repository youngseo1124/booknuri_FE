import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';

import Header from '../../components/public/publicHeader/Header';
import CommonLayout from '../../components/public/bookpublic/CommonLayout';
import SortTabs from '../../components/public/bookpublic/SortTabs';
import BookReflectionItem from '../../components/public/bookpublic/BookReflectionItem';
import { checkAlreadyReflected, getBookReflectionList, toggleLikeReflection } from '../../apis/apiFunction_bookReflection';
import BookDetailRatingSummaryBlock from '../../components/bookDetailpage/BookDetailRatingSummaryBlock';
import WriteButton from '../../components/public/publicButton/WriteButton';
import AlertPopup from '../../components/public/publicPopup_Alert_etc/AlertPopup';
import TitleOnlyPopup from '../../components/public/publicPopup_Alert_etc/TitleOnlyPopup';
import { deleteReflection } from '../../apis/apiFunction_bookReflection';

const { width: fixwidth } = Dimensions.get('window');

const ReflectionListScreen = ({ route, navigation }) => {
  const { isbn13 } = route.params;

  const [reflections, setReflections] = useState([]);
  const [sort, setSort] = useState('like');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedReflectionId, setSelectedReflectionId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const LIMIT = 20;

  const fetchReflections = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);
    try {
      const res = await getBookReflectionList(isbn13, sort, reset ? 0 : offset, LIMIT);
      // 비공개 제거!
      const data = res.data;
      const onlyPublic = data.reflections.filter(item => item.visibleToPublic);

      if (reset) {
        setReflections(onlyPublic);
        setOffset(LIMIT);
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

  const handleReportPress = (id) => {
    console.log('신고 ID:', id);
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
      <Header title={`독후감 (${reflections.length})`} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerBox}>
          <View style={styles.headerSection}>
            <BookDetailRatingSummaryBlock
              averageRating={averageRating}
              ratingDistribution={ratingDistribution}
            />
            <WriteButton label="독후감 쓰기" onPress={handleWritePress} />
            <View style={styles.sortTabWrapper}>
              <SortTabs currentSort={sort} onChange={setSort} />
            </View>
          </View>

          <View style={styles.reviewListContainer}>
            {reflections.map((item) => (
              <View key={item.id} style={styles.reviewItemWrapper}>
                <BookReflectionItem
                  item={item}
                  onLikePress={handleLikePress}
                  onReportPress={handleReportPress}
                  onEditPress={handleEditPress}
                  onDeletePress={handleDeletePress}
                />
              </View>
            ))}
          </View>

          {loading && (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="small" color="#aaa" />
            </View>
          )}
        </View>
      </ScrollView>

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
    width: '100%',
    marginTop: fixwidth * 0.025,
    paddingBottom: fixwidth * 0.11,
  },
  innerBox: {
    width: '94%',
    alignSelf: 'center',
  },
  headerSection: {
    gap: fixwidth * 0.037,
  },
  sortTabWrapper: {
    width: '100%',
    alignSelf: 'center',
  },
  reviewListContainer: {
    gap: fixwidth * 0.04,
  },
  loadingWrapper: {
    marginTop: fixwidth * 0.05,
    alignItems: 'center',
  },
});
