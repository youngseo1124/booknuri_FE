import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LoginContext } from '../../contexts/LoginContextProvider';

const { width: fixwidth } = Dimensions.get('window');

const MyProfileHeader = () => {
  const { userInfo } = useContext(LoginContext);

  if (!userInfo) return null;

  return (
    <View style={styles.container}>
      <Image
        source={require('../../image/profile.png')}
        style={styles.profileImage}
      />
      <View style={styles.textBox}>
        <View style={styles.textLine}>
          <Text style={styles.greeting}>
            {userInfo.nickname}님, 반가워요
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MyProfileHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    marginBottom: fixwidth * 0.04,
  /*  backgroundColor: '#f3f3f3',*/
    paddingHorizontal: fixwidth * 0.057,
    paddingVertical: fixwidth * 0.017,

  },
  profileImage: {
    width: fixwidth * 0.22,
    height: fixwidth * 0.22,
    borderRadius: fixwidth * 1,
    marginRight: fixwidth * 0.022,
    borderWidth: fixwidth * 0.0017,
    borderColor: 'rgba(0,0,0,0.37)',
  },
  textBox: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: fixwidth * 0.047,
    fontFamily: 'NotoSansKR-SemiBold',
    color: '#000',
    marginBottom: fixwidth * 0.01,
  },
  subInfo: {
    fontSize: fixwidth * 0.035,
    fontFamily: 'NotoSansKR-Regular',
    color: '#f3f3f3',
  },
});
