import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";

import i18n from "../lib/i18n";

function ListItem({ title, content, createAt, press }) {
  const { colors } = useTheme();

  let words = null;
  if (content) {
    words = content
      .trim()
      .split("\n")
      .filter((t) => t !== "").length;
  }

  return (
    <TouchableWithoutFeedback onPress={press}>
      <View
        style={{
          paddingVertical: 20,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            letterSpacing: -0.3,
            fontWeight: "700",
            marginBottom: 5,
            color: colors.text,
          }}
        >
          {!title ? "Untitled" : title}
        </Text>

        <Text
          style={{
            fontSize: 16,
            opacity: 0.7,
            justifyContent: "space-between",
            flexDirection: "row",
            width: "100%",
            color: colors.text,
          }}
        >
          {words
            ? words > 1
              ? `${words} ${i18n.t("notes.words")}`
              : `${words} ${i18n.t("notes.word")}`
            : i18n.t("notes.empty")}{" "}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default React.forwardRef((props, ref) => (
  <ListItem innerRef={ref} {...props} />
));
