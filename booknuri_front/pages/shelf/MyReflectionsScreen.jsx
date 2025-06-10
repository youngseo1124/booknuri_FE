import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';

import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import Header from '../../components/public/publicHeader/Header';
import BookReflectionItem from '../../components/bookDetailpage/reflection/BookReflectionItem';
import TitleOnlyPopup from '../../components/public/publicPopup_Alert_etc/TitleOnlyPopup';
import FixedBottomButton from '../../components/public/publicButton/FixedBottomButton';
import VerticalGap from '../../components/public/publicUtil/VerticalGap';

import {
  getMyReflectionsByBookIsbn,
} from '../../apis/apiFunction_myShelf';
import {
  toggleLikeReflection,
  deleteReflection,
  checkAlreadyReflected,
} from '../../apis/apiFunction_bookReflection';
import AlertPopup from '../../components/public/publicPopup_Alert_etc/AlertPopup';
import MyBookReflectionItem from '../../components/myShelf/MyBookReflectionItem';

const { width: fixwidth, height } = Dimensions.get('window');

const MyReflectionsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { isbn13 } = route.params;

  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedReflectionId, setSelectedReflectionId] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);

  const fetchReflections = async () => {
    try {
      const data = await getMyReflectionsByBookIsbn(isbn13);
      setReflections(data);
    } catch (err) {
      console.error('❌ 독후감 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReflections();
    }, [isbn13])
  );

  const handleLikePress = async (id) => {
    try {
      await toggleLikeReflection(id);
      fetchReflections();
    } catch (err) {
      console.error('❌ 좋아요 실패:', err);
    }
  };

  const handleEditPress = (reflection) => {
    navigation.navigate('ReflectionEditScreen', {
      reflectionId: reflection.id,
      isbn13: isbn13,
    });
  };

  const handleDeletePress = (id) => {
    setSelectedReflectionId(id);
    setDeletePopupVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReflection(selectedReflectionId);
      const updated = reflections.filter((r) => r.id !== selectedReflectionId);
      setReflections(updated);
      setDeletePopupVisible(false);
    } catch (err) {
      console.error('❌ 삭제 실패:', err);
    }
  };

  const handleWritePress = () => {
    navigation.navigate('ReflectionCreateScreen', { isbn13 });
  };

  if (loading) {
    return (
      <CommonLayout>
        <Header title="내 독후감" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#aaa" />
        </View>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout>
      <Header title="내 독후감" />
      <VerticalGap height={fixwidth * 0.007} />

      <FlatList
        data={reflections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <MyBookReflectionItem
              item={item}
              onLikePress={() => handleLikePress(item.id)}
              onEditPress={handleEditPress}
              onDeletePress={() => handleDeletePress(item.id)}
              onReportPress={(id) => console.log('신고 ID:', id)}
            />
          </View>
        )}
        contentContainerStyle={styles.scrollContent}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              아직 이 책에 대한 독후감이 없어요.{'\n'}첫 독후감을 작성해주세요.
            </Text>
          </View>
        }
      />

      <FixedBottomButton label="독후감 쓰기" onPress={handleWritePress} />

      <TitleOnlyPopup
        visible={deletePopupVisible}
        title="이 독후감을 삭제할까요?"
        onCancel={() => setDeletePopupVisible(false)}
        onConfirm={handleDeleteConfirm}
      />

      <AlertPopup
        visible={alertVisible}
        title="이미 작성한 독후감이 있어요"
        message="한 책당 하나의 공개 독후감만 작성할 수 있어요."
        onClose={() => setAlertVisible(false)}
      />
    </CommonLayout>
  );
};

export default MyReflectionsScreen;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: fixwidth * 0.197,
    paddingHorizontal: fixwidth * 0.03,
  },
  itemWrapper: {
    marginBottom: fixwidth * 0.03,
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
