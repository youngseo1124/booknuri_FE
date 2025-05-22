import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
    faBook,
    faBarcode,
    faUser,
    faBuilding,
    faComments,
} from "@fortawesome/free-solid-svg-icons"; // FontAwesome 6
import { useSafeAreaInsets } from "react-native-safe-area-context"; // 👈 하단 여백 확보용!

const BottomNavigation = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets(); // 👈 하단 여백 확보!

    const tabs = [
        { name: "HomeScreen", label: "홈", icon: faBook },
        { name: "Recommend", label: "추천", icon: faComments },
        { name: "Scan", label: "", icon: faBarcode, isCenter: true },
        { name: "MyLibrarySettingScreen", label: "도서관세팅", icon: faBuilding },
        { name: "MyPage", label: "마이페이지", icon: faUser },
    ];

    return (
      <View style={[styles.wrapper, { paddingBottom: insets.bottom || 8 }]}>
          <View style={styles.bottomTab}>
              {tabs.map((tab, index) => {
                  const isActive = route.name === tab.name;

                  if (tab.isCenter) {
                      return (
                        <TouchableOpacity
                          key={index}
                          style={styles.centerButton}
                          onPress={() => navigation.navigate(tab.name)}
                        >
                            <View style={styles.centerIconWrapper}>
                                <FontAwesomeIcon
                                  icon={tab.icon}
                                  size={width * 0.07}
                                  color="#ffffff"
                                />
                            </View>
                        </TouchableOpacity>
                      );
                  }

                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.tabButton}
                      onPress={() => navigation.navigate(tab.name)}
                    >
                        <FontAwesomeIcon
                          icon={tab.icon}
                          size={width * 0.06}
                          color={isActive ? "#4B4B4B" : "#C9C9C9"}
                        />
                        <Text style={[styles.tabLabel, isActive && styles.activeLabel]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                  );
              })}
          </View>
      </View>
    );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
    },
    bottomTab: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#ffffff",
        height: width * 0.177,
        borderTopWidth: 1,
        borderColor: "#dddddd",
    },
    tabButton: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    tabLabel: {
        fontSize: width * 0.025,
        color: "#888",
    },
    activeLabel: {
        color: "#4B4B4B",
        fontWeight: "bold",
    },
    centerButton: {
        position: "relative",
        zIndex: 1,
    },
    centerIconWrapper: {
        width: width * 0.14,
        height: width * 0.14,
        borderRadius: (width * 0.15) / 2,
        backgroundColor: "#b0957d",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: width * 0.01
    },
});

export default BottomNavigation;
