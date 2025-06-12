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
import MyProfileHeader from '../components/mypage/MyProfileHeader';
import Header from '../components/public/publicHeader/Header';
import HomeHeader from '../components/public/publicHeader/HomeHeader';


const { width: fixwidth } = Dimensions.get("window");
const MyPageScreen = () => {
  const { logout } = useContext(LoginContext);
  const insets = useSafeAreaInsets();
  const [showToast, setShowToast] = useState(false);

  const handleShowToast = () => {
    setShowToast(true);
  };

  return (
    <CommonLayout>
      <HomeHeader title={'마이페이지'} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <MyProfileHeader />


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
    paddingBottom: fixwidth * 0.04,
  }
});
