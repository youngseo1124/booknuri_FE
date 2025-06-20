import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const TitleOnlyPopup = ({ visible, title, onConfirm, onCancel }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>{String(title)}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TitleOnlyPopup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.17)',
  },
  popup: {
    backgroundColor: 'white',
    paddingVertical: fixwidth * 0.077,
    paddingHorizontal: fixwidth * 0.08,
    borderRadius: fixwidth * 0.017,
    width: fixwidth * 0.77,
    alignItems: 'center',
    borderWidth: fixwidth * 0.0007,
  },
  title: {
    fontSize: fixwidth * 0.045,
    fontFamily: 'NotoSansKR-SemiBold',
    color: '#000',
    marginBottom: fixwidth * 0.02,
    textAlign: 'center',
    lineHeight: fixwidth * 0.05,
    paddingVertical: fixwidth * 0.02,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: fixwidth * 0.03,
    gap: fixwidth * 0.03,
  },
  cancelButton: {
    backgroundColor: '#d9d9d9',
    paddingVertical: fixwidth * 0.025,
    borderRadius: fixwidth * 0.02,
    width: fixwidth * 0.2,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: 'rgb(97,156,245)',
    paddingVertical: fixwidth * 0.0197,
    borderRadius: fixwidth * 0.02,
    width: fixwidth * 0.22,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: fixwidth * 0.037,
    lineHeight: fixwidth * 0.05,
    fontFamily: 'NotoSansKR-Medium',
  },
});
