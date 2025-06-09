import React from 'react';
import {
  View, Text, StyleSheet, Modal, Pressable, Switch, useWindowDimensions, Dimensions,
} from 'react-native';

import FixedBottomButton from '../public/publicButton/FixedBottomButton';
import FlatSegmentSelector from '../public/selector/FlatSegmentSelector';
import BottomButton from '../public/publicButton/BottomButton';
import VerticalGap from '../public/publicUtil/VerticalGap';

const statusOptions = [
  { id: null, label: '전체' },
  { id: 'WANT_TO_READ', label: '읽고 싶은 책' },
  { id: 'READING', label: '읽고 있는 책' },
  { id: 'FINISHED', label: '완독한 책' },
];

const { width: fixwidth } = Dimensions.get('window');
const ShelfFilterBottomSheet = ({
                                  visible, onClose, selectedStatus, setSelectedStatus,
                                  lifeBookOnly, setLifeBookOnly, onApply
                                }) => {
  const [tempStatus, setTempStatus] = React.useState(selectedStatus);
  const [tempLifeBookOnly, setTempLifeBookOnly] = React.useState(lifeBookOnly);

  React.useEffect(() => {
    // 모달 열릴 때마다 현재값으로 초기화
    if (visible) {
      setTempStatus(selectedStatus);
      setTempLifeBookOnly(lifeBookOnly);
    }
  }, [visible]);

  const handleApply = () => {
    onApply(tempStatus, tempLifeBookOnly);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={[styles.sheetContainer, { width: fixwidth }]}>
        <Text style={[styles.title, { fontSize: fixwidth * 0.045 }]}>책 필터</Text>

        {/* 상태 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>상태</Text>
          <FlatSegmentSelector
            options={statusOptions}
            selectedId={tempStatus}
            onSelect={setTempStatus}
            width={fixwidth * 0.86}
          />
        </View>

        {/* 인생책 토글 */}
        <View style={styles.section}>
          <View style={styles.lifeBookRow}>
            <Text style={styles.sectionTitle}>인생책만 보기</Text>
            <Switch
              value={tempLifeBookOnly}
              onValueChange={setTempLifeBookOnly}
              trackColor={{ false: '#ccc', true: '#5494e0' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <VerticalGap height={fixwidth * 0.017}/>

        {/* 적용하기 버튼 */}
        <BottomButton label="적용하기" onPress={handleApply} />
      </View>
    </Modal>
  );
};


export default ShelfFilterBottomSheet;



const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  sheetContainer: {
    position: 'absolute',
    bottom: -fixwidth * 0.117,
    width: '100%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: fixwidth * 0.05,
    borderTopRightRadius: fixwidth * 0.05,
    paddingHorizontal: fixwidth*0.027,
    paddingTop: fixwidth * 0.037,
    paddingBottom: fixwidth * 0, // 하단 버튼 공간 확보
  },
  title: {
    fontFamily: 'NotoSansKR-SemiBold',
    fontSize: fixwidth * 0.045,
    textAlign: 'center',
    marginBottom: fixwidth * 0.037,
    color: '#111',
  },
  section: {
    marginBottom: fixwidth * 0.027,
    width: '100%',
  },
  sectionTitle: {
    paddingHorizontal:fixwidth*0.007,
    fontFamily: 'NotoSansKR-Medium',
    fontSize: fixwidth * 0.036,
    color: '#222',
  },
  lifeBookRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: fixwidth * 0.015,
  },
});
