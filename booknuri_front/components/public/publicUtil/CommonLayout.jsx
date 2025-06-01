import React from 'react';
import {
    View,
    StatusBar,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CommonLayout = ({ children }) => {
    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

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
