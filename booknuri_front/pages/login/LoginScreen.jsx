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

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
    return (
      <>
          {/*  상태바 스타일 지정 (아이콘 검정) */}
          <StatusBar barStyle="dark-content" backgroundColor="#e0d6ce" />

          {/*  SafeAreaView로 상단 보호 */}
          <SafeAreaView edges={['top']} style={{ backgroundColor: "#e0d6ce" }} />

          {/* 하단 영역까지 포함하는 SafeAreaView */}
          <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeArea}>
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
        paddingVertical: width * 0.1,
    },
    formWrapper: {
        width: width * 0.85,
        backgroundColor: "#ffffff",
        minHeight: width * 1,
        height: height * 0.77,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: width * 0.04,
        marginTop: height * 0.01,
        marginBottom: height * 0.01,
    },
    logo: {
        width: width * 0.4,
        height: width * 0.4,
        resizeMode: "contain",
    },
    logoWrapper: {
        paddingBottom: width * 0.07,
    },
    snsSection: {
        paddingTop: width * 0.2,
        alignItems: 'center',
        width: '90%',
    },
    dividerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: width * 0.04,
        paddingHorizontal: width * 0.05,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    snsText: {
        marginHorizontal: width * 0.01,
        color: '#999',
        fontSize: width * 0.033,
    },
    snsButtonsWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
});

export default LoginScreen;
