import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
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

const CurvedTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  const tabIcons = {
    HomeScreen: { label: '홈', icon: faBook },
    Recommend: { label: '추천', icon: faComments },
    MyLibrarySettingScreen: { label: '도서관', icon: faBuilding },
    MyPage: { label: '마이페이지', icon: faUser },
  };

  const leftTabs = ['HomeScreen', 'Recommend'];
  const rightTabs = ['MyLibrarySettingScreen', 'MyPage'];

  return (
    <View
      style={{
        flexDirection: 'row',
        height: fixwidth * 0.3,
        backgroundColor: '#fff',
        paddingBottom: insets.bottom,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 8,
      }}
    >
      {/* 🔘 중앙 버튼 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ScanScreen')}
      >
        <FontAwesomeIcon icon={faBarcode} size={fixwidth * 0.07} color="#fff" />
      </TouchableOpacity>

      {/* 🔲 좌측 탭 */}
      <View style={styles.tabGroup}>
        {leftTabs.map((routeName) => {
          const index = state.routes.findIndex((r) => r.name === routeName);
          const isFocused = state.index === index;
          const tabInfo = tabIcons[routeName];

          return (
            <TouchableOpacity
              key={routeName}
              onPress={() => navigation.navigate(routeName)}
              style={styles.tabBtn}
            >
              <FontAwesomeIcon
                icon={tabInfo.icon}
                size={fixwidth * 0.06}
                color={isFocused ? '#4B4B4B' : '#C9C9C9'}
              />
              <Text style={[styles.label, isFocused && styles.activeLabel]}>
                {tabInfo.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 🔲 우측 탭 */}
      <View style={styles.tabGroup}>
        {rightTabs.map((routeName) => {
          const index = state.routes.findIndex((r) => r.name === routeName);
          const isFocused = state.index === index;
          const tabInfo = tabIcons[routeName];

          return (
            <TouchableOpacity
              key={routeName}
              onPress={() => navigation.navigate(routeName)}
              style={styles.tabBtn}
            >
              <FontAwesomeIcon
                icon={tabInfo.icon}
                size={fixwidth * 0.06}
                color={isFocused ? '#4B4B4B' : '#C9C9C9'}
              />
              <Text style={[styles.label, isFocused && styles.activeLabel]}>
                {tabInfo.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabGroup: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
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
    top: -fixwidth * 0.09,
    left: fixwidth / 2 - fixwidth * 0.09,
    width: fixwidth * 0.18,
    height: fixwidth * 0.18,
    borderRadius: fixwidth * 0.09,
    backgroundColor: '#b0957d',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    zIndex: 10,
  },
});

export default CurvedTabBar;
