import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import FlatSegmentSelector from '../../public/selector/FlatSegmentSelector';

const { width: fixwidth } = Dimensions.get('window');

const MyHistoryTabPage = () => {
  const [selectedTab, setSelectedTab] = useState('quote');

  const TAB_OPTIONS = [
    { id: 'quote', label: '인용' },
    { id: 'reflection', label: '독후감' },
    { id: 'review', label: '리뷰' },
  ];

  const renderSelectedTab = () => {
 /*   if (selectedTab === 'quote') return <MyGroupedQuotesList />;
    if (selectedTab === 'reflection') return <MyGroupedReflectionsList />;
    if (selectedTab === 'review') return <MyGroupedReviewsList />;*/
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatSegmentSelector
        options={TAB_OPTIONS}
        selectedId={selectedTab}
        onSelect={setSelectedTab}
      />
      <View style={styles.contentWrapper}>{renderSelectedTab()}</View>
    </View>
  );
};

export default MyHistoryTabPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: fixwidth * 0.05,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: fixwidth * 0.04,
    paddingTop: fixwidth * 0.03,
  },
});
