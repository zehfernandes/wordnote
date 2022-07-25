import { useTheme } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Meaning({ number, content }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.type, styles.count, { color: colors.text }]}>
        {number}.
      </Text>
      <Text style={[styles.type, { color: colors.text }]}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    flex: 1,
    flexDirection: "row",
  },
  count: {
    width: "7%",
    paddingTop: 1,
  },
  type: {
    width: "93%",
    fontFamily: "iA Writer Quattro",
    fontWeight: "400",
    lineHeight: 18,
    fontSize: 14,
    letterSpacing: -0.02,
    color: "#000000",
  },
});
