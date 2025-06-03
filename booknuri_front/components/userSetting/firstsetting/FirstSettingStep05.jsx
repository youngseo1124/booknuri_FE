import React, { useContext, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Dimensions } from 'react-native';
import FixedBottomButton from '../../public/publicButton/FixedBottomButton';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import { setMyLibrary } from '../../../apis/apiFunction';
import LibraryFilter from '../../userSetting/librarySetting/LibraryFilter';
import LibraryList from '../../userSetting/librarySetting/LibraryList';

const { width: fixwidth } = Dimensions.get('window');

const Step05 = ({ onNext }) => {
  const { width } = useWindowDimensions();
  const { userInfo, setUserInfo } = useContext(LoginContext);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [filter, setFilter] = useState({});

  const handleSubmit = async () => {
    if (!selectedLibrary) return;
    try {
      const res = await setMyLibrary(selectedLibrary.libCode);
      if (res.status === 200) {
        onNext(); // 다음 단계로
      }
    } catch (err) {
      console.error('❌ 도서관 설정 실패', err);
    }
  };

  return (
    <View style={styles.container}>
      {/*  필터 + 리스트 묶고 여백 확보 */}
      <View style={styles.listWrapper}>
        <LibraryFilter setSelectedLibrary={setSelectedLibrary} setFilter={setFilter} />
        <LibraryList
          filter={filter}
          onSelectLibrary={setSelectedLibrary}
          selectedLibrary={selectedLibrary}
        />
      </View>

      {/* 하단 고정 버튼 */}
      <FixedBottomButton
        label="다음"
        onPress={handleSubmit}
        disabled={!selectedLibrary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: fixwidth*0.027,
    alignItems: 'center',
    width: '100%',
  },
  listWrapper: {
    flex: 1,
    paddingBottom: fixwidth * 0.15,
    width: '90%',
  },
});

export default Step05;
