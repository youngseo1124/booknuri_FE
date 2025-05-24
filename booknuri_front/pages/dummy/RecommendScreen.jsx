import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecommendScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📚 추천 페이지 (더미)</Text>
    </View>
  );
};

export default RecommendScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDF6EC' },
  text: { fontSize: 18 },
});
