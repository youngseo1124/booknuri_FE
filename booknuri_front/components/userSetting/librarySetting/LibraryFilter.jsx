import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getRegionList } from '../../../apis/apiFunction';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width: fixwidth } = Dimensions.get('window');

const LibraryFilter = ({ setFilter }) => {
  const { width } = useWindowDimensions();

  const [regions, setRegions] = useState([]);
  const [selectedSi, setSelectedSi] = useState('');
  const [selectedGu, setSelectedGu] = useState('');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await getRegionList();
        const data = res.data;
        if (Array.isArray(data)) setRegions(data);
        else setRegions([]);
      } catch (err) {
        setRegions([]);
      }
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    setFilter({ si: selectedSi, gu: selectedGu, keyword });
  }, [selectedSi, selectedGu, keyword]);

  const siList = [...new Set((regions || []).map((r) => r.si))];
  const guList = (regions || []).filter((r) => r.si === selectedSi).map((r) => r.gu);

  return (
    <View style={styles.filterContainer}>
      {/* 시 선택 */}
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedSi}
          onValueChange={(newSi) => {
            setSelectedSi(newSi);
            setSelectedGu('');
          }}
          style={styles.picker}
          dropdownIconColor="#000"
        >
          <Picker.Item label="지역 선택" value="" />
          {siList.map((si) => (
            <Picker.Item key={si} label={si} value={si} />
          ))}
        </Picker>
      </View>

      {/* 구 선택 */}
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedGu}
          onValueChange={setSelectedGu}
          style={styles.picker}
          dropdownIconColor="#000"
        >
          <Picker.Item label="시군구 선택" value="" />
          {guList.map((gu) => (
            <Picker.Item key={gu} label={gu} value={gu} />
          ))}
        </Picker>
      </View>

      {/* 검색어 입력 */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.input}
          placeholder="도서관명 검색"
          value={keyword}
          onChangeText={setKeyword}
          placeholderTextColor="#888"
        />
        <FontAwesome name="search" size={fixwidth * 0.05} color="#888" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    paddingVertical: fixwidth * 0.027,
    width: '100%',
    alignItems: 'center',
  },
  pickerWrapper: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: fixwidth * 0.02,
    marginBottom: fixwidth * 0.02,
    paddingHorizontal: fixwidth * 0.02,
    backgroundColor: '#fff',
    height: fixwidth * 0.14,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    color: '#000',
    fontSize: fixwidth * 0.04,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginTop: fixwidth * 0.02,
    width: '98%',
    paddingHorizontal: fixwidth * 0.01,
  },
  input: {
    flex: 1,
    fontSize: fixwidth * 0.04,
    paddingVertical: fixwidth * 0.02,
    color: '#000',
  },
});

export default LibraryFilter;
