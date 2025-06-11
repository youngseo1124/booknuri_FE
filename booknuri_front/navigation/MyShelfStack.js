import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import MyShelfScreen from '../pages/shelf/MyShelfScreen';
import ShelfBookDetailSettingScreen from '../pages/shelf/ShelfBookDetailSettingScreen';

const Stack = createNativeStackNavigator();

const MyShelfStack = () => {
  return (
    <>
      {/* ✅ 노치 영역 문제 해결용 */}
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
          }}
        >
          <Stack.Screen name="MyShelfScreen" component={MyShelfScreen} />
          <Stack.Screen name="ShelfBookDetailSettingScreen" component={ShelfBookDetailSettingScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </>
  );
};

export default MyShelfStack;
