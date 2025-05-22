
//기본 알림창

// ✅ 필요한 라이브러리 불러오기
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

// ✅ AlertPopup 컴포넌트 정의
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
        color:'#000000',
    },
    message: {
        fontSize: 16,
        marginVertical: 10,
    },
    button: {
        marginTop: 10,
        backgroundColor: '#3085d6',
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

export default AlertPopup;
