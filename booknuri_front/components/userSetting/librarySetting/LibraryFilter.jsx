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

const LibraryFilter = ({ setFilter, defaultSi = '', defaultGu = '', defaultKeyword = '' }) => {
  const [regions, setRegions] = useState([]);
  const [selectedSi, setSelectedSi] = useState(defaultSi);
  const [selectedGu, setSelectedGu] = useState(defaultGu);
  const [keyword, setKeyword] = useState(defaultKeyword);

  useEffect(() => {
    console.log('🟡 기본값 반영됨:', { defaultSi, defaultGu, defaultKeyword });
    setSelectedSi(defaultSi);
    setSelectedGu(defaultGu);
    setKeyword(defaultKeyword);
  }, [defaultSi, defaultGu, defaultKeyword]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await getRegionList();
        const data = res.data;
        setRegions(Array.isArray(data) ? data : []);
      } catch (err) {
        setRegions([]);
      }
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    console.log('🔁 필터 변경됨:', { selectedSi, selectedGu, keyword });
    setFilter({ si: selectedSi, gu: selectedGu, keyword });
  }, [selectedSi, selectedGu, keyword]);

  const siList = [...new Set((regions || []).map((r) => r.si))];
  const guList = (regions || []).filter((r) => r.si === selectedSi).map((r) => r.gu);

  return (
    <View style={styles.filterContainer}>
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

export default LibraryFilter;

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
