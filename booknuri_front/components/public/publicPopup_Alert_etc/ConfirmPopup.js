import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    useWindowDimensions, Dimensions,
} from 'react-native';

const ConfirmPopup = ({
                          visible,
                          title,
                          message,
                          onConfirm,
                          onCancel,
                          isLandscape = false,
                      }) => {
    const { width: fixwidth } = useWindowDimensions();

    return (
      <Modal visible={visible} transparent animationType="fade">
          <View style={styles.overlay}>
              <View style={[styles.popup, isLandscape && styles.popupLandscape]}>
                  <Text style={styles.title}>{String(title)}</Text>
                  <Text style={styles.message}>{String(message)}</Text>

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

export default ConfirmPopup;

const { width: fixwidth } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.17)',
        justifyContent: 'center',
        alignItems: 'center',
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
    popupLandscape: {
        width: fixwidth * 0.6,
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
    message: {
        fontSize: fixwidth * 0.037,
        fontFamily: 'NotoSansKR-Regular',
        color: '#333',
        marginBottom: fixwidth * 0.04,
        textAlign: 'center',
        lineHeight: fixwidth * 0.05,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: fixwidth * 0.03,
    },
    cancelButton: {
        backgroundColor: 'rgb(97,156,245)',
        paddingVertical: fixwidth * 0.0197,
        borderRadius: fixwidth * 0.02,
        width: fixwidth * 0.22,
        alignItems: 'center',
        marginRight: fixwidth * 0.03,
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
