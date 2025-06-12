import React, {useEffect} from 'react';
import {
    View,
    StatusBar,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CommonLayout = ({ children }) => {
    console.log('[CommonLayout] 렌더 시작');
    useEffect(() => {
        console.log('[CommonLayout] 마운트 완료');
    }, []);



    return (
        <>
            <StatusBar />

                <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
                    {children}
                </SafeAreaView>

        </>
    );
};

export default CommonLayout;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
