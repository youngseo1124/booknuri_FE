// MyHistoryTabPage.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyHistoryTabPage = () => {
  return (
    <View style={styles.container}>
      <Text>📘 내 기록 페이지</Text>
    </View>
  );
};

export default MyHistoryTabPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
