import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const ToastPopup = ({ message, onClose }) => {
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onClose(); // 부모에서 제거해줌
      });
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

export default ToastPopup;

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: '45%',
    left: '50%',
    width: fixwidth * 0.6, // 고정
    transform: [{ translateX: -(fixwidth * 0.3) }], // 절반만큼 딱!
    backgroundColor: 'rgba(0,0,0,0.62)',
    paddingVertical: fixwidth * 0.022,
    borderRadius: fixwidth * 0.022,
    zIndex: 9999,
  },


  toastText: {
    color: '#fff',
    fontSize: fixwidth * 0.036,
    fontFamily: 'NotoSansKR-Regular',
    textAlign: 'center',
    lineHeight:fixwidth * 0.05
  },
});
