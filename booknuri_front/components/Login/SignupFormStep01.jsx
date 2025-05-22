import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import { checkEmail, checkUsername } from "../../apis/apiFunction";
import AlertPopup from "../../apis/AlertPopup";

const { width: fixedWidth } = Dimensions.get("window"); // 스타일 계산용

const SignupFormStep01 = ({ form, setForm, error, setError, alert, setAlert }) => {
  const { width: realWidth } = useWindowDimensions(); // 화면 반응형용

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
    <View style={[styles.card, { width: realWidth * 0.95 }]}>
      {/* 아이디 입력 */}
      {/* 🔹 섹션 구분 라벨 - 아이디 */}
      <View style={styles.sectionTitleWrapper}>
        <View style={styles.line} />
        <Text style={styles.sectionTitle}>아이디</Text>
        <View style={styles.line} />
      </View>
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

      {/* 이메일 */}

      {/* 🔹 이메일도 같은 방식 */}
      <View style={styles.sectionTitleWrapper}>
        <View style={styles.line} />
        <Text style={styles.sectionTitle}>이메일</Text>
        <View style={styles.line} />
      </View>
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

      {/* 비밀번호 */}

      {/* 🔹 이메일도 같은 방식 */}
      <View style={styles.sectionTitleWrapper}>
        <View style={styles.line} />
        <Text style={styles.sectionTitle}>비밀번호</Text>
        <View style={styles.line} />
      </View>
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

      {/* 닉네임 */}

      {/* 🔹 이메일도 같은 방식 */}
      <View style={styles.sectionTitleWrapper}>
        <View style={styles.line} />
        <Text style={styles.sectionTitle}>닉네임</Text>
        <View style={styles.line} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="닉네임 입력"
        value={form.nickname}
        onChangeText={(text) => handleChange("nickname", text)}
      />

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
    backgroundColor: "#fff",
    borderRadius: fixedWidth * 0.03,
    paddingHorizontal: fixedWidth * 0.05,
  },
  label: {
    fontSize: fixedWidth * 0.037,
    marginBottom: fixedWidth * 0.01,
    color: "#000",
    marginLeft:fixedWidth*0.02
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: fixedWidth * 0.03,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: fixedWidth * 0.03,
  },
  at: {
    marginHorizontal: fixedWidth * 0.02,
    fontSize: fixedWidth * 0.045,
    color: "#888",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: fixedWidth * 0.015,
    paddingHorizontal: fixedWidth * 0.04,
    height: fixedWidth * 0.11,
    fontSize: fixedWidth * 0.03,
    backgroundColor: "#fff",
    marginBottom: fixedWidth * 0.03,
  },
  checkBtn: {
    marginLeft: fixedWidth * 0.02,
    paddingVertical: fixedWidth * 0.025,
    paddingHorizontal: fixedWidth * 0.04,
    backgroundColor: "rgba(184,171,155,0)",
    borderRadius: fixedWidth * 0.015,
    borderColor:"#959595",
    borderWidth: fixedWidth * 0.002,

    marginBottom: fixedWidth * 0.03,
    height: fixedWidth * 0.11,
  },
  checkBtnText: {
    color: "#000000",
    fontSize: fixedWidth * 0.035
  },
  error: {
    color: "red",
    fontSize: fixedWidth * 0.028,
    marginBottom: fixedWidth * 0.025,
  },
  sectionTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: fixedWidth * 0.04,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  sectionTitle: {
    marginHorizontal: fixedWidth * 0.02,
    fontSize: fixedWidth * 0.037,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default SignupFormStep01;
