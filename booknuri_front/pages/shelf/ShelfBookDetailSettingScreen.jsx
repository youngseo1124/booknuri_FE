import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, Modal, Pressable, ScrollView, Switch
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { updateBookStatus, toggleLifeBook, removeBookFromShelf } from '../../apis/apiFunction_myShelf';

import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import Header from '../../components/public/publicHeader/Header';
import WriteButton from '../../components/public/publicButton/WriteButton';
import VerticalGap from '../../components/public/publicUtil/VerticalGap';
import ConfirmPopup from '../../components/public/publicPopup_Alert_etc/ConfirmPopup';
import CategorySelector_two from '../../components/public/selector/CategorySelector_two';

const statusOptions = [
  { id: 'WANT_TO_READ', name: '읽고 싶은 책' },
  { id: 'READING', name: '읽고 있는 책' },
  { id: 'FINISHED', name: '완독한 책' },
];

const ShelfBookDetailSettingScreen = () => {
  const route = useRoute();
  const { shelfBook } = route.params;
  const navigation = useNavigation();
  const fixwidth = require('react-native').Dimensions.get('window').width;

  const [status, setStatus] = useState(shelfBook.status);
  const [lifeBook, setLifeBook] = useState(shelfBook.lifeBook);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleChangeStatus = async (newStatus) => {
    try {
      await updateBookStatus(shelfBook.isbn13, newStatus);
      setStatus(newStatus);
      setModalVisible(false);
    } catch {
      alert('상태 변경 실패');
    }
  };

  const handleToggleLife = async () => {
    try {
      await toggleLifeBook(shelfBook.isbn13);
      setLifeBook(prev => !prev);
    } catch {
      alert('인생책 토글 실패');
    }
  };

  const handleDelete = async () => {
    try {
      await removeBookFromShelf(shelfBook.isbn13);
      setConfirmVisible(false);
      navigation.goBack();
    } catch {
      alert('삭제 실패');
    }
  };

  const InfoRow = ({ label, value, onPress }) => (
    <TouchableOpacity style={styles.infoItemRow} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.selectorLabel}>{label}</Text>
      <View style={styles.rightContent}>
        <Text style={styles.rightText}>{value}</Text>
        <FontAwesomeIcon icon={faChevronRight} size={fixwidth * 0.037} color= 'rgba(0,0,0,0.77)' />
      </View>
    </TouchableOpacity>
  );

  return (
    <CommonLayout>
      <Header title="책 상세 설정" />

      <View style={styles.bookInfoWrapper}>
        <View style={styles.infoRow}>
          <Image source={{ uri: shelfBook.bookImageURL }} style={styles.bookImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bookname}>{shelfBook.bookname}</Text>
            <Text style={styles.authors}>{shelfBook.authors}</Text>
          </View>
        </View>
      </View>


      <ScrollView style={styles.wrapper}>
        <View style={styles.sectionWrapper}>

          {/* 상태 */}
          <View style={styles.infoItemRow}>
            <Text style={styles.selectorLabel}>상태</Text>
            <View style={{ width: "26%"}}>
              <CategorySelector_two
                selectedCategory={status}
                categoryList={statusOptions}
                onPress={() => setModalVisible(true)}
                fontSize={fixwidth * 0.035}
                lineHeight={fixwidth * 0.045}
                borderRadius={fixwidth * 0.01}
              />
            </View>
          </View>

          {/* 인용 / 독후감 / 리뷰 */}
          <InfoRow label="인용" value={`${shelfBook.quoteCount}`} onPress={() => navigation.navigate('MyQuotesScreen')} />
          <InfoRow label="독후감" value={`${shelfBook.reflectionCount}`} onPress={() => navigation.navigate('MyReflectionsScreen')} />
          <InfoRow label="리뷰" value={`${shelfBook.reviewCount}`} onPress={() => navigation.navigate('MyReviewsScreen')} />

          {/* 인생책 */}
          <View style={styles.infoItemRow}>
            <Text style={styles.selectorLabel}>인생책</Text>
            <Switch
              trackColor={{ false: '#ccc', true: '#5494e0' }}
              thumbColor="#fff"
              value={lifeBook}
              onValueChange={handleToggleLife}
            />
          </View>

          <VerticalGap height={fixwidth*0.117}/>

          {/* 책장에서 삭제 버튼 */}
          <WriteButton label="책장에서 삭제" onPress={() => setConfirmVisible(true)} />
        </View>
      </ScrollView>


      {/* 상태 변경 모달 */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)}>
          <View style={styles.modalBox}>
            {statusOptions.map((s) => (
              <TouchableOpacity key={s.id} style={styles.modalItem} onPress={() => handleChangeStatus(s.id)}>
                <Text
                  style={[
                    styles.modalText,
                    status === s.id && {   fontFamily: 'NotoSansKR-Medium',}
                  ]}
                >
                  {s.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* 삭제 확인 팝업 */}
      <ConfirmPopup
        visible={confirmVisible}
        title="삭제"
        message="책장에서 정말 책을 삭제할까요?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmVisible(false)}
      />
    </CommonLayout>
  );
};

export default ShelfBookDetailSettingScreen;

const fixwidth = require('react-native').Dimensions.get('window').width;
const styles = StyleSheet.create({
  wrapper: { paddingVertical:fixwidth*0.01, backgroundColor: '#fff' },
  sectionWrapper: {
    paddingHorizontal: fixwidth * 0.0277,
  },
  infoRow: {
    flexDirection: 'row',
    marginHorizontal: fixwidth * 0.0177,
    borderWidth: fixwidth * 0.0037,
    padding: fixwidth * 0.0337,
    borderRadius: fixwidth * 0.01,
    borderColor: 'rgba(164,164,164,0)',
    marginTop: fixwidth * 0.037,
    marginBottom: fixwidth * 0.047,

  },
  bookInfoWrapper:{
    backgroundColor: 'rgba(214,214,214,0.37)',
    marginBottom:fixwidth * 0.037,
  },
  bookImage: {
    width: fixwidth * 0.24,
    height: fixwidth * 0.34,
    borderRadius: fixwidth * 0.01,
    marginRight: fixwidth * 0.04,
  },
  bookname: {
    fontSize: fixwidth * 0.045,
    fontFamily: 'NotoSansKR-SemiBold',
    marginBottom: fixwidth * 0.01,
  },
  authors: {
    fontSize: fixwidth * 0.033,
    color: '#666',
    fontFamily: 'NotoSansKR-Regular',
  },
  selectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: fixwidth * 0.04,
  },
  selectorLabel: {
    fontSize: fixwidth * 0.038,
    fontFamily: 'NotoSansKR-Medium',
    lineHeight: fixwidth * 0.045,
    color: '#222',
  },
  infoItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: fixwidth * 0.022,
    marginHorizontal: fixwidth * 0.0377,

  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: fixwidth * 0.015,
  },
  rightText: {
    fontSize: fixwidth * 0.036,
    color: '#444',
    fontFamily: 'NotoSansKR-Regular',
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
  modalItem: {
    paddingVertical: fixwidth * 0.03,
  },
  modalText: {
    fontSize: fixwidth * 0.037,
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: fixwidth * 0.077,
    color: '#111',
  },
});
