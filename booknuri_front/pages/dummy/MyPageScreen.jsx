import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyPageScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>👤 마이페이지 (더미)</Text>
    </View>
  );
};

export default MyPageScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EFF7FF' },
  text: { fontSize: 18 },
});
