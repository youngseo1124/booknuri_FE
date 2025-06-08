import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    useWindowDimensions,
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

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.17)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        backgroundColor: 'white',
        paddingVertical: 24,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: '80%',
        alignItems: 'center',

    },
    popupLandscape: {
        width: '60%',
    },
    title: {
        fontSize: 18,
        fontFamily: 'NotoSansKR-SemiBold',
        color: '#000',
        marginBottom: 12,
        textAlign: 'center',
        lineHeight: 20,
        paddingVertical: 8,
    },
    message: {
        fontSize: 15,
        fontFamily: 'NotoSansKR-Regular',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    cancelButton: {
        backgroundColor: 'rgb(97,156,245)',
        paddingVertical: 14,
        borderRadius: 8,
        width: '25%',
        alignItems: 'center',
        marginRight: 12,
    },
    confirmButton: {
        backgroundColor: 'rgb(97,156,245)',
        paddingVertical: 14,
        borderRadius: 8,
        width: '25%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
        lineHeight: 20,
        fontFamily: 'NotoSansKR-Medium',
    },
});
