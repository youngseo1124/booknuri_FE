import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const PaginationBar = ({ page, totalPages, onPageChange }) => {
  const visiblePages = 5;
  const currentGroup = Math.floor((page - 1) / visiblePages);
  const startPage = currentGroup * visiblePages + 1;
  const endPage = Math.min(startPage + visiblePages - 1, totalPages);

  return (
    <View style={styles.container}>
      {/* 이전 페이지 그룹 */}
      {startPage > 1 && (
        <TouchableOpacity onPress={() => onPageChange(startPage - 1)}>
          <Text style={styles.pageBtn}>{'<'}</Text>
        </TouchableOpacity>
      )}

      {/* 현재 페이지 그룹 */}
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(p => (
        <TouchableOpacity key={p} onPress={() => onPageChange(p)}>
          <Text style={[styles.pageBtn, page === p && styles.activePage]}>{p}</Text>
        </TouchableOpacity>
      ))}

      {/* 다음 페이지 그룹 */}
      {endPage < totalPages && (
        <TouchableOpacity onPress={() => onPageChange(endPage + 1)}>
          <Text style={styles.pageBtn}>{'>'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PaginationBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: fixwidth * 0.03,
    gap: fixwidth * 0.025,
  },
  pageBtn: {
    fontSize: fixwidth * 0.038,
    color: '#999',
    fontFamily: 'NotoSansKR-Regular',
  },
  activePage: {
    color: '#000',
    fontWeight: 'bold',
  },
});
