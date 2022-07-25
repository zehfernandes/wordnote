import { useTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableWithoutFeedback,
} from "react-native";

import Chevron from "../assets/icons/Chevron";

export default function Settings({
  navigation,
  isDarkMode,
  updateTheme,
  i18n,
}) {
  const { colors, dark } = useTheme();

  const _handleDarkModePress = async () => {
    updateTheme(!isDarkMode);
  };

  const _handleDictionaryPress = () => {
    navigation.navigate("Settings.languages");
  };

  const _handleAboutPress = () => {
    navigation.navigate("Settings.about");
  };

  return (
    <View
      style={{
        paddingVertical: 20,
        paddingHorizontal: 20,
        flex: 1,
      }}
    >
      <StatusBar style={dark ? "light" : "dark"} />

      <View style={[styles.listItem, { borderBottomColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>
          {i18n.t("settings.mode")}
        </Text>
        <View style={styles.rightSide}>
          <Switch
            value={isDarkMode}
            onValueChange={_handleDarkModePress}
            trackColor={{ true: colors.primary }}
          />
        </View>
      </View>

      <TouchableWithoutFeedback onPress={_handleDictionaryPress}>
        <View style={[styles.listItem, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.text }]}>
            {i18n.t("settings.dict")}
          </Text>
          <View style={styles.rightSide}>
            <Chevron width={20} height={20} fill={colors.text} />
          </View>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={_handleAboutPress}>
        <View style={[styles.listItem, { borderBottomWidth: 0 }]}>
          <Text style={[styles.label, { color: colors.text }]}>
            {i18n.t("settings.about")}
          </Text>
          <View style={styles.rightSide}>
            <Chevron width={20} height={20} fill={colors.text} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  rightSide: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
  },
  banner: {
    margin: 20,
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
});
