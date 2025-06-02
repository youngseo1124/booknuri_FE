import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import SectionHeader from '../public/bookpublic/SectionHeader';
import SortTabs from '../public/bookpublic/SortTabs';
import MoreButton from '../public/publicButton/MoreButton';
import WriteButton from '../public/publicButton/WriteButton';
import AlertPopup from '../public/publicPopup_Alert_etc/AlertPopup';
import TitleOnlyPopup from '../public/publicPopup_Alert_etc/TitleOnlyPopup';


import BookReflectionItem from '../public/bookpublic/BookReflectionItem';
import {checkAlreadyReflected, deleteReflection} from '../../apis/apiFunction_bookReflection';

const { width: fixwidth } = Dimensions.get('window');

const DPBookReflectionsBlock = ({
                                  reflections,
                                  totalCount,
                                  onLikePress,
                                  onReportPress,
                                  onSortChange,
                                  currentSort,
                                  isbn13,
                                  navigation,
                                }) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedReflectionId, setSelectedReflectionId] = useState(null);

  const renderItem = ({ item }) => (
    <BookReflectionItem
      item={item}
      onLikePress={onLikePress}
      onReportPress={onReportPress}
      onEditPress={(reflection) =>
        navigation.navigate('ReflectionEditScreen', { reflection, isbn13 })
      }
      onDeletePress={(reflectionId) => {
        setSelectedReflectionId(reflectionId);
        setDeletePopupVisible(true);
      }}
    />
  );

  const limitedReflections = reflections?.filter(r => r.visibleToPublic).slice(0, 4) || [];

  const handleWritePress = async () => {
    try {
      const res = await checkAlreadyReflected(isbn13); // 이미 썼는지 확인!
      if (res.data.alreadyReflected) {
        setAlertVisible(true);
        return;
      }

      navigation.navigate('ReflectionCreateScreen', { isbn13 });

    } catch (err) {
      console.error('❌ 독후감 여부 확인 실패:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReflection(selectedReflectionId);
      setDeletePopupVisible(false);
      onSortChange(currentSort); // 새로고침
    } catch (err) {
      console.error('❌ 독후감 삭제 실패:', err);
    }
  };

  const handleEditPress = (item) => {
    navigation.navigate('ReflectionEditScreen', { isbn13: item.isbn13 });
  };

  return (
    <View style={styles.container}>
      <SectionHeader label={`독후감 (${totalCount})`} />
      <SortTabs currentSort={currentSort} onChange={onSortChange} />

      {limitedReflections.length > 0 ? (
        <FlatList
          data={limitedReflections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ gap: fixwidth * 0.04 }}
          style={{ minHeight: fixwidth * 0.17 }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>첫 독후감을 작성해주세요.</Text>
        </View>
      )}

      <View style={styles.wrapper}>
        <MoreButton
          label="독후감 전체 보기"
          onPress={() => navigation.navigate('ReflectionListScreen', { isbn13 })}
        />
        <WriteButton label="독후감 쓰기" onPress={handleWritePress} />
      </View>

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
    </View>
  );
};

export default DPBookReflectionsBlock;

const styles = StyleSheet.create({
  container: {
    width: '93%',
    alignSelf: 'center',
    paddingVertical: fixwidth * 0.07,
  },
  wrapper: {
    paddingTop: fixwidth * 0.025,
    gap: fixwidth * 0.03,
  },
  emptyContainer: {
    minHeight: fixwidth * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: fixwidth * 0.02,
  },
  emptyText: {
    fontSize: fixwidth * 0.033,
    color: '#888',
    fontFamily: 'NotoSansKR-Regular',
  },
});
