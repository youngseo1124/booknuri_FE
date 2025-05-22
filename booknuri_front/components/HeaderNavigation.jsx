import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
    faHome,
    faListAlt,
    faCalendarCheck,
    faBook,
    faBell,
    faCog,
    faEye,
    faChartLine,
} from '@fortawesome/free-solid-svg-icons';

const BottomNavigation = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const tabs = [
        { name: "HomeScreen", label: "시력검사", icon: faEye },
        { name: "VisionResultRecordScreen", label: "검사결과 기록", icon: faListAlt },
        { name: "VisionResultGrapghScreen", label: "시력그래프", icon: faChartLine },
        { name: "SettingScreen", label: "설정", icon: faCog },
    ];

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} // ✅ iOS/Android 설정
        style={styles.keyboardAvoiding}
      >
          <View style={styles.bottomTab}>
              {tabs.map((tab, index) => {
                  const isActive = route.name === tab.name;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.tabButton, isActive && styles.activeTab]}
                      onPress={() => navigation.navigate(tab.name)}
                    >
                        <FontAwesomeIcon icon={tab.icon} size={width * 0.074} color={isActive ? "#4B4B4B" : "#C9C9C9"} />
                        <Text style={[styles.tabLabel, isActive && styles.activeLabel]}>{tab.label}</Text>
                    </TouchableOpacity>
                  );
              })}
          </View>
      </KeyboardAvoidingView>
    );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    keyboardAvoiding: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        paddingBottom: width * 0.11,
    },
    bottomTab: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#ffffff",
        height: width*0.2,
        borderTopColor: "#ffffff",
        width: "100%",
        borderTopWidth: 1,
        borderColor: "#0c0c0c",
    },
    tabButton: {
        alignItems: "center",
        flex: 1,
    },
    tabLabel: {
        fontSize: width * 0.037,
        color: "#888",
    },
    activeLabel: {
        color: "#4B4B4B",
        fontWeight: "bold",
    },
});

export default BottomNavigation;
