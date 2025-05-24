import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    useWindowDimensions,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

// 📐 고정된 width로 반응형 스타일 계산용
const { width: fixwidth } = Dimensions.get('window');

const StepProgressHeader = ({ totalSteps, currentStep, onBack }) => {
    const { width } = useWindowDimensions(); // 실제 뷰포트 기준 너비
    const navigation = useNavigation();

    const progressPercent = (currentStep / totalSteps) * 100;

    return (
      <>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />

          {/*  SafeArea top 포함 + 절대 상단 고정 */}
          <SafeAreaView edges={['top']} style={styles.safeArea}>
              <View style={styles.headerContainer}>
                  {/*  뒤로가기 버튼 */}
                  <TouchableOpacity
                    onPress={() => {
                        if (onBack) onBack();
                        else if (navigation.canGoBack()) navigation.goBack();
                    }}
                    style={styles.backButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                      <FontAwesomeIcon icon={faChevronLeft} size={fixwidth * 0.05} color="#111" />
                  </TouchableOpacity>

                  {/* 진행 바 */}
                  <View style={[styles.progressBarBackground]}>
                      <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                  </View>
              </View>
          </SafeAreaView>
      </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#fff',
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 999,
        width: '100%',
    },
    headerContainer: {
        width: '100%',
        height: fixwidth * 0.11,
        paddingTop: fixwidth * 0.05,
        paddingBottom: fixwidth * 0.03,
        paddingHorizontal: fixwidth * 0.07,
        backgroundColor: '#fff',
        alignItems: 'center',
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: fixwidth * 0.05,
        top: fixwidth * 0.04,
        zIndex: 10,
        elevation: 10,
    },
    progressBarBackground: {
        height: fixwidth * 0.015,
        width: '57%',
        backgroundColor: '#eee',
        borderRadius: fixwidth * 0.006,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: fixwidth * 0.012,
        backgroundColor: '#444',
        borderRadius: fixwidth * 0.006,
    },
});

export default StepProgressHeader;
