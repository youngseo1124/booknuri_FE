import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Header from '../../components/public/Header';
import AgreeSection from '../../components/Login/AgreeSection';
import FixedBottomButton from '../../components/public/FixedBottomButton';
import { useNavigation } from '@react-navigation/native';
import CommonLayout from '../../components/public/CommonLayout';

const { width: fixwidth } = Dimensions.get('window');

const Signup00Screen = () => {
  const [termsChecked, setTermsChecked] = useState(true);
  const [privacyChecked, setPrivacyChecked] = useState(true);

  const allChecked = termsChecked && privacyChecked;
  const navigation = useNavigation();

  const goNext = () => {
    if (!allChecked) return;
    navigation.navigate("Signup01Screen");
  };

  const handleAllCheck = (value) => {
    setTermsChecked(value);
    setPrivacyChecked(value);
  };

  return (
      <CommonLayout> {/* ✅ SafeAreaView + StatusBar 처리됨 */}
        <Header title="이용동의" allChecked={allChecked} onAllCheck={handleAllCheck} />

        <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
        >
          <AgreeSection
              title="이용약관 동의 (필수)"
              checked={termsChecked}
              onToggle={() => setTermsChecked(!termsChecked)}
              content={`제1장 총칙

제1조 (목적)  
본 약관은 ‘책누리’ 앱(이하 ‘서비스’)의 이용조건 및 절차, 이용자와 서비스 제공자 간의 권리·의무·책임사항을 규정함을 목적으로 합니다.

제2조 (약관의 효력 및 변경)  
① 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력을 발생합니다.  
② 서비스는 약관을 수시로 개정할 수 있으며, 변경된 약관은 공지와 동시에 효력을 가집니다.  

제3조 (약관 외 준칙)  
본 약관에 명시되지 않은 사항은 관계 법령 및 상관례에 따릅니다.

제4조 (이용계약의 성립)  
서비스의 회원가입은 이용자가 약관에 동의하고, 가입을 완료함으로써 성립됩니다.  

제5조 (회원정보의 변경)  
회원은 개인정보에 변경사항이 있을 경우 즉시 수정해야 하며, 수정하지 않아 발생한 불이익에 대한 책임은 회원에게 있습니다.

제6조 (서비스의 제공 및 변경)  
서비스는 이용자에게 독서 관리, 도서 추천 등 다양한 기능을 제공합니다. 서비스 내용은 필요에 따라 추가·변경될 수 있습니다.

제7조 (서비스 이용시간)  
서비스는 연중무휴, 1일 24시간 이용할 수 있으나 시스템 점검 등으로 일시 중지될 수 있습니다.

제8조 (회원 탈퇴 및 자격 상실)  
회원은 언제든지 탈퇴할 수 있으며, 운영자는 다음의 경우 회원자격을 제한 또는 박탈할 수 있습니다.  
- 허위 정보 등록  
- 타인의 권리 침해  
- 서비스 운영 방해  

제9조 (책임의 제한)  
서비스 제공자는 천재지변, 시스템 장애 등 불가항력 사유로 인한 손해에 대해 책임지지 않습니다.
`}
          />
          <AgreeSection
              title="개인정보 수집 및 이용 동의 (필수)"
              checked={privacyChecked}
              onToggle={() => setPrivacyChecked(!privacyChecked)}
              content={`1. 수집하는 개인정보 항목  
필수 항목: 이름, 이메일, 닉네임, 로그인 ID  
선택 항목: 관심 장르, 독서 이력

2. 수집 방법  
회원가입 시 이용자가 직접 입력한 정보를 기반으로 수집합니다.  

3. 이용 목적  
- 서비스 제공 및 이용자 인증  
- 개인 맞춤 도서 추천 기능 제공  
- 고객 문의 응대 및 불만 처리  

4. 보유 및 이용기간  
- 회원 탈퇴 시까지 보관 후 즉시 파기  
- 법령에 따라 보존할 필요가 있는 경우 관련 법령에 따름  

5. 개인정보 제공 및 위탁  
책누리는 개인정보를 외부에 제공하거나 위탁하지 않습니다. 단, 추후 서비스 확장에 따라 별도 고지 후 위탁할 수 있습니다.

6. 동의 거부 시 불이익  
이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 수 있으며, 동의하지 않을 경우 회원가입 및 일부 서비스 이용이 제한될 수 있습니다.
`}
          />
        </ScrollView>

        <FixedBottomButton disabled={!allChecked} onPress={goNext} />
      </CommonLayout>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: '5%',
    paddingBottom: fixwidth * 0.2,
  },
});

export default Signup00Screen;
