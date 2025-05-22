import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../../contexts/LoginContextProvider";

const LoginForm = () => {
  const { login } = useContext(LoginContext);
  const { width } = useWindowDimensions(); // 👉 View용 width
  const { width: fixwidth } = Dimensions.get("window"); // 👉 스타일용 고정 width

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = () => {
    if (!username || !password) return;
    login(username, password);
  };

  return (
    <View style={[styles.form, { width: width * 0.67 }]}>
      {/* 🔐 아이디 입력창 */}
      <View style={styles.inputWrapper}>
        <FontAwesomeIcon icon={faUser} size={fixwidth * 0.04} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoComplete="username"
          placeholder="Username"
          placeholderTextColor="#aaa"
        />
      </View>

      {/* 🔐 비밀번호 입력창 */}
      <View style={styles.inputWrapper}>
        <FontAwesomeIcon icon={faLock} size={fixwidth * 0.04} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          autoComplete="password"
          placeholder="Password"
          placeholderTextColor="#aaa"
        />
      </View>

      {/*  로그인 버튼 */}
      <TouchableOpacity style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width: fixwidth } = Dimensions.get("window");

const styles = StyleSheet.create({
  form: {
    alignSelf: "center",
    alignItems: "stretch",
    paddingBottom: fixwidth * 0.01,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f1f1",
    borderRadius: fixwidth * 0.02,
    marginBottom: fixwidth * 0.02,
    paddingHorizontal: fixwidth * 0.03,
    height: fixwidth * 0.11,
  },
  icon: {
    marginRight: fixwidth * 0.02,
  },
  input: {
    flex: 1,
    fontSize: fixwidth * 0.035,
    color: "#000",
  },
  button: {
    marginTop: fixwidth * 0.022,
    backgroundColor: "#b9a399",
    height: fixwidth * 0.12,
    borderRadius: fixwidth * 0.02,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: fixwidth * 0.045,
    fontWeight: "600",
    color: "#fff",
  },
});

export default LoginForm;
