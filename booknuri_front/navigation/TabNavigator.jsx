// navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyLibrarySettingScreen from '../pages/setting/MyLibrarySettingScreen';
import MyPageScreen from '../pages/dummy/MyPageScreen';
import CurvedTabBar from '../components/CurvedTabBar';
import MyShelfStack from './MyShelfStack';
import HomeStack from './HomeStack';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CurvedTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="MyShelfTab" component={MyShelfStack} />
      <Tab.Screen name="MyLibrarySettingScreen" component={MyLibrarySettingScreen} />
      <Tab.Screen name="MyPage" component={MyPageScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
