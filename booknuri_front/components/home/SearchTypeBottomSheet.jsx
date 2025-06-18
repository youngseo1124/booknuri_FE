// components/search/SearchTypeBottomSheet.jsx
import React from 'react';
import {
  View, Text, StyleSheet, Modal, Pressable, Dimensions,
} from 'react-native';
import FlatSegmentSelector from '../public/selector/FlatSegmentSelector';
import BottomButton from '../public/publicButton/BottomButton';

const { width: fixwidth } = Dimensions.get('window');

const searchTargetOptions = [
  { id: 'bookname', label: '책 제목으로 검색' },
  { id: 'authors', label: '저자 이름으로 검색' },
];

const SearchTypeBottomSheet = ({ visible, onClose, selectedType, setSelectedType }) => {
  const [tempType, setTempType] = React.useState(selectedType);

  React.useEffect(() => {
    if (visible) setTempType(selectedType);
  }, [visible]);

  const handleApply = () => {
    setSelectedType(tempType);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.sheetContainer}>
        <Text style={styles.title}>검색 기준 선택</Text>

        <View style={styles.section}>
          <FlatSegmentSelector
            options={searchTargetOptions}
            selectedId={tempType}
            onSelect={setTempType}
            width={fixwidth * 0.86}
          />
        </View>

        <BottomButton label="적용하기" onPress={handleApply} />
      </View>
    </Modal>
  );
};

export default SearchTypeBottomSheet;

const styles = StyleSheet.create({
  overlay: { flex: 1 },
  sheetContainer: {
    position: 'absolute',
    bottom: -fixwidth * 0.117,
    width: '100%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: fixwidth * 0.05,
    borderTopRightRadius: fixwidth * 0.05,
    paddingHorizontal: fixwidth * 0.027,
    paddingTop: fixwidth * 0.037,
  },
  title: {
    fontFamily: 'NotoSansKR-SemiBold',
    fontSize: fixwidth * 0.045,
    textAlign: 'center',
    marginBottom: fixwidth * 0.037,
    color: '#111',
  },
  section: {
    marginBottom: fixwidth * 0.07,
    width: '100%',
  },
});
