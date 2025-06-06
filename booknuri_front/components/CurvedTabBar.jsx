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
      }
    } else {
      navigation.navigate('ScanScreen');
    }
  };

  const tabOrder = [
    { name: 'HomeTab', icon: faBook, label: '홈' },
    { name: 'Recommend', icon: faComments, label: '추천' },
    null,
    { name: 'MyLibrarySettingScreen', icon: faBuilding, label: '도서관' },
    { name: 'MyPage', icon: faUser, label: '마이페이지' },
  ];

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + fixwidth * 0.02 }]}>
      {/* 중앙 스캔 버튼 */}
      <TouchableOpacity
        activeOpacity={1}
        style={styles.fab}
        onPress={handleScanPress}
      >
        <FontAwesomeIcon icon={faBarcode} size={fixwidth * 0.074} color="#fff" />
      </TouchableOpacity>

      {/* 하단 탭 버튼들 */}
      <View style={styles.tabContainer}>
        {tabOrder.map((tab, index) => {
          if (tab === null) {
            return <View key={`empty-${index}`} style={styles.emptySpace} />;
          }

          const isFocused = state.index >= 0 && state.routes[state.index]?.name === tab.name;


          return (
            <TouchableOpacity
              activeOpacity={1}
              key={tab.name}
              onPress={() => {
                if (tab.name === 'HomeTab') {
                  navigation.navigate('HomeTab', {
                    screen: 'HomeScreen', // ✅ HomeStack 내부로 정확히 이동
                  });
                } else {
                  navigation.navigate(tab.name);
                }
              }}
              style={styles.tabBtn}
            >
              <FontAwesomeIcon
                icon={tab.icon}
                size={fixwidth * 0.065}
                color={isFocused ? '#ffffff' : 'rgba(207,207,207,0.57)'}
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
    backgroundColor: '#7ea4fa',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: fixwidth * 0.022,
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
    fontSize: fixwidth * 0.027,
    color: '#888',
    marginTop: 2,
  },
  activeLabel: {
    color: '#eeeeee',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    top: -fixwidth * 0.06,
    width: fixwidth * 0.17,
    height: fixwidth * 0.15,
    borderRadius: fixwidth * 0.037,
    backgroundColor: '#7ea4fa',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: fixwidth * 0.0147,
    borderColor: '#fafafa',
  },
});

export default CurvedTabBar;
