import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

// 🧠 글자 길이에 따라 width 비율 계산하는 함수
const getWidthRatio = (message) => {
  const len = message?.length || 0;

  // 10글자 이하 → 0.4 고정
  if (len <= 10) return 0.4;

  // 30글자 이상 → 0.8 고정
  if (len >= 30) return 0.8;

  // 중간값은 0.4~0.8 사이 선형 증가 (10~30글자 → 0.4~0.8)
  return 0.4 + ((len - 10) / 20) * 0.4;
};

const ToastPopup = ({ message, onClose }) => {
  const fadeAnim = new Animated.Value(1); // 투명도 애니메이션 값
  const widthRatio = getWidthRatio(message); // 글자길이에 맞는 width 비율 계산

  useEffect(() => {
    // 1.1초 후에 fadeOut 애니메이션 실행
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,          // 투명하게 사라지기
        duration: 400,       // 0.4초 동안
        useNativeDriver: true,
      }).start(() => {
        onClose(); // 다 사라지면 부모에서 제거
      });
    }, 1100);

    // 언마운트 시 타이머 정리
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          opacity: fadeAnim,                                 // 투명도 애니메이션
          width: fixwidth * widthRatio,                      // 너비 유동적
          transform: [{ translateX: -(fixwidth * widthRatio / 2) }], // 가운데 정렬
        },
      ]}
    >
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

export default ToastPopup;

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: '45%',
    left: '50%', // 💡 가운데 정렬 시작점
    backgroundColor: 'rgba(0,0,0,0.62)', // 반투명 검정 배경
    paddingVertical: fixwidth * 0.022,
    borderRadius: fixwidth * 0.022,
    zIndex: 9999,
  },
  toastText: {
    color: '#fff',
    fontSize: fixwidth * 0.036,
    fontFamily: 'NotoSansKR-Regular',
    textAlign: 'center',
    lineHeight: fixwidth * 0.05,
  },
});
