import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// FontAwesome 아이콘 관련 import ✨
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const { width } = Dimensions.get('window');

const Header = ({ title = '제목', allChecked, onAllCheck }) => {
  const navigation = useNavigation();

  return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.header}>
          {/* 타이틀 텍스트 */}
          <Text style={styles.title}>{title}</Text>

          {/* ← FontAwesome 아이콘으로 뒤로가기 */}
          <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.backButton}
          >
            <FontAwesomeIcon icon={faChevronLeft} size={width * 0.05} color="#111" />
          </TouchableOpacity>
        </View>
      </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.07,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: width * 0.105,
  },
  backButton: {
    position: 'absolute',
    left: width * 0.057,
    top: width * 0.027,
  },
  title: {
    position: 'absolute',
    top: width * 0.05,
    left: 0,
    right: 0,
    textAlign: 'center',
    transform: [{ translateY: -10 }],
    fontSize: width * 0.0447,
    color: '#111',
    fontFamily: 'NotoSansKR-Medium',
    lineHeight: width * 0.05,

  },
});

export default Header;
