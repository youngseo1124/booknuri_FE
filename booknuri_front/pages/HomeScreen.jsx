import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoginContext } from "../contexts/LoginContextProvider";
import ToastPopup from '../components/public/ToastPopup'; // ✅ 토스트 불러오기

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
    const { logout } = useContext(LoginContext);
    const insets = useSafeAreaInsets();

    const [showToast, setShowToast] = useState(false); // ✅ 토스트 상태 추가

    // ✅ 버튼 클릭 시 토스트 보이게
    const handleShowToast = () => {
        setShowToast(true);
    };

    return (
      <View style={[styles.safeContainer, { paddingTop: insets.top, backgroundColor: "#000000" }]}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>

              {/* 로그아웃 버튼 */}
              <TouchableOpacity
                onPress={logout}
                style={styles.logoutButton}
              >
                  <Text style={styles.logoutText}>로그아웃 하기</Text>
              </TouchableOpacity>

              {/* ✅ 토스트 테스트용 버튼 */}
              <TouchableOpacity
                onPress={handleShowToast}
                style={styles.toastButton}
              >
                  <Text style={styles.toastText}>토스트 테스트 버튼</Text>
              </TouchableOpacity>

          </ScrollView>

          {/* ✅ 토스트 컴포넌트 (조건부 렌더링) */}
          {showToast && (
            <ToastPopup
              message="✅ 테스트 성공! 토스트 떴지롱~"
              onClose={() => setShowToast(false)}
            />
          )}
      </View>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
    },
    scrollContainer: {
        alignItems: "center",
        paddingTop: width * 0.04,
        backgroundColor: "#faf5f2",
        minHeight: height * 1,
    },
    logoutButton: {
        backgroundColor: "#ff4444",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 20,
    },
    logoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    toastButton: {
        backgroundColor: "#4444ff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 30,
    },
    toastText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default HomeScreen;
