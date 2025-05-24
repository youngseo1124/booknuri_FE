// navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../pages/HomeScreen';
import RecommendScreen from '../pages/dummy/RecommendScreen';
import ScanScreen from '../pages/dummy/ScanScreen';
import MyLibrarySettingScreen from '../pages/setting/MyLibrarySettingScreen';
import MyPageScreen from '../pages/dummy/MyPageScreen';
import CurvedTabBar from '../components/public/CurvedTabBar';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CurvedTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="Recommend" component={RecommendScreen} />
      <Tab.Screen name="ScanScreen" component={ScanScreen} />
      <Tab.Screen name="MyLibrarySettingScreen" component={MyLibrarySettingScreen} />
      <Tab.Screen name="MyPage" component={MyPageScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
