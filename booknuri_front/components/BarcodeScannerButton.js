import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Image, Text, StyleSheet as RNStyleSheet } from "react-native";
import { getProductInfoWithComment } from "../apis/apiFunction";

const BarcodeScannerButton = ({ onScanned, setLoading }) => {
  const [isScannerVisible, setIsScannerVisible] = useState(false);

  // ✅ 바코드 스캔 후 호출 함수
  const handleScan = async (barcode) => {
    try {
      setLoading(true); // 로딩 시작
      const response = await getProductInfoWithComment(barcode); // 🔍 API 요청
      const data = response.data;
      console.log("✅ 분석 성공! 데이터:", data);
      onScanned(data, barcode); // 부모 컴포넌트로 전달
    } catch (error) {
      console.error("❌ 분석 실패:", error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <>
      {/* ✅ 바코드 스캔 버튼 */}
      <TouchableOpacity
        style={styles.qrButton}
        onPress={() => setIsScannerVisible(true)}
      >
        <Image
          source={require("../image/barcord_sf.png")}
          style={styles.qrImage}
        />
      </TouchableOpacity>

      {/* ✅ 바코드 스캐너 */}
      {isScannerVisible && (
        <View style={RNStyleSheet.absoluteFill}>

        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  qrButton: {
    borderColor: "#ffffff",
    borderWidth: 3,
    width: 97,
    height: 97,
    position: "absolute",
    bottom: 87,
    right: 27,
    backgroundColor: "#387EF5",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  qrImage: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  cameraText: {
    color: "white",
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default BarcodeScannerButton;
