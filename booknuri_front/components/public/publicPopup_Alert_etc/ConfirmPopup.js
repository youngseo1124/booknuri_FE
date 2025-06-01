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
    const { width: fixwidth } = useWindowDimensions(); // ✅ 실시간 반응하는 width!

    return (
      <Modal visible={visible} transparent animationType="fade">
          <View style={styles.overlay}>
              <View
                style={[
                    styles.popup(fixwidth),
                    isLandscape && styles.popupLandscape(fixwidth),
                ]}
              >
                  <Text style={styles.title(fixwidth)}>{String(title)}</Text>
                  <Text style={styles.message(fixwidth)}>{String(message)}</Text>

                  <View style={styles.buttonContainer(fixwidth)}>
                      <TouchableOpacity
                        style={styles.cancelButton(fixwidth)}
                        onPress={onCancel}
                      >
                          <Text style={styles.buttonText(fixwidth)}>취소</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.confirmButton(fixwidth)}
                        onPress={onConfirm}
                      >
                          <Text style={styles.buttonText(fixwidth)}>확인</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      </Modal>
    );
};

export default ConfirmPopup;

// ✅ 모든 스타일을 함수형으로 변경해서 fixwidth 반응하도록 처리
const styles = {
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: (w) => ({
        backgroundColor: 'white',
        paddingVertical: w * 0.06,
        paddingHorizontal: w * 0.06,
        borderRadius: w * 0.03,
        width: w * 0.8,
        alignItems: 'center',
    }),
    popupLandscape: (w) => ({
        width: w * 0.6,
    }),
    title: (w) => ({
        fontSize: w * 0.045,
        fontFamily: 'NotoSansKR-SemiBold',
        color: '#000000',
        marginBottom: w * 0.02,
        textAlign: 'center',
        lineHeight: w * 0.05,
        paddingVertical: w * 0.02,
    }),
    message: (w) => ({
        fontSize: w * 0.037,
        fontFamily: 'NotoSansKR-Regular',
        color: '#333333',
        marginBottom: w * 0.04,
        textAlign: 'center',
        lineHeight: w * 0.05,
    }),
    buttonContainer: (w) => ({
        flexDirection: 'row',
        justifyContent: 'center',
        gap: w * 0.03,
    }),
    cancelButton: (w) => ({
        backgroundColor: 'rgba(97,156,245,0.6)',
        paddingVertical: w * 0.025,
        borderRadius: w * 0.02,
        width: w * 0.25,
        alignItems: 'center',
        marginRight: w * 0.02,
    }),
    confirmButton: (w) => ({
        backgroundColor: 'rgba(97,156,245,0.95)',
        paddingVertical: w * 0.025,
        borderRadius: w * 0.02,
        width: w * 0.25,
        alignItems: 'center',
    }),
    buttonText: (w) => ({
        color: 'white',
        fontSize: w * 0.038,
        lineHeight: w * 0.05,
        fontFamily: 'NotoSansKR-Medium',
    }),
};
