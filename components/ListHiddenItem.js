import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";

import TrashIcon from "../assets/icons/Trash";

function HiddenItem({ rowMap, data }) {
  return (
    <View style={styles.rowBack}>
      <TrashIcon fill="#fff" width={18} height={18} />
      <TrashIcon fill="#fff" width={18} height={18} />
    </View>
  );
}

export default React.forwardRef((props, ref) => (
  <HiddenItem innerRef={ref} {...props} />
));

const styles = StyleSheet.create({
  rowBack: {
    alignItems: "center",
    backgroundColor: "rgb(236,94,65)",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: "blue",
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0,
  },
});
