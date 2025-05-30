import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const BookMiniHeaderBlock = ({ imageUrl, title, authors }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
      <View style={styles.textBox}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.author} numberOfLines={1}>{authors}</Text>
      </View>
    </View>
  );
};

export default BookMiniHeaderBlock;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: fixwidth * 0.04,
    padding: fixwidth * 0.03,
    backgroundColor: '#fffaf1',
    borderColor: '#f3e4c9',
    borderWidth: fixwidth * 0.001,
    borderRadius: fixwidth * 0.03,
  },
  thumbnail: {
    width: fixwidth * 0.14,
    height: fixwidth * 0.2,
    borderRadius: fixwidth * 0.01,
    backgroundColor: '#ccc',
  },
  textBox: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: fixwidth * 0.037,
    fontFamily: 'NotoSansKR-SemiBold',
    lineHeight: fixwidth * 0.055,
    color: '#333',
  },
  author: {
    marginTop: fixwidth * 0.03,
    fontSize: fixwidth * 0.035,
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: fixwidth * 0.06,
    color: '#777',
  },
});
