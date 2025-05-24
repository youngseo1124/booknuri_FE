import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScanScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📷 스캔 페이지 (더미)</Text>
    </View>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF6F6' },
  text: { fontSize: 18 },
});
