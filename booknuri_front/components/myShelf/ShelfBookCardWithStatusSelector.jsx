import React, { useState } from 'react';
import {
  View, Text, Image, StyleSheet, Dimensions, Alert, Modal, Pressable, TouchableOpacity
} from 'react-native';

import CategorySelector from '../public/publicButton/CategorySelector';
import { updateBookStatus } from '../../apis/apiFunction_myShelf';

const { width: fixwidth } = Dimensions.get('window');

const statusOptions = [
  { id: 'WANT_TO_READ', name: '읽고 싶은 책' },
  { id: 'READING', name: '읽고 있는 책' },
  { id: 'FINISHED', name: '완독한 책' },
];

const ShelfBookCardWithStatusSelector = ({ book }) => {
  const { bookname, authors, bookImageURL, status, isbn13 } = book.shelfInfo;

  const [selectedStatus, setSelectedStatus] = useState(status);
  const [modalVisible, setModalVisible] = useState(false);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateBookStatus(isbn13, newStatus);
      setSelectedStatus(newStatus);
      setModalVisible(false);
    } catch (err) {
      console.error('상태 변경 실패', err);
      Alert.alert('오류', '책 상태 변경에 실패했어요.');
    }
  };

  const formatTitleLines = (title) => {
    if (!title) return ['', ''];
    const trimmed = title.trim();
    const breakIndex = Math.min(...[':', '='].map((s) => trimmed.indexOf(s)).filter(i => i !== -1));
    if (breakIndex !== Infinity) {
      const first = trimmed.slice(0, breakIndex).trim();
      const second = trimmed.slice(breakIndex).trim().replace(/^[:=]/, ':');
      return [first, second];
    }
    if (trimmed.length > 16) {
      return [trimmed.slice(0, 16), trimmed.slice(16)];
    }
    return [trimmed, ''];
  };

  const [line1, line2] = formatTitleLines(bookname);

  return (
    <View style={styles.card}>
      <Image source={{ uri: bookImageURL }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        {/* 제목 + 저자 전체 묶기 */}
        <View style={styles.metaWrapper}>
          <Text numberOfLines={1} style={styles.title}>{line1}</Text>
          {line2 !== '' && (
            <Text numberOfLines={1} style={styles.titleSub}>{line2}</Text>
          )}
          <Text numberOfLines={1} style={styles.author}>{authors}</Text>
        </View>

        <View style={{ maxWidth: fixwidth * 0.287 }}>
          <CategorySelector
            selectedCategory={selectedStatus}
            categoryList={statusOptions}
            onPress={() => setModalVisible(true)}
            fontSize={fixwidth * 0.03}
            lineHeight={fixwidth * 0.042}
            borderRadius={fixwidth * 0.007}
          />
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)}>
          <View style={styles.modalBox}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={option.id}
                onPress={() => handleStatusChange(option.id)}
                style={styles.optionItem}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedStatus === option.id && { color: '#4a90e2', fontWeight: 'bold' },
                  ]}
                >
                  {option.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default ShelfBookCardWithStatusSelector;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: fixwidth * 0.04,
    backgroundColor: '#fff',
    borderRadius: fixwidth * 0.02,
    borderWidth: fixwidth * 0.001,
    padding: fixwidth * 0.03,
  },
  bookImage: {
    width: fixwidth * 0.237,
    height: fixwidth * 0.337,
    borderRadius: fixwidth * 0.0011,
    marginRight: fixwidth * 0.04,
    borderWidth: fixwidth * 0.00077,
    borderColor: 'rgba(0,0,0,0.77)',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  metaWrapper: {
    height: fixwidth * 0.194,
    justifyContent: 'flex-start',
    marginBottom: fixwidth * 0.02,
  },
  title: {
    fontSize: fixwidth * 0.0417,
    fontFamily: 'NotoSansKR-SemiBold',
    lineHeight: fixwidth * 0.057,
    paddingRight: fixwidth * 0.07,
    color: '#111',
    marginBottom: fixwidth * 0.007,
  },
  titleSub: {
    fontSize: fixwidth * 0.0387,
    fontFamily: 'NotoSansKR-SemiBold',
    lineHeight: fixwidth * 0.05,
    paddingRight: fixwidth * 0.07,
    color: '#111',
    marginBottom: fixwidth * 0.007,
  },
  author: {
    marginTop: fixwidth * 0.01,
    fontSize: fixwidth * 0.032,
    lineHeight: fixwidth * 0.05,
    fontFamily: 'NotoSansKR-Regular',
    color: '#666',
    marginBottom: fixwidth * 0.057,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.23)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: fixwidth * 0.7,
    maxHeight: fixwidth * 1.2,
    backgroundColor: '#fff',
    borderRadius: fixwidth * 0.005,
    paddingHorizontal: fixwidth * 0.04,
    paddingVertical: fixwidth * 0.022,
    borderWidth: fixwidth * 0.0007,
    borderColor: 'rgba(0,0,0,0.77)',
  },
  optionItem: {
    paddingVertical: fixwidth * 0.03,
  },
  optionText: {
    fontSize: fixwidth * 0.037,
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: fixwidth * 0.077,
    color: '#111',
  },
});
