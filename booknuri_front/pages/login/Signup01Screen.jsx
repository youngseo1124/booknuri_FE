// Signup01Screen.js

import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from '../../components/public/Header';
import SignupFormStep01 from "../../components/Login/SignupFormStep01";
import FixedBottomButton from "../../components/public/FixedBottomButton";
import { join } from "../../apis/apiFunction";
import {useNavigation} from '@react-navigation/native';

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = width * 0.12;

const Signup01Screen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [form, setForm] = useState({
    nickname: "",
    emailId: "",
    emailDomain: "naver.com",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({});
  const [alert, setAlert] = useState({ visible: false, title: "", message: "" });

  const handleSignup = async () => {
    const { username, password, nickname, emailId, emailDomain, confirmPassword } = form;

    if (!username || !password || !nickname || !emailId || !emailDomain || !confirmPassword) {
      setAlert({ visible: true, title: "오류", message: "모든 항목을 입력해주세요" });
      return;
    }

    try {
      const email = `${emailId}@${emailDomain}`;
      await join(username, password, nickname, email);

      setAlert({
        visible: true,
        title: "성공",
        message: "회원가입 완료!",
        onClose: () => {
          setAlert((prev) => ({ ...prev, visible: false }));
          navigation.replace("LoginScreen"); // ✅ 이동 여기서 실행됨
        },
      });
    } catch (err) {
      setAlert({
        visible: true,
        title: "실패",
        message: err.response?.data?.message || "회원가입 실패",
      });
    }
  };

  const isValid =
    form.nickname &&
    form.emailId &&
    form.password &&
    form.confirmPassword &&
    !error.confirmPassword;

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Header title="회원가입" />
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.content,
            { paddingTop: HEADER_HEIGHT + insets.top },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SignupFormStep01
            form={form}
            setForm={setForm}
            error={error}
            setError={setError}
            alert={alert}
            setAlert={setAlert}
          />
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* 🔥 하단 고정 버튼 */}
      <FixedBottomButton
        disabled={!isValid}
        onPress={handleSignup}
        label="회원가입 완료"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "#fff",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
});

export default Signup01Screen;
