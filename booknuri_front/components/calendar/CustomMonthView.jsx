import React, { useCallback, memo } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

const getDaysInMonth = (monthStr) => {
  const [year, month] = monthStr.split('-').map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const days = [];

  for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({ day: d, dateStr });
  }
  return days;
};

const DayCell = memo(({ item, selectedDate, onPress, cellSize, fontSmall, thumbnail }) => {
  const isSelected = item.dateStr === selectedDate;

  return (
    <Pressable
      onPress={() => onPress(item.dateStr)}
      style={{
        width: cellSize,
        height: cellSize * 1.79,
        alignItems: 'center',
        paddingTop: cellSize * 0.077,
        borderWidth: cellSize * 0.03,
        borderColor: isSelected ? '#5c9de9' : 'rgba(255,255,255,0)',
        borderRadius: cellSize * 0.037,
      }}
    >
      <Text
        style={{
          fontSize: fontSmall,
          lineHeight: fontSmall,
          fontFamily: 'NotoSansKR-Regular',
          textAlign: 'center',
          marginBottom: fontSmall * 0.3,
        }}
      >
        {item.day}
      </Text>

      {thumbnail?.imageUrl && (
        <Image
          source={{ uri: thumbnail.imageUrl }}
          style={{
            width: cellSize * 0.87,
            height: cellSize * 1.33,
            resizeMode: 'cover',
            borderColor: 'rgba(0,0,0,0.70)',
            borderWidth: cellSize * 0.01,
            borderRadius: cellSize * 0.02,
          }}
        />
      )}
    </Pressable>
  );
});

const CustomMonthView = ({
                           month,
                           selectedDate,
                           onSelectDate,
                           parentWidth,
                           thumbnailMap = {},
                         }) => {
  const horizontalPadding = parentWidth * 0.013;
  const contentWidth = parentWidth - horizontalPadding * 2;

  const days = getDaysInMonth(month);
  const cellSize = contentWidth / 7;
  const fontSmall = parentWidth * 0.0297;
  const [year, monthNum] = month.split('-');
  const displayMonth = `${parseInt(monthNum)}월`;

  const handlePressDate = useCallback((dateStr) => {
    onSelectDate(dateStr);
  }, [onSelectDate]);

  return (
    <View
      style={{
        width: parentWidth,
        paddingHorizontal: horizontalPadding,
        paddingVertical: parentWidth * 0.025,
      }}
    >
      <View style={{ alignItems: 'center', marginBottom: parentWidth * 0.03 }}>
        <Text
          style={{
            fontSize: parentWidth * 0.036,
            fontFamily: 'NotoSansKR-Regular',
            lineHeight: parentWidth * 0.048,
            color: '#555',
            marginBottom: parentWidth * 0.005,
          }}
        >
          {year}
        </Text>
        <Text
          style={{
            fontSize: parentWidth * 0.053,
            fontFamily: 'NotoSansKR-SemiBold',
            lineHeight: parentWidth * 0.06,
            color: '#111',
          }}
        >
          {displayMonth}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          borderBottomWidth: parentWidth * 0.00377,
          borderBottomColor: 'rgba(183,183,183,0.37)',
          marginBottom: parentWidth * 0.017,
        }}
      >
        {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
          <Text
            key={d}
            style={{
              fontFamily: 'NotoSansKR-Regular',
              textAlign: 'center',
              width: cellSize,
              fontSize: fontSmall,
              lineHeight :cellSize*0.5
            }}
          >
            {d}
          </Text>
        ))}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {days.map((item, index) => {
          if (!item) return <View key={index} style={{ width: cellSize, height: cellSize * 1.7 }} />;
          const thumbnail = thumbnailMap[item.dateStr];
          return (
            <DayCell
              key={item.dateStr}
              item={item}
              selectedDate={selectedDate}
              onPress={handlePressDate}
              cellSize={cellSize}
              fontSmall={fontSmall}
              thumbnail={thumbnail}
            />
          );
        })}
      </View>
    </View>
  );
};

export default CustomMonthView;
