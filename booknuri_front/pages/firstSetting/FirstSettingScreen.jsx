import React, { useState, useCallback } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import StepProgressHeader from '../../components/public/StepProgressHeader';
import Step01 from '../../components/userSetting/firstsetting/FirstSettingStep01';
import Step02 from '../../components/userSetting/firstsetting/FirstSettingStep02';
import Step03 from '../../components/userSetting/firstsetting/FirstSettingStep03';
import Step04 from '../../components/userSetting/firstsetting/FirstSettingStep04';
import Step05 from '../../components/userSetting/firstsetting/FirstSettingStep05';
import Step06 from '../../components/userSetting/firstsetting/FirstSettingStep06';

const FirstSettingScreen = () => {
  const [step, setStep] = useState(1);

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      return true;
    }
    return false;
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack);
      return () => backHandler.remove();
    }, [step])
  );

  return (
    <View style={styles.container}>
      <StepProgressHeader totalSteps={6} currentStep={step} onBack={handleBack} />

      {step === 1 && <Step01 onNext={() => setStep(2)} />}
      {step === 2 && <Step02 onNext={() => setStep(3)} />}
      {step === 3 && <Step03 onNext={() => setStep(4)} />}
      {step === 4 && <Step04 onNext={() => setStep(5)} />}
      {step === 5 && <Step05 onNext={() => setStep(6)} />}
      {step === 6 && <Step06 />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default FirstSettingScreen;
