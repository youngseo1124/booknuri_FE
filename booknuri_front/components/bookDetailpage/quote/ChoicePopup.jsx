import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, BackHandler, Platform } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const ChoicePopup = ({ visible, onClose, onDirectWrite, onOCR }) => {
  useEffect(() => {
    if (Platform.OS === 'android' && visible) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        onClose(); // 모달 닫기
        return true; // 기본 뒤로가기 동작 막기
      });

      return () => backHandler.remove();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <TouchableOpacity style={styles.optionBox} onPress={onDirectWrite} activeOpacity={0.87}>
            <Text style={styles.optionText}> 바로 작성하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionBox} onPress={onOCR}>
            <Text style={styles.optionText}> 사진에서 글귀 추출하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ChoicePopup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.17)',
  },
  popup: {
    width: fixwidth * 0.67,
    borderRadius: fixwidth * 0.02,
    overflow: 'hidden',
    borderWidth: fixwidth * 0.0011,

  },
  optionBox: {
    borderWidth: fixwidth * 0.0011,
    borderColor: 'rgb(135,135,135)',
    paddingVertical: fixwidth * 0.007,
    alignItems: 'center',
    backgroundColor:'rgba(255,255,255,0.96)',
  },
  optionText: {
    fontSize: fixwidth * 0.035,
    fontFamily: 'NotoSansKR-Regular',
    color: 'rgba(17,17,17,0.75)',
  },
});
