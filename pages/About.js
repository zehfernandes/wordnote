import { useTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Linking,
  TouchableWithoutFeedback,
} from "react-native";

export default function About({ i18n }) {
  const { colors, dark } = useTheme();

  return (
    <View
      style={{
        paddingVertical: 20,
        paddingHorizontal: 20,
        flex: 1,
      }}
    >
      <StatusBar style={dark ? "light" : "dark"} />
      <Text style={[styles.credit, { color: colors.text }]}>
        {i18n.t("about.credit")}
      </Text>
      <Text style={[styles.item, { color: colors.text }]}>
        {i18n.t("about.dict")}
        <Text
          style={{ color: colors.primary }}
          onPress={() => {
            Linking.openURL("https://dictionaryapi.dev/");
          }}
        >
          https://dictionaryapi.dev/
        </Text>
        .
      </Text>
      <Text style={[styles.item, { color: colors.text }]}>
        {i18n.t("about.font")}
        <Text
          style={{ color: colors.primary }}
          onPress={() => {
            Linking.openURL("https://ia.net/");
          }}
        >
          https://ia.net/
        </Text>
        .
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  credit: {
    fontSize: 18,
    marginBottom: 24,
    fontWeight: "bold",
  },
  item: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 20,
  },
});
