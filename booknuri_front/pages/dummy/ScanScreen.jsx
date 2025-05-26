import React from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const ScanScreen = () => {
    const handleMessage = (event) => {
        const data = event.nativeEvent.data;
        console.log('📚 받은 바코드:', data);
        Alert.alert('스캔 성공!', `결과: ${data}`);
    };

    // 안드로이드에서는 'file:///android_asset/barcode.html' 경로 사용
    // iOS에서는 'bundle-assets://barcode.html' 경로 사용
    const sourceUri =
        Platform.OS === 'android'
            ? 'file:///android_asset/barcode.html' // 안드로이드 경로
            : 'bundle-assets://barcode.html'; // iOS는 번들에 포함된 HTML 파일 경로

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: sourceUri }}
                originWhitelist={['*']}
                javaScriptEnabled={true}
                onMessage={handleMessage}
                mediaPlaybackRequiresUserAction={false}
                allowsInlineMediaPlayback={true}
            />
        </View>
    );
};

export default ScanScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
});
