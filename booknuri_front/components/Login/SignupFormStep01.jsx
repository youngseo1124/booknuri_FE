import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { checkEmail, checkUsername } from "../../apis/apiFunction";
import AlertPopup from "../../apis/AlertPopup";
import DividerBlock from "../public/publicUtil/DividerBlock";

const { width: fixedWidth } = Dimensions.get("window");

const SignupFormStep01 = ({ form, setForm, error, setError, alert, setAlert }) => {
  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });

    if (key === "username") {
      const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
      setError((prev) => ({
        ...prev,
        username: usernameRegex.test(value)
          ? ""
          : "아이디는 영문+숫자 포함 4자 이상이어야 해요",
      }));
    }

    if (key === "password") {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
      setError((prev) => ({
        ...prev,
        password: passwordRegex.test(value)
          ? ""
          : "비밀번호는 문자+숫자+특수문자 포함 6자 이상이어야 해요",
      }));
    }

    if (key === "confirmPassword") {
      setError((prev) => ({
        ...prev,
        confirmPassword:
          value === form.password ? "" : "비밀번호가 일치하지 않아요",
      }));
    }
  };

  const checkUsernameDuplication = async () => {
    try {
      await checkUsername(form.username);
      setAlert({ visible: true, title: "확인", message: "사용 가능한 아이디입니다!" });
    } catch {
      setAlert({ visible: true, title: "중복", message: "이미 사용 중인 아이디예요" });
    }
  };

  const checkEmailDuplication = async () => {
    const email = `${form.emailId}@${form.emailDomain}`;
    try {
      await checkEmail(email);
      setAlert({ visible: true, title: "확인", message: "사용 가능한 이메일입니다!" });
    } catch {
      setAlert({ visible: true, title: "중복", message: "이미 사용 중인 이메일이에요" });
    }
  };

  return (
    <View style={styles.card}>
      {/* 아이디 */}
      <View style={styles.inputBlock}>
        <Text style={styles.sectionTitle}>아이디</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="아이디 입력"
            value={form.username}
            onChangeText={(text) => handleChange("username", text)}
          />
          <TouchableOpacity style={styles.checkBtn} onPress={checkUsernameDuplication}>
            <Text style={styles.checkBtnText}>중복확인</Text>
          </TouchableOpacity>
        </View>
        {error.username ? <Text style={styles.error}>{error.username}</Text> : null}
      </View>

      <DividerBlock />

      {/* 이메일 */}
      <View style={styles.inputBlock}>
        <Text style={styles.sectionTitle}>이메일</Text>
        <View style={styles.emailRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="이메일"
            value={form.emailId}
            onChangeText={(text) => handleChange("emailId", text)}
          />
          <Text style={styles.at}>@</Text>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="도메인"
            value={form.emailDomain}
            onChangeText={(text) => handleChange("emailDomain", text)}
          />
          <TouchableOpacity style={styles.checkBtn} onPress={checkEmailDuplication}>
            <Text style={styles.checkBtnText}>중복확인</Text>
          </TouchableOpacity>
        </View>
      </View>

      <DividerBlock />

      {/* 비밀번호 */}
      <View style={styles.inputBlock}>
        <Text style={styles.sectionTitle}>비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호 입력"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
        />
        {error.password ? <Text style={styles.error}>{error.password}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={(text) => handleChange("confirmPassword", text)}
        />
        {error.confirmPassword ? <Text style={styles.error}>{error.confirmPassword}</Text> : null}
      </View>

      <DividerBlock />

      {/* 닉네임 */}
      <View style={styles.inputBlock}>
        <Text style={styles.sectionTitle}>닉네임</Text>
        <TextInput
          style={styles.input}
          placeholder="닉네임 입력"
          value={form.nickname}
          onChangeText={(text) => handleChange("nickname", text)}
        />
      </View>

      <AlertPopup
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        onClose={() => {
          setAlert({ ...alert, visible: false });
          if (alert.onClose) alert.onClose();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: fixedWidth * 0.03,
  },
  inputBlock: {
    marginHorizontal: fixedWidth * 0.05,
    marginVertical:fixedWidth * 0.01,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: fixedWidth * 0.03,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: fixedWidth * 0.03,
  },
  at: {
    marginHorizontal: fixedWidth * 0.02,
    fontSize: fixedWidth * 0.045,
    color: '#888',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: fixedWidth * 0.015,
    paddingHorizontal: fixedWidth * 0.04,
    height: fixedWidth * 0.11,
    fontSize: fixedWidth * 0.03,
    backgroundColor: '#fff',
    marginBottom: fixedWidth * 0.03,
  },
  checkBtn: {
    marginLeft: fixedWidth * 0.02,
    paddingVertical: fixedWidth * 0.025,
    paddingHorizontal: fixedWidth * 0.04,

    borderRadius: fixedWidth * 0.015,
    borderColor: 'rgba(149,149,149,0)',
    borderWidth: fixedWidth * 0.002,
    marginBottom: fixedWidth * 0.03,
    height: fixedWidth * 0.11,
    justifyContent: 'center',
    backgroundColor: 'rgb(97,156,245)'
  },
  checkBtnText: {
    color: '#ffffff',
    fontSize: fixedWidth * 0.035,
  },
  error: {
    color: 'red',
    fontSize: fixedWidth * 0.028,
    marginBottom: fixedWidth * 0.025,
  },
  sectionTitle: {
    fontSize: fixedWidth * 0.037,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: fixedWidth * 0.015,
    marginHorizontal: fixedWidth * 0.01,
  },
});

export default SignupFormStep01;
