import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');


const Header = ({ title = '제목', allChecked, onAllCheck }) => {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
        <View style={styles.header}>

          {/* 타이틀 텍스트 props로 받아오기! */}
          <Text style={styles.title}>{title}</Text>

          {/* ← 뒤로가기 버튼 */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.backButton}
          >
            <Image
              source={require('../../image/back.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: width * 0.04,
    paddingHorizontal: width * 0.07,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: width * 0.1,
  },
  backButton: {
    position: 'absolute',
    left: width * 0.06,
    top: width * 0.035,
  },
  backIcon: {
    width: width * 0.057,
    height: width * 0.057,
  },
  title: {
    position: 'absolute',
    top: width * 0.05,
    left: 0,
    right: 0,
    textAlign: 'center',
    transform: [{ translateY: -10 }],
    fontSize: width * 0.047,
    fontWeight: 'bold',
    color: '#111',
  },
});

export default Header;
