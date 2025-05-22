import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import EncryptedStorage from 'react-native-encrypted-storage';
import api from "../apis/api";
import { useNavigation } from "@react-navigation/native";
import AlertPopup from '../apis/AlertPopup';
import ConfirmPopup from '../apis/ConfirmPopup';
import {login as loginAPI, logout as logoutAPI, userinfo} from '../apis/apiFunction';

export const LoginContext = createContext();

const LoginContextProvider = ({ children }) => {
  // 로그인 상태 / 사용자 정보 / 로딩 여부를 저장할 상태 변수들
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const navigation = useNavigation();

  // 팝업 관련 상태들
  const [alertData, setAlertData] = useState({ visible: false, title: "", message: "", onClose: null });
  const [confirmData, setConfirmData] = useState({ visible: false, title: "", message: "", onConfirm: null, onCancel: null });

  // 로그인 후 사용자 상태 갱신 함수
  const updateUserState = async (userData) => {
    setUserInfo(userData);
    setIsLogin(true);
    navigation.navigate("HomeScreen");
  };

  // 로그아웃 처리 함수 (팝업 띄우고 유저 확인 받음)
  const logout = async () => {
    setConfirmData({
      visible: true,
      title: "로그아웃 하시겠습니까?",
      message: "로그아웃을 진행합니다.",
      onConfirm: async () => {
        await logoutSetting();
        navigation.navigate("LoginScreen_sf");
      },
      onCancel: () => {},
    });
  };

  // 자체로그인 시 호출되는 함수 (백엔드에 로그인 요청 → 토큰 저장)
  const handleLogin = async (username, password) => {
    try {
      const res = await loginAPI(username, password); // 서버에 로그인 요청
      if (res.status === 200) {
        console.log("로그인 성공:", res.data);

        // accessToken, refreshToken 저장
        await AsyncStorage.setItem("accessToken", res.data.accessToken);
        await EncryptedStorage.setItem("refreshToken", res.data.refreshToken);

        // 사용자 정보 조회해서 context 갱신
        const userRes = await userinfo();
        if (userRes.status === 200) {
          await updateUserState(userRes.data);
          console.log(" 사용자 정보:", userRes.data);
        }
      }
    } catch (err) {
      console.error("❌ 로그인 실패", err);
      setAlertData({
        visible: true,
        title: "로그인 실패",
        message: "아이디 또는 비밀번호가 올바르지 않습니다.",
      });
    }
  };

  // 앱 실행 시 자동 로그인 시도
  useEffect(() => {
    const tryAutoLogin = async () => {
      try {
        const res = await api.get("/users/info"); // accessToken 기반으로 유저 정보 요청
        if (res.status === 200) {
          console.log("✅ 자동 로그인 성공!");
          await updateUserState(res.data);
        }
      } catch (err) {
        console.error("❌ 자동 로그인 실패", err);
        await logoutSetting(); // 실패하면 토큰 제거
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    };
    tryAutoLogin();
  }, []);

  // 로그아웃 처리 함수 (스토리지 정리만 진행)
  const logoutSetting = async () => {
    setIsLogin(false);
    setUserInfo(null);
    await AsyncStorage.removeItem("accessToken"); // access 삭제
    await EncryptedStorage.removeItem("refreshToken");
  };

  // context로 자식 컴포넌트들에게 필요한 값 전달
  return (
    <LoginContext.Provider value={{
      isLoading,
      isLogin,
      logout,
      updateUserState,
      userInfo,
      setUserInfo,
      login: handleLogin
    }}>
      {children}

      {/* 알림 팝업 */}
      <AlertPopup
        {...alertData}
        onClose={() => setAlertData({ ...alertData, visible: false })}
      />

      {/* 확인 팝업 */}
      <ConfirmPopup
        {...confirmData}
        onConfirm={() => {
          if (confirmData.onConfirm) confirmData.onConfirm();
          setConfirmData({ ...confirmData, visible: false });
        }}
        onCancel={() => setConfirmData({ ...confirmData, visible: false })}
      />
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
