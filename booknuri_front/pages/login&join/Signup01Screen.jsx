import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import Header from '../../components/public/publicHeader/Header';
import SignupFormStep01 from "../../components/Login/SignupFormStep01";
import FixedBottomButton from "../../components/public/publicButton/FixedBottomButton";
import { join } from "../../apis/apiFunction";
import { useNavigation } from '@react-navigation/native';
import CommonLayout from '../../components/public/bookpublic/CommonLayout'; // ✅ 공통 레이아웃

const { width } = Dimensions.get("window");

const Signup01Screen = () => {
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
          navigation.replace("LoginScreen");
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
      <CommonLayout>
        <Header title="회원가입" />

        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.content}
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

        <FixedBottomButton
            disabled={!isValid}
            onPress={handleSignup}
            label="회원가입 완료"
        />
      </CommonLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingBottom: width * 0.2, // 버튼 공간 확보
  },
});

export default Signup01Screen;
