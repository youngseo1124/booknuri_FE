import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, LayoutAnimation, UIManager, Platform, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // ✅ 아이콘 예쁘게!

const AgreeSection = ({ title, content, checked, onToggle }) => {
  const [expanded, setExpanded] = useState(true); // 기본은 펼침

  // 안드로이드에서도 레이아웃 애니메이션 활성화
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const handleToggleExpand = () => {
    LayoutAnimation.easeInEaseOut();
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      {/*  헤더 영역 (체크 아이콘 + 제목 + 펼침 아이콘) */}
      <TouchableOpacity style={styles.headerRow} onPress={handleToggleExpand}>
        <TouchableOpacity onPress={onToggle}>
          <Icon
            name={checked ? 'checkmark-circle' : 'ellipse-outline'}
            size={width*0.07}
            color={checked ? '#00C471' : '#ccc'}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <Icon
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="#888"
          style={styles.arrowIcon}
        />
      </TouchableOpacity>

      {/* ✅ 내용 박스 (스크롤 가능 + 하얀색 배경 내부 view) */}
      {expanded && (
        <View style={styles.contentWrapper}>
          <ScrollView style={styles.contentScroll}>
            <Text style={styles.contentText}>{content}</Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
};


const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: width * 0.02,
    padding: width * 0.04,
    marginVertical: height * 0.017,
    backgroundColor: '#f3f3f3',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: width * 0.025,
    flex: 1,
    fontWeight: 'bold',
    fontSize: width * 0.04,
    color: '#111',
  },
  arrowIcon: {
    marginLeft: width * 0.015,
  },
  contentWrapper: {
    marginTop: height * 0.015,
    backgroundColor: 'white',
    borderRadius: width * 0.01,
    padding: width * 0.035,
    maxHeight: height * 0.22,
  },
  contentScroll: {
    flexGrow: 0,
  },
  contentText: {
    fontSize: width * 0.027,
    color: '#333',
    lineHeight: width * 0.05,
  },
});

export default AgreeSection;
