import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const JoinLinkComponent = () => {
    const navigation = useNavigation();

    return (
      <View style={styles.container}>
          {/* 회원가입 버튼 → Signup00Screen 으로 이동 */}
          <TouchableOpacity onPress={() => navigation.navigate('Signup00Screen')}>
              <Text style={styles.linkText}>회원가입</Text>
          </TouchableOpacity>

          <Text style={styles.separator}> | </Text>

          {/* 비밀번호 찾기 페이지도 따로 만들 예정이라면 이쪽도 수정 가능 */}
          <TouchableOpacity onPress={() => navigation.navigate('FindPassword')}>
              <Text style={styles.linkText}>비밀번호 찾기</Text>
          </TouchableOpacity>
      </View>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: height * 0.02,
    },
    linkText: {
        fontSize: width * 0.027,
        color: '#000000',
    },
    separator: {
        marginHorizontal: width * 0.03,
        fontSize: width * 0.05,
        color: '#595959',
    },
});

export default JoinLinkComponent;
