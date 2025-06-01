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
import AlertPopup from '../components/public/publicPopup_Alert_etc/AlertPopup'; // ✅ 추가
import { useNavigation } from '@react-navigation/native';
import { checkBookExists } from '../apis/apiFunction_book';

const ScanScreen = () => {
    const navigation = useNavigation();

    const [hasPermission, setHasPermission] = useState(false);
    const [scannedData, setScannedData] = useState('');
    const [popupVisible, setPopupVisible] = useState(false);
    const [isLandscapeFromWebView, setIsLandscapeFromWebView] = useState(false);
    const [failCount, setFailCount] = useState(0); // ❌ 실패 카운트
    const [showAlertPopup, setShowAlertPopup] = useState(false); // ⚠️ 안내 팝업

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

            const { data } = await checkBookExists(isbn);

            if (data === true) {
                console.log('✅ 존재하는 ISBN:', isbn);
                setScannedData(isbn);
                setPopupVisible(true);
                setFailCount(0); // 성공 시 실패 카운트 초기화
            } else {
                console.warn('📕 DB에 없는 ISBN:', isbn);
                setFailCount(prev => {
                    const updated = prev + 1;
                    if (updated >= 2) {
                        setShowAlertPopup(true);
                    }
                    return updated;
                });
            }
        } catch (err) {
            console.error('❌ 메시지 처리 중 에러:', err);
        }
    };

    // ✅ 확인 버튼
    const handleConfirm = () => {
        setPopupVisible(false);
        navigation.replace('BookDetailScreen', { isbn: scannedData });
    };

    // ✅ 취소 버튼
    const handleCancel = () => {
        setPopupVisible(false);
        setScannedData('');
    };

    // ✅ 바코드 HTML 경로 설정
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

          {/* ✅ 유효 ISBN일 때 */}
          <ConfirmPopup
            visible={popupVisible}
            title="스캔 완료"
            message={`이 ISBN(바코드 번호)로 진행할까요?\n\n ${scannedData}`}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            isLandscape={isLandscapeFromWebView}
          />

          {/* 연속 실패 2회 이상 안내 */}
          <AlertPopup
            visible={showAlertPopup}
            title="도서 미등록 안내"
            message={`스캔한 책은 아직 등록되지 않았어요.\n다른 책을 시도해보거나 나중에 다시 시도해주세요.`}
            onClose={() => {
                setShowAlertPopup(false);
                navigation.goBack();
            }}

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
