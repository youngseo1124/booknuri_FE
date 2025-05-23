import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import EncryptedStorage from 'react-native-encrypted-storage';
import api from "../apis/api";
import AlertPopup from '../apis/AlertPopup';
import ConfirmPopup from '../apis/ConfirmPopup';
import { login as loginAPI, userinfo } from '../apis/apiFunction';
import { reset } from '../navigation/RootNavigation';

export const LoginContext = createContext();

const LoginContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const [alertData, setAlertData] = useState({ visible: false, title: "", message: "", onClose: null });
  const [confirmData, setConfirmData] = useState({ visible: false, title: "", message: "", onConfirm: null, onCancel: null });

  const updateUserState = async (userData) => {
    setUserInfo(userData);
    setIsLogin(true);
    reset("HomeScreen");
  };

  const logout = async () => {
    setConfirmData({
      visible: true,
      title: "로그아웃 하시겠습니까?",
      message: "로그아웃을 진행합니다.",
      onConfirm: async () => {
        await logoutSetting();
        reset("LoginScreen_sf");
      },
      onCancel: () => {},
    });
  };

  const handleLogin = async (username, password) => {
    try {
      const res = await loginAPI(username, password);
      if (res.status === 200) {
        console.log("로그인 성공:", res.data);
        await AsyncStorage.setItem("accessToken", res.data.accessToken);
        await EncryptedStorage.setItem("refreshToken", res.data.refreshToken);

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

  useEffect(() => {
    const tryAutoLogin = async () => {
      try {
        const res = await api.get("/users/info");
        console.log(" 자동 로그인 userinfo 응답:", res);

        if (typeof res.data !== "object") {
          throw new Error("응답 데이터가 HTML(스프링 자동 로그인 페이지) ->인증 실패.");
        }

        else if (res.status === 200) {
          console.log("✅ 자동 로그인 성공!");
          await updateUserState(res.data);
        }
      } catch (err) {
        console.error("❌ 자동 로그인 실패", err);
        await logoutSetting();
        reset("LoginScreen_sf");
      } finally {
        setIsLoading(false);
      }
    };
    tryAutoLogin();
  }, []);

  const logoutSetting = async () => {
    setIsLogin(false);
    setUserInfo(null);
    await AsyncStorage.removeItem("accessToken");
    await EncryptedStorage.removeItem("refreshToken");
  };

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

        <AlertPopup
            {...alertData}
            onClose={() => setAlertData({ ...alertData, visible: false })}
        />
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
