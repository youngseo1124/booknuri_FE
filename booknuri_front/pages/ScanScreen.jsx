import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Text,
    PermissionsAndroid,
} from 'react-native';
import { WebView } from 'react-native-webview';
import ConfirmPopup from '../components/public/publicPopup_Alert_etc/ConfirmPopup';
import { useNavigation } from '@react-navigation/native';
import {checkBookExists} from '../apis/apiFunction_book';

const ScanScreen = () => {
    const navigation = useNavigation();

    const [hasPermission, setHasPermission] = useState(false);
    const [scannedData, setScannedData] = useState('');
    const [popupVisible, setPopupVisible] = useState(false);
    const [isLandscapeFromWebView, setIsLandscapeFromWebView] = useState(false); // ✅ HTML에서 받아온 방향

    // ✅ 카메라 권한 요청
    useEffect(() => {
        const requestPermission = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.CAMERA
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

    // ✅ WebView 메시지 수신
    const handleMessage = async (event) => {
        try {
            const raw = event.nativeEvent.data;
            const { isbn, isLandscape } = JSON.parse(raw);
            setIsLandscapeFromWebView(isLandscape);

            if (!/^97[89][0-9]{10}$/.test(isbn)) {
                console.warn('❌ 유효한 ISBN 아님:', isbn);
                return;
            }

            // ✅ 함수로 API 호출
            const { data } = await checkBookExists(isbn);

            if (data === true) {
                console.log('✅ 존재하는 ISBN:', isbn);
                setScannedData(isbn);
                setPopupVisible(true);
            } else {
                console.warn('📕 DB에 존재하지 않는 ISBN:', isbn);
            }
        } catch (err) {
            console.error('❌ 메시지 처리 중 에러:', err);
        }
    };



    const handleConfirm = () => {
        setPopupVisible(false);
        console.log('📚 ISBN 처리 시작:', scannedData);
        navigation.replace('BookDetailScreen', { isbn: scannedData });
    };

    const handleCancel = () => {
        setPopupVisible(false);
        setScannedData('');
    };

    const sourceUri =
      Platform.OS === 'android'
        ? 'file:///android_asset/barcode.html'
        : 'bundle-assets://barcode.html';

    return (
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
            <Text style={styles.permissionText}>카메라 권한을 요청 중...</Text>
          )}

          <ConfirmPopup
            visible={popupVisible}
            title="스캔 완료"
            message={`이 ISBN(바코드 번호)로 진행할까요?\n\n ${scannedData}`}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            isLandscape={isLandscapeFromWebView}
          />
      </View>
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
