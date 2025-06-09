import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyShelfScreen from '../pages/shelf/MyShelfScreen';
import ShelfBookDetailSettingScreen from '../pages/shelf/ShelfBookDetailSettingScreen';

const Stack = createNativeStackNavigator();

const MyShelfStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Screen name="MyShelfScreen" component={MyShelfScreen} />


    </Stack.Navigator>
  );
};

export default MyShelfStack;
