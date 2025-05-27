// (확인/취소 버튼이 있는 팝업)

// ✅ 필요한 라이브러리 불러오기
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

// ✅ ConfirmPopup 컴포넌트 정의
const ConfirmPopup = ({ visible, title, message, onConfirm, onCancel }) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.popup}>
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

// ✅ 스타일 정의
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: 300,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color:'#000000'
    },
    message: {
        fontSize: 16,
        marginVertical: 10,
        color:'#000000'
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    cancelButton: {
        backgroundColor: '#4da6ff',
        padding: 10,
        borderRadius: 5,
        width: 80,
        alignItems: 'center',
        marginRight: 10,
    },
    confirmButton: {
        backgroundColor: '#4da6ff',
        padding: 10,
        borderRadius: 5,
        width: 80,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default ConfirmPopup;
