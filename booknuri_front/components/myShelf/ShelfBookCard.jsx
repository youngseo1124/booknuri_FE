import React, { useState } from 'react';
import {
  View, Text, Image, StyleSheet, Dimensions, Alert, Modal, Pressable, TouchableOpacity
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart as faSolidHeart, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

import CategorySelector from '../public/publicButton/CategorySelector';
import { updateBookStatus } from '../../apis/apiFunction_myShelf';
import {useNavigation} from '@react-navigation/native';

const { width: fixwidth } = Dimensions.get('window');

const statusOptions = [
  { id: 'WANT_TO_READ', name: '읽고 싶은 책' },
  { id: 'READING', name: '읽고 있는 책' },
  { id: 'FINISHED', name: '완독한 책' },
];

const ShelfBookCard = ({ book }) => {
  const { bookname, authors, bookImageURL, status, isbn13, lifeBook } = book.shelfInfo;
  const navigation = useNavigation();

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
      <TouchableOpacity
        style={styles.imageWrapper}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('BookDetailScreen', { isbn: isbn13 })}
      >
        <Image source={{ uri: bookImageURL }} style={styles.bookImage} />
        {lifeBook && (
          <View style={styles.heartOnImage}>
            <FontAwesomeIcon
              icon={faSolidHeart}
              size={fixwidth * 0.045}
              color="#e74c3c"
            />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.bookInfo}>
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

      {/* ⋮ 책 상세 메뉴 */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => console.log('도서 상세페이지 이동')}
      >
        <FontAwesomeIcon icon={faEllipsisV} size={fixwidth * 0.04} color="#444" />
      </TouchableOpacity>

      {/* 상태 변경 모달 */}
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

export default ShelfBookCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: fixwidth * 0.04,
    backgroundColor: '#fff',
    borderRadius: fixwidth * 0.02,
    padding: fixwidth * 0.0397,
    position: 'relative',
  },
  imageWrapper: {
    position: 'relative',
    width: fixwidth * 0.237,
    height: fixwidth * 0.337,
    marginRight: fixwidth * 0.04,
  },
  bookImage: {
    width: '100%',
    height: '100%',
    borderRadius: fixwidth * 0.005,
    borderWidth: fixwidth * 0.001,
    borderColor: 'rgba(0,0,0,0.77)',
  },
  heartOnImage: {
    position: 'absolute',
    bottom: fixwidth * 0.01,
    right: fixwidth * 0.01,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: fixwidth * 0.03,
    padding: fixwidth * 0.008,
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
    fontSize: fixwidth * 0.0397,
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
  menuButton: {
    position: 'absolute',
    top: fixwidth * 0.037,
    right: fixwidth * 0.047,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.23)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: fixwidth * 0.7,
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
