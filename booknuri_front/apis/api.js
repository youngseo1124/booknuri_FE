// apis/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EncryptedStorage from "react-native-encrypted-storage";

//학교 반 192.168.0.98
// Axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://192.168.94.109:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 보낼 때 accessToken 헤더에 담기
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답이 401이면 → accessToken 재발급 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        //  EncryptedStorage 에서 refreshToken 꺼내기
        const refreshToken = await EncryptedStorage.getItem("refreshToken");
        if (!refreshToken) return Promise.reject(error);

        //  refreshToken으로 새 accessToken 요청
        const res = await axios.post(
          "http://192.168.94.109:8080/auth/reissue",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const newAccessToken = res.data.accessToken;

        //  새 accessToken 저장
        await AsyncStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest); // 원래 요청 다시 실행
      } catch (err) {
        console.error("❌ 리프레시 토큰도 만료됨");

        // ❌ 재발급 실패 시 모든 토큰 삭제
        await AsyncStorage.removeItem("accessToken");
        await EncryptedStorage.removeItem("refreshToken");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
