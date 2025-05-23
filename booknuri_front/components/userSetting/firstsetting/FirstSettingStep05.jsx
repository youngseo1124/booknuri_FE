import React, { useContext, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Dimensions } from 'react-native';
import FixedBottomButton from '../../public/FixedBottomButton';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import {setMyLibrary, userinfo} from '../../../apis/apiFunction';
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
        onNext(); //
      }
    } catch (err) {
      console.error('❌ 도서관 설정 실패', err);
    }
  };

  return (
    <View style={[styles.container, { paddingHorizontal: width * 0.0 }]}>

      <LibraryFilter setSelectedLibrary={setSelectedLibrary} setFilter={setFilter} />
      <LibraryList filter={filter} onSelectLibrary={setSelectedLibrary} selectedLibrary={selectedLibrary} />
      <FixedBottomButton label="완료" onPress={handleSubmit} disabled={!selectedLibrary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' ,paddingVertical: fixwidth * 0.037 },

});

export default Step05;
