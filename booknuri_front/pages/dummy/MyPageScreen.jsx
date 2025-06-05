import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoginContext } from '../../contexts/LoginContextProvider';
import ToastPopup from '../../components/public/publicPopup_Alert_etc/ToastPopup';

const { width, height } = Dimensions.get('window');

const MyPageScreen = () => {
  const { logout } = useContext(LoginContext);
  const insets = useSafeAreaInsets();
  const [showToast, setShowToast] = useState(false);

  const handleShowToast = () => {
    setShowToast(true);
  };

  return (
    <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.pageTitle}>👤 마이페이지 (더미)</Text>

        {/* 로그아웃 버튼 */}
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>로그아웃 하기</Text>
        </TouchableOpacity>

        {/* 토스트 테스트용 버튼 */}
        <TouchableOpacity onPress={handleShowToast} style={styles.toastButton}>
          <Text style={styles.toastText}>토스트 테스트 버튼</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 토스트 팝업 */}
      {showToast && (
        <ToastPopup
          message="테스트 테스트"
          onClose={() => setShowToast(false)}
        />
      )}
    </View>
  );
};

export default MyPageScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#EFF7FF',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingTop: width * 0.04,
    minHeight: height * 1,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toastButton: {
    backgroundColor: '#4444ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 30,
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
