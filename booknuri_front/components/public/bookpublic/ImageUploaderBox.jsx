import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width: fixwidth } = Dimensions.get('window');

const ImageUploaderBox = ({ imageCount = 0, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Icon name="add-photo-alternate" size={fixwidth * 0.07} color="#999" />
      <Text style={styles.countText}>
        {imageCount}/<Text style={{ color: '#ccc' }}>3</Text>
      </Text>
    </TouchableOpacity>
  );
};

export default ImageUploaderBox;

const styles = StyleSheet.create({
  container: {
    width: fixwidth * 0.2,
    height: fixwidth * 0.2,
    borderRadius: fixwidth * 0.04,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    gap: fixwidth * 0.01,
  },
  countText: {
    fontSize: fixwidth * 0.03,
    fontFamily: 'NotoSansKR-Medium',
    lineHeight:fixwidth * 0.05,
    color: '#444',
  },
});
