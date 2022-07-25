import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function PartOfSpeech({ type, phonetics }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.type, { color: colors.text }]}>{type}</Text>
      {phonetics && phonetics.length > 0 ? (
        <View style={{ marginLeft: 10, flexDirection: "row" }}>
          <Text style={[styles.type, styles.phone, { color: colors.text }]}>
            [ {phonetics[0].text} ]
          </Text>
          {/* <TouchableWithoutFeedback>
            <AudioIcon style={{ marginTop: 2 }} />
          </TouchableWithoutFeedback> */}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginBottom: 25,
    flexDirection: "row",
  },
  type: {
    fontFamily: "iA Writer Quattro Italic",
    fontStyle: "italic",
    fontWeight: "400",
    fontSize: 14,
    letterSpacing: -0.02,
    color: "#000000",
  },
  phone: {
    fontFamily: "iA Writer Quattro",
    marginRight: 5,
  },
});
