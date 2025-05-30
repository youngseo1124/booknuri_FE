import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Platform,
    TouchableWithoutFeedback,
    Text,
    PermissionsAndroid,
} from 'react-native';
import { WebView } from 'react-native-webview';
import ConfirmPopup from '../components/public/publicPopup_Alert_etc/ConfirmPopup';
import { useNavigation } from '@react-navigation/native';


const ScanScreen = () => {
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState(false);
    const [scannedData, setScannedData] = useState('');
    const [hasScanned, setHasScanned] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false);

    useEffect(() => {
        const requestPermission = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    setHasPermission(true);
                }
            } else {
                setHasPermission(true);
            }
        };
        requestPermission();
    }, []);



    const handleMessage = (event) => {
        const data = event.nativeEvent.data;
        if (/^97[89][0-9]{10}$/.test(data)) {
            console.log(' 유효한 ISBN 스캔됨:', data);
            setScannedData(data);
            setHasScanned(true); //  터치 대기 상태
        }
    };

    const handleConfirm = () => {
        setPopupVisible(false);
        console.log('사용자 확인 → 처리 시작:', scannedData);
        navigation.replace('BookDetailScreen', { isbn: scannedData });

    };

    const handleCancel = () => {
        setPopupVisible(false);
        setHasScanned(false); // 다시 터치 대기 가능하게
        setScannedData('');
    };

    const handleTouch = () => {
        if (hasScanned && scannedData) {
            setPopupVisible(true);
        }
    };

    const sourceUri =
        Platform.OS === 'android'
            ? 'file:///android_asset/barcode.html'
            : 'bundle-assets://barcode.html';

    return (
        <TouchableWithoutFeedback onPress={handleTouch}>
            <View style={styles.container}>
                {hasPermission ? (
                    <WebView
                        source={{ uri: sourceUri }}
                        originWhitelist={['*']}
                        javaScriptEnabled={true}
                        onMessage={handleMessage}
                        mediaPlaybackRequiresUserAction={false}
                        allowsInlineMediaPlayback={true}
                    />
                ) : (
                    <Text style={styles.permissionText}> 카메라 권한을 요청 중...</Text>
                )}

                <ConfirmPopup
                    visible={popupVisible}
                    title="스캔 완료"
                    message={`이 ISBN(바코드 번호)로 진행할까요?\n\n ${scannedData}`}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            </View>
        </TouchableWithoutFeedback>
    );
};

export default ScanScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    permissionText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 100,
        fontSize: 16,
    },
});
