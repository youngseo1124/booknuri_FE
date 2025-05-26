import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faBook,
  faComments,
  faBarcode,
  faBuilding,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: fixwidth } = Dimensions.get('window');

const CurvedTabBar = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();

  const handleScanPress = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: '카메라 권한 요청',
            message: '스캔 기능을 사용하려면 카메라 권한이 필요해요!',
            buttonPositive: '허용',
            buttonNegative: '거부',
          }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        navigation.navigate('ScanScreen');
      } else {
        Alert.alert('📛 권한 거부됨', '카메라 권한이 없으면 스캔을 사용할 수 없어요!');
      }
    } else {
      // iOS는 자동 허용
      navigation.navigate('ScanScreen');
    }
  };

  // 탭 정보 수동 배열
  const tabOrder = [
    { name: 'HomeScreen', icon: faBook, label: '홈' },
    { name: 'Recommend', icon: faComments, label: '추천' },
    null, // 👉 중앙 빈 공간 (스캔 자리)
    { name: 'MyLibrarySettingScreen', icon: faBuilding, label: '도서관' },
    { name: 'MyPage', icon: faUser, label: '마이페이지' },
  ];

  return (
      <View style={[styles.wrapper, { paddingBottom: insets.bottom + fixwidth * 0.02 }]}>
        {/*  중앙 스캔 버튼 */}
        <TouchableOpacity
            activeOpacity={1}
            style={styles.fab}
            onPress={handleScanPress}
        >
          <FontAwesomeIcon icon={faBarcode} size={fixwidth * 0.077} color="#fff" />
        </TouchableOpacity>

        {/* 탭 전체 */}
        <View style={styles.tabContainer}>
          {tabOrder.map((tab, index) => {
            if (tab === null) {
              return <View key={`empty-${index}`} style={styles.emptySpace} />;
            }

            const routeIndex = state.routes.findIndex(r => r.name === tab.name);
            const isFocused = state.index === routeIndex;

            return (
                <TouchableOpacity
                    activeOpacity={1}
                    key={tab.name}
                    onPress={() => navigation.navigate(tab.name)}
                    style={styles.tabBtn}
                >
                  <FontAwesomeIcon
                      icon={tab.icon}
                      size={fixwidth * 0.06}
                      color={isFocused ? '#4B4B4B' : '#C9C9C9'}
                  />
                  <Text style={[styles.label, isFocused && styles.activeLabel]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
            );
          })}
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: fixwidth * 0.05,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: fixwidth * 0.03,
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptySpace: {
    flex: 1,
  },
  label: {
    fontSize: fixwidth * 0.026,
    color: '#888',
    marginTop: 2,
  },
  activeLabel: {
    color: '#4B4B4B',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    top: -fixwidth * 0.067,
    width: fixwidth * 0.21,
    height: fixwidth * 0.21,
    borderRadius: fixwidth * 0.07,
    backgroundColor: '#b0957d',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: fixwidth * 0.022,
    borderColor: '#fff',
  },
});

export default CurvedTabBar;
