import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, useWindowDimensions, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getRegionList } from '../../apis/apiFunction';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // 지역 리스트 불러오는 API

// 🧱 스타일 계산용 고정 width
const { width: fixwidth } = Dimensions.get("window");

const LibraryFilter = ({ setFilter }) => {

  const { width } = useWindowDimensions();

  // 📦 시/군구 리스트를 담을 배열 상태
  const [regions, setRegions] = useState([]);
  const [selectedSi, setSelectedSi] = useState('');  // 선택된 시
  const [selectedGu, setSelectedGu] = useState('');  // 선택된 구
  const [keyword, setKeyword] = useState('');        // 검색어 (도서관명)

  // 🔁 컴포넌트 처음 렌더링될 때 지역 리스트 받아오기
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await getRegionList();
        //console.log(" 서버에서 받아온 지역 리스트:", res.data);

        const data = res.data;
        // 배열인지 먼저 확인 후 저장
        if (Array.isArray(data)) {
          setRegions(data);
        } else {
          //console.warn("❗받아온 데이터가 배열이 아님:", data);
          setRegions([]); // 안전하게 빈 배열로
        }
      } catch (err) {
        //console.error("❌ 지역 리스트 불러오기 실패:", err);
        setRegions([]); // 에러 났을 때도 안전하게
      }
    };
    fetchRegions();
  }, []);


  //  시/구/검색어가 바뀔 때마다 필터 값을 상위 컴포넌트로 전달
  useEffect(() => {
    setFilter({ si: selectedSi, gu: selectedGu, keyword });
  }, [selectedSi, selectedGu, keyword]);

  //  중복 제거한 시 목록 추출
  const siList = [...new Set((regions || []).map(r => r.si))]; // 방어적 코딩
  const guList = (regions || []).filter(r => r.si === selectedSi).map(r => r.gu);

  return (
    <View style={[styles.filterContainer]}>
      {/*  시(지역) 선택 드롭다운 */}
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedSi}
          onValueChange={setSelectedSi}
          style={styles.picker}
          dropdownIconColor="#000" // ← 화살표 색 검정으로
          mode="dropdown" // 이거 안 넣으면 적용 안될 수도 있음!
        >

        <Picker.Item label="지역 선택" value="" />
          {siList.map(si => (
            <Picker.Item key={si} label={si} value={si}/>
          ))}
        </Picker>
      </View>

      {/* 구(시군구) 선택 드롭다운 */}
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedGu}
          onValueChange={setSelectedGu}
          style={styles.picker}
          dropdownIconColor="#000"
          mode="dropdown"
        >

        <Picker.Item label="시군구 선택" value="" />
          {guList.map(gu => (
            <Picker.Item key={gu} label={gu} value={gu}  mode="dropdown"  />
          ))}
        </Picker>
      </View>

      {/*  검색어 입력창 */}
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
    paddingVertical: fixwidth * 0.03,
    alignItems: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginTop: fixwidth * 0.02,
    width: fixwidth * 0.88,
    paddingHorizontal: fixwidth * 0.01
  },
  input: {
    flex: 1,
    fontSize: fixwidth * 0.04,
    paddingVertical: fixwidth * 0.02,
    color: '#000',
  },
  pickerWrapper: {
    width: fixwidth * 0.9,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: fixwidth * 0.02,   // 모서리 둥글게
    marginBottom: fixwidth * 0.02,
    paddingHorizontal: fixwidth * 0.02,
    backgroundColor: '#fff',
    height: fixwidth * 0.14,
  },
  picker: {
    color: '#000',
  }

});

export default LibraryFilter;
