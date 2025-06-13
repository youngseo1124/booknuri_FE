import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const AlertPopup = ({ visible, title, message, onClose }) => {
    return (
      <Modal visible={visible} transparent animationType="fade">
          <View style={styles.overlay}>
              <View style={styles.popup}>
                  <Text style={styles.title}>{String(title)}</Text>
                  <Text style={styles.message}>{String(message)}</Text>

                  <TouchableOpacity style={styles.button} onPress={onClose}>
                      <Text style={styles.buttonText}>확인</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>
    );
};

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
        color: '#000000',
        marginBottom: fixwidth * 0.02,
        textAlign: 'center',
        lineHeight: fixwidth * 0.05,
        paddingVertical: fixwidth * 0.02,
    },
    message: {
        fontSize: fixwidth * 0.037,
        fontFamily: 'NotoSansKR-Regular',
        color: '#333333',
        marginBottom: fixwidth * 0.04,
        textAlign: 'center',
        lineHeight: fixwidth * 0.05,
    },
    button: {
        backgroundColor: 'rgb(97,156,245)',
        paddingVertical: fixwidth * 0.025,
        borderRadius: fixwidth * 0.02,
        width: fixwidth * 0.2,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: fixwidth * 0.038,
        lineHeight: fixwidth * 0.05,
        fontFamily: 'NotoSansKR-Medium',
    },
});

export default AlertPopup;
