import React, { useContext } from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { LoginContext } from '../../contexts/LoginContextProvider';
import { getProfile, login as kakaoLogin } from '@react-native-seoul/kakao-login';
import { fetchUserInfoAfterKakaoLogin } from '../../apis/apiFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

const KakaoLoginButton = () => {
  const { updateUserState } = useContext(LoginContext);

  const handleKakaoLogin = async () => {
    try {
      const token = await kakaoLogin();
      console.log('✅ 카카오 로그인 성공:', token);

      const profile = await getProfile();
      console.log('✅ 카카오 사용자 ID:', profile.id);

      const res = await fetch("http://192.168.0.13:8080/auth/kakaologin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: profile.id,
          nickname: profile.nickname,
        }),
      });

      const data = await res.json();
      const { accessToken, refreshToken } = data;

      await AsyncStorage.setItem('accessToken', accessToken);
      await EncryptedStorage.setItem('refreshToken', refreshToken);

      const userLoaded = await fetchUserInfoAfterKakaoLogin(updateUserState);
      if (!userLoaded) console.error('❌ 사용자 정보 불러오기 실패');

    } catch (err) {
      console.error('❌ 카카오 로그인 실패', err);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleKakaoLogin}>
      <Image
        source={require('../../image/login/google.png')} // 네가 올린 저 동그란 로고 이미지!
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');
const iconSize = width * 0.13;

const styles = StyleSheet.create({
  button: {
    width: iconSize,
    height: iconSize,
    borderRadius: iconSize / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    backgroundColor: '#f3f0f0',
  },
  icon: {
    width: '55%',
    height: '55%',
    resizeMode: 'contain',
  },
});

export default KakaoLoginButton;
