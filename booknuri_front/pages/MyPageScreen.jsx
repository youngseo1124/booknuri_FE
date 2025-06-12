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
import { LoginContext } from '../contexts/LoginContextProvider';
import ToastPopup from '../components/public/publicPopup_Alert_etc/ToastPopup';
import CommonLayout from '../components/public/publicUtil/CommonLayout';

const { width, height } = Dimensions.get('window');

const MyPageScreen = () => {
  const { logout } = useContext(LoginContext);
  const insets = useSafeAreaInsets();
  const [showToast, setShowToast] = useState(false);

  const handleShowToast = () => {
    setShowToast(true);
  };

  return (
    <CommonLayout>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.pageTitle}>마이페이지</Text>


      </ScrollView>



    </CommonLayout>
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
