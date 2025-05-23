import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

// 디자인용 fixwidth (고정값 기반 스타일 계산)
import { Dimensions } from 'react-native';
const { width: fixwidth } = Dimensions.get('window');

const StepProgressHeader = ({ totalSteps, currentStep, onBack }) => {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();
    const progressWidth = width * 0.5 * (currentStep / totalSteps);

    return (
      <>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
              <View style={styles.headerContainer}>
                  <TouchableOpacity
                    onPress={() => {
                        if (onBack) onBack(); // ✅ props 우선
                        else if (navigation.canGoBack()) navigation.goBack(); // fallback
                    }}
                    style={styles.backButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                      <FontAwesomeIcon icon={faChevronLeft} size={fixwidth * 0.05} color="#111" />
                  </TouchableOpacity>

                  <View style={[styles.progressBarBackground, { width: width * 0.5 }]}>
                      <View style={[styles.progressBarFill, { width: progressWidth }]} />
                  </View>
              </View>
          </SafeAreaView>
      </>
    );
};


const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: fixwidth * 0.05,
        paddingBottom: fixwidth * 0.03,
        paddingHorizontal: fixwidth * 0.07,
        backgroundColor: '#fff',
        position: 'relative',
        alignItems: 'center'
    },
    backButton: {
        position: 'absolute',
        left: fixwidth * 0.05,
        top: fixwidth * 0.04,
        zIndex: 10,
        elevation: 10, // 안드로이드용
    },
    progressBarBackground: {
        height: fixwidth * 0.012,
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
