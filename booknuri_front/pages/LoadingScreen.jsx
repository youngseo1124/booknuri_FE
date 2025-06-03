import {Dimensions, Image, StyleSheet, View} from 'react-native';
import React from 'react';

const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            {/* ✅ 로고 이미지 */}
            <Image source={require("../image/login/loginlogo.png")} style={styles.logo} />
        </View>
    );
};

const { width,height} = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1, // 📌 화면 전체를 차지하도록 설정
        alignItems: "center", // 📌 가로 방향 중앙 정렬
        justifyContent: "center", // 📌 기본적으로 중앙 정렬 (폼 위치 조정에 필요)
        backgroundColor: 'rgb(127,172,253)',
    },
    logo: {
        width: width*0.3,
        height: width*0.3,
        resizeMode: "contain",
    },

});


export default LoadingScreen
