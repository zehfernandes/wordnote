import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  LayoutAnimation,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { StatusBar } from "expo-status-bar";

import { useTheme } from "@react-navigation/native";
import { AnimationConstants } from "../assets/theme/tokens";

import ListItem from "../components/ListItem";
import HiddenItem from "../components/ListHiddenItem";
import SettingsIcon from "../assets/icons/Settings";
import AddIcon from "../assets/icons/Add";

import { createNewNote, deleteNote } from "../lib/appDB";

export default function Notes({ navigation, globalData, setGlobalData, i18n }) {
  const { colors, dark } = useTheme();
  const [notes, setNotes] = useState(globalData);
  const [enableDelete, setEnableDelete] = useState(false);

  // Effects
  // --------------------
  useEffect(() => {
    setNotes(globalData);
  }, [globalData]);

  // Header customization
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        notes.length > 0 && (
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("Settings");
            }}
          >
            <View style={{ width: 30, height: 30 }}>
              <SettingsIcon width={26} height={26} fill={colors.primary} />
            </View>
          </TouchableWithoutFeedback>
        ),
    });
  }, [navigation, notes]);

  // Functions
  // --------------------
  const newNote = async () => {
    let note = await createNewNote();

    let newState = [...notes];
    newState.push(note);
    LayoutAnimation.configureNext(AnimationConstants);
    setGlobalData(newState);

    navigation.navigate("Editor", note);
  };

  const removeNote = async (rowKey) => {
    let newState = globalData.filter((note) => note.id !== rowKey);

    LayoutAnimation.configureNext(AnimationConstants);
    deleteNote(rowKey, globalData);
    setGlobalData(newState);
  };

  //Events
  //--------------
  const onSwipeStart = () => {
    setEnableDelete(false);
  };

  const onSwipeEnd = () => {
    setEnableDelete(true);
  };

  const onSwipeValueChange = (swipeData) => {
    const { key, value } = swipeData;
    // Use absolute values to work for left or right swipe
    if (Math.abs(value) > 150 && enableDelete === true) {
      removeNote(key);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <StatusBar style={dark ? "light" : "dark"} />

      {/* TODO Onboarding */}
      {notes.length == 0 && (
        <EmptyState
          title={i18n.t("notes.welcome")}
          description={i18n.t("notes.description")}
        />
      )}

      {notes.length > 0 ? (
        <SwipeListView
          useSectionList={true}
          contentContainerStyle={{ paddingBottom: 150 }}
          sections={[
            {
              title: i18n.t("notes.title"),
              data: notes,
            },
          ]}
          renderItem={(data) => {
            const { item } = data;
            return (
              <ListItem
                content={item.content}
                title={item.title}
                createAt={item.createAt}
                press={() => {
                  navigation.navigate("Editor", item);
                }}
              />
            );
          }}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[styles.header, { color: colors.text }]}>{title}</Text>
          )}
          renderHiddenItem={(data, rowMap) => (
            <HiddenItem data={data} rowMap={rowMap} />
          )}
          disableLeftSwipe={Platform.OS === "android"}
          disableRightSwipe={Platform.OS !== "android"}
          leftOpenValue={0}
          previewRowKey={"0"}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          swipeGestureEnded={onSwipeEnd}
          swipeGestureBegan={onSwipeStart}
          onSwipeValueChange={onSwipeValueChange}
        />
      ) : null}

      <View style={styles.centerWrap}>
        <TouchableWithoutFeedback
          onPress={() => {
            newNote();
          }}
        >
          <View
            style={[
              styles.centerButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <AddIcon width={32} height={32} fill="#EFEFEF" />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

function EmptyState({ title, description }) {
  const { colors, dark } = useTheme();

  return (
    <View
      style={{
        position: "absolute",
        bottom: 140,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingHorizontal: 60,
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: colors.text,
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: colors.text,
          textAlign: "center",
          lineHeight: 20,
          opacity: 0.8,
        }}
      >
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    fontSize: 36,
    fontWeight: "bold",
    letterSpacing: -0.5,
  },
  centerWrap: {
    height: 70,
    bottom: 40,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    position: "absolute",
  },
  centerButton: {
    flex: 1,
    width: 70,
    height: 70,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 30,

    elevation: 24,
  },
});
