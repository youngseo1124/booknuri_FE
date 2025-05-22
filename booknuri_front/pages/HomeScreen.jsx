import React, { useState, useRef, useEffect,useContext } from "react";
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ScrollView, SafeAreaView, Image, FlatList } from 'react-native';
import BottomNavigation from "../components/public/BottomNavigation";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const { width,height} = Dimensions.get("window");
import { LoginContext } from "../contexts/LoginContextProvider";



const HomeScreen = ({ navigation }) => {

    const { logout } = useContext(LoginContext);

    const insets = useSafeAreaInsets();


    return (
      <View style={[styles.safeContainer, { paddingTop: insets.top, backgroundColor: "#000000" }]}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>


              <TouchableOpacity
                onPress={logout}
                style={{
                    backgroundColor: "#ff4444",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    marginTop: 20,
                }}
              >
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                       로그아웃 하기
                  </Text>
              </TouchableOpacity>


          </ScrollView>

          {/* ✅ 하단 네비게이션 */}
          <BottomNavigation />
      </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        alignItems: "center",
        paddingTop: width * 0.04,
        backgroundColor:"#faf5f2",
        minHeight:height*1
    },

    bannerContainer: {
        width: width * 0.9,
        height: width * 0.4,
        alignItems: "center",
        justifyContent: "center",
        margin:width * 0.07
    },
    bannerImage: {
        width: width * 0.9,
        height: width * 0.35,
        resizeMode: "contain",
        borderRadius: width * 0.01,
        borderWidth: width * 0.003,
        borderColor: "rgba(0,0,0,0.11)",
        shadowColor: "#0e0e0e",
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 7,
        elevation: 9,
    },
    indicatorContainer: {
        flexDirection: "row",
        position: "absolute",
        bottom: 5,
    },
    indicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 4,
    },
    testButtonImage: {
        borderWidth: width * 0.002,
        borderColor: "rgba(0,0,0,0.73)",
        width: width * 0.9,
        height: width * 0.333,
        marginBottom: 40,
        borderRadius: width * 0.06,
        shadowColor: "#0e0e0e",
        shadowOffset: { width: 5, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 6,
    },
});

export default HomeScreen;
