import React from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
    ScrollView,
    Text,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LoginForm from "../../components/Login/LoginForm";
import JoinLinkComponent from "../../components/Login/JoinLinkComponent";
import KakaoLoginButton from "../../components/Login/KakaoLoginButton";
import GoogleLoginButton from "../../components/Login/GoogleLoginButton";

// ✅ 고정 width만 가져오기 (폰트나 스타일 계산용)
const { width: fixwidth, height } = Dimensions.get("window");

const LoginScreen = () => {
    return (
      <>
          <StatusBar barStyle="dark-content" backgroundColor="#e0d6ce" />
          <SafeAreaView edges={["top"]} style={{ backgroundColor: "#e0d6ce" }} />

          <SafeAreaView edges={["left", "right", "bottom"]} style={styles.safeArea}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                      <View style={styles.formWrapper}>
                          {/* 로고 */}
                          <View style={styles.logoWrapper}>
                              <Image
                                source={require("../../image/login/loginlogo.png")}
                                style={styles.logo}
                              />
                          </View>

                          <LoginForm />
                          <JoinLinkComponent />

                          {/* SNS 로그인 섹션 */}
                          <View style={styles.snsSection}>
                              <View style={styles.dividerWrapper}>
                                  <View style={styles.divider} />
                                  <Text style={styles.snsText}>SNS 계정으로 로그인</Text>
                                  <View style={styles.divider} />
                              </View>

                              <View style={styles.snsButtonsWrapper}>
                                  <KakaoLoginButton />
                                  <GoogleLoginButton />
                              </View>
                          </View>
                      </View>
                  </ScrollView>
              </TouchableWithoutFeedback>
          </SafeAreaView>
      </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#e0d6ce",
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e0d6ce",
        paddingVertical: fixwidth * 0.07,
    },
    formWrapper: {
        width: '87%',
        backgroundColor: "#ffffff",
        height: height * 0.79,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: fixwidth * 0.04,
        marginTop: fixwidth * 0.01,
        marginBottom: fixwidth * 0.01,
    },
    logoWrapper: {
        paddingBottom: fixwidth * 0.07,
    },
    logo: {
        width: fixwidth * 0.4,
        height: fixwidth * 0.4,
        resizeMode: "contain",
    },
    snsSection: {
        paddingTop: fixwidth * 0.2,
        alignItems: "center",
        width: "90%", // ✅ 반응형
    },
    dividerWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: fixwidth * 0.04,
        paddingHorizontal: fixwidth * 0.05,
        width: "100%",
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#ccc",
    },
    snsText: {
        marginHorizontal: fixwidth * 0.01,
        color: "#999",
        fontSize: fixwidth * 0.033, // ✅ 반응형 글자크기
    },
    snsButtonsWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: fixwidth * 0.03, // ✅ 여백도 반응형
    },
});

export default LoginScreen;
