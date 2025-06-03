import React, { useContext } from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { LoginContext } from '../../contexts/LoginContextProvider';
import { getProfile, login as kakaoLogin } from '@react-native-seoul/kakao-login';
import { kakaoLoginAPI, userinfo } from '../../apis/apiFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

const KakaoLoginButton = () => {
  const { updateUserState } = useContext(LoginContext);

  const handleKakaoLogin = async () => {
    try {
      const token = await kakaoLogin();
      console.log(' 카카오 로그인 성공:', token);

      const profile = await getProfile();
      console.log(' 카카오 사용자 ID:', profile.id);

      const res = await kakaoLoginAPI(profile.id, profile.nickname);
      const { accessToken, refreshToken } = res.data;

      await AsyncStorage.setItem('accessToken', accessToken);
      await EncryptedStorage.setItem('refreshToken', refreshToken);

      // ✅ 저장 직후 다시 accessToken 로그 찍기
      const testToken = await AsyncStorage.getItem("accessToken");
      console.log("✅ AsyncStorage 저장 후 accessToken 확인:", testToken); // 여기가

      const userRes = await userinfo(); // 사용자 정보 요청
      if (userRes.status === 200) {
        console.log(" 사용자 정보:", userRes.data);
        await updateUserState(userRes.data);
      }

    } catch (err) {
      console.error('❌ 카카오 로그인 실패', err);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleKakaoLogin}>
      <Image
        source={require('../../image/login/kakao.png')}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');
const iconSize = width * 0.14;

const styles = StyleSheet.create({
  button: {
    width: iconSize,
    height: iconSize,
    borderRadius: iconSize / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    backgroundColor: '#ffed75',
  },
  icon: {
    width: '47%',
    height: '47%',
    resizeMode: 'contain',
  },
});

export default KakaoLoginButton;
