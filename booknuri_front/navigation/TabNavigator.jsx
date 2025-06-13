
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyLibrarySettingScreen from '../pages/setting/MyLibrarySettingScreen';
import MyPageScreen from '../pages/mypage/MyPageScreen';
import CurvedTabBar from '../components/CurvedTabBar';
import MyShelfStack from './MyShelfStack';
import HomeStack from './HomeStack';
import MyShelfScreen from '../pages/shelf/MyShelfScreen';
import CalendarScreen from '../pages/calendar/CalendarScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <SafeAreaProvider>
      <Tab.Navigator
  /*      lazy={false} // 모든 탭을 미리 렌더링!*/
        tabBar={(props) => <CurvedTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="HomeTab" component={HomeStack} />
        <Tab.Screen name="MyShelfTab" component={MyShelfScreen} />
        <Tab.Screen name="MyLibrarySettingScreen" component={MyLibrarySettingScreen} />
        <Tab.Screen name="MyPage" component={MyPageScreen} />
        <Tab.Screen name="CalendarScreen" component={CalendarScreen} />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
};

export default TabNavigator;
