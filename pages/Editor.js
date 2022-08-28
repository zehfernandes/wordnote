import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
} from "react-native";

import { useWindowDimensions, KeyboardAvoidingView } from "react-native";
import { useKeepAwake } from "expo-keep-awake";
import { useTheme, CommonActions } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useKeyboard } from "@react-native-community/hooks";

import PartOfSpeech from "../components/PartOfSpeech";
import Meaning from "../components/Meaning";
import BookIcon from "../assets/icons/Book";
import LanguageIcon from "../assets/icons/Language";
import ExportIcon from "../assets/icons/Export";

import {
  getNoteContent,
  updateNoteContent,
  updateTitle,
  updateLang,
} from "../lib/appDB";

export default function Editor({
  navigation,
  route,
  langsDB,
  globalData,
  setGlobalData,
  i18n,
}) {
  const scrollParentInput = useRef(null);
  const scrollParentResult = useRef(null);
  const noteInput = useRef(null);
  const noteID = useRef(null);
  const db = useRef(null);

  const defaultTitle = i18n.t("editor.defaultTitle");

  const [result, setResult] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const [cursorPos, setCursorPos] = useState({ start: 0, end: 0 });
  const [title, setTitle] = useState("");

  // Lang
  let langFromNote = globalData.filter((item) => item.id === noteID.current)[0]
    ?.lang;
  const [lang, setLang] = useState(langFromNote ? langFromNote : "en");

  // Hooks
  useKeepAwake();
  const keyboard = useKeyboard();
  const headerHeight = useHeaderHeight();
  const windowHeight = useWindowDimensions().height;
  const { colors, dark } = useTheme();

  // --------------------------------------
  // Cycle
  // --------------------------------------
  useEffect(() => {
    if (route.params?.id) {
      noteID.current = route.params.id;
    }

    if (route.params?.title) {
      setTitle(route.params.title);
    }

    const fetchData = async () => {
      let c = await getNoteContent(noteID.current);
      setNoteContent(c);
    };

    fetchData();
  }, [route.params?.id]);

  useEffect(() => {
    if (route.params?.title) {
      setTitle(route.params.title);
    }
  }, [route.params.title]);

  // Save global state in the editor to keep the methods in the same file
  useEffect(() => {
    if (route.params?.lang) {
      console.log("CHANGE DB LANG", route.params.lang);
      db.current = langsDB.getDatabase(route.params.lang);

      setLang(route.params.lang);
    }

    if (route.params?.updateFromModal) {
      console.log("Update from modal");
      updateLang(noteID.current, route.params.lang);
      updateGlobalState();

      noteInput.current.blur();
      setResult(null);
    }
  }, [route.params.lang]);

  // --------------------------------------
  // Header

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback onPress={() => CommonActions.goBack()}>
          <View style={{ width: 30, height: 30 }}>
            <Chevron width={30} height={30} fill={colors.primary} />
          </View>
        </TouchableWithoutFeedback>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            width: 30,
            justifyContent: "space-between",
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("Settings.languages", { lang });
            }}
          >
            <View
              style={{
                width: 30,
                height: 30,
              }}
            >
              <LanguageIcon width={24} height={24} fill={colors.primary} />
            </View>
          </TouchableWithoutFeedback>

          {/* <TouchableWithoutFeedback>
            <View style={{ width: 30, height: 30 }}>
              <ExportIcon width={24} height={24} fill={colors.primary} />
            </View>
          </TouchableWithoutFeedback> */}
        </View>
      ),
    });
  }, [navigation, lang]);

  // --------------------------------------
  // Core Functions
  // --------------------------------------
  function parseResult(c) {
    let obj = JSON.parse(c);

    if (obj._array.length <= 0) {
      setResult(null);
      return;
    }

    let meanings = JSON.parse(obj._array[0].meanings);
    let phonetics = JSON.parse(obj._array[0].phonetics);

    // Sort to noun first than verb
    // TODO: Adapt to other languages
    meanings.sort((a, b) => a.partOfSpeech.localeCompare(b.partOfSpeech));

    return meanings.map((o, i) => {
      return (
        <View key={obj._array[0].word + i}>
          <PartOfSpeech
            key={o.partOfSpeech + i}
            type={o.partOfSpeech}
            phonetics={phonetics}
          />

          {o.definitions.map((m, i2) => {
            return (
              <Meaning
                key={obj._array[0].word + i + i2}
                number={i2 + 1}
                content={m.definition}
              />
            );
          })}
        </View>
      );
    });
  }

  // Find a way to do it more smoothly, less ifs.
  function getWordPerLine(content, cursor) {
    let word = "";
    for (let pos = 0; pos < content.length; pos++) {
      let crossTheCursor = cursor.end - 1 <= pos;
      word += content[pos];

      // Clean the construction
      if (content[pos] === "\n") {
        if (!crossTheCursor) {
          word = "";
        }
      }

      // Middle of the word
      if (content[pos] === "\n" && crossTheCursor) {
        return word.trim().toLowerCase().replace("- ", "");
      }

      //End of line
      if (content.length === pos + 1) {
        return word.trim().toLowerCase().replace("- ", "");
      }
    }
  }

  // Query DB
  function findWord(word) {
    if (!word) return null;
    if (!db.current) return null;

    let q = word.toLowerCase();
    db.current.transaction((tx) => {
      tx.executeSql(
        `select * from words WHERE word='${q}'`,
        [],
        (_, { rows }) => setResult(JSON.stringify(rows))
      );
    });
  }

  // Events
  // --------------------------
  const onChangeNoteText = (value) => {
    setNoteContent(value);

    let query = getWordPerLine(value, cursorPos);
    findWord(query);
    updateNoteContent(noteID.current, value);

    //TODO: Check performance
    updateGlobalState();
  };

  const onNoteSelectionChage = (event) => {
    let sel = event.nativeEvent.selection;

    setCursorPos(sel);
    let query = getWordPerLine(noteContent, sel);
    findWord(query);
  };

  const onTitleChange = (value) => {
    setTitle(value);
  };

  // Method called at input onblur
  const sendTitleUpdate = () => {
    updateGlobalState();
    updateTitle(noteID.current, title, noteContent);

    noteInput.current.focus();
  };

  const onFocusTitle = () => {
    setResult(null);
  };

  const onFocusNote = () => {
    let query = getWordPerLine(noteContent, cursorPos);
    findWord(query);
  };

  const updateGlobalState = () => {
    const index = globalData.findIndex((item) => item.id === noteID.current);

    if (index !== -1) {
      let newState = [...globalData];
      newState[index].title = title;
      newState[index].content = noteContent;
      newState[index].lastModified = Date.now();

      if (route.params?.lang) {
        newState[index].lang = route.params.lang;
      }

      setGlobalData(newState);
    }
  };

  if (!noteID) {
    return null;
  }

  const noteHeight =
    windowHeight - 165 - keyboard.keyboardHeight - headerHeight;

  return (
    <KeyboardAvoidingView 
      behavior="height"
      style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={dark ? "light" : "dark"} />

      <ScrollView
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="always"
        ref={scrollParentInput}
        style={{
          flex: 2
        }}
        persistentScrollbar={true}
        removeClippedSubviews={true}
      >
        {/* ####### Title ##### */}
        <TextInput
          selectTextOnFocus={false}
          contextMenuHidden={true}
          autoCorrect={false}
          spellCheck={false}
          selectionColor={colors.primary}
          onChangeText={onTitleChange}
          onBlur={sendTitleUpdate}
          onFocus={onFocusTitle}
          placeholder={`# ${defaultTitle}`}
          placeholderTextColor={dark ? "#ffffff40" : "#00000040"}
          style={[styles.input, styles.title, { color: colors.text }]}
          returnKeyType="default"
        >
          <Text>{title}</Text>
        </TextInput>

        {/* ####### Note ##### */}
        <TextInput
          // onScroll={(event) => console.log(event)}
          ref={noteInput}
          style={[
            styles.input,
            {
              color: colors.text,
              minHeight: noteHeight,
              paddingBottom: Platform.OS === "android" ? 200 : 0,
            },
          ]}
          multiline
          scrollEnabled={false}
          //autoFocus={true}
          selectionColor={colors.primary}
          autoCorrect={false}
          autoCapitalize="none"
          selectTextOnFocus={false}
          contextMenuHidden={true}
          spellCheck={false}
          textAlignVertical="top"
          onChangeText={onChangeNoteText}
          onSelectionChange={onNoteSelectionChage}
          onFocus={onFocusNote}
        >
          <Text>{noteContent}</Text>
        </TextInput>
      </ScrollView>

      {/* ####### Result ##### */}
      <ScrollView
        ref={scrollParentResult}
        contentContainerStyle={{ paddingBottom: 30 }}
        persistentScrollbar={true}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="never"
        style={[
          styles.resultContainer,
          {
            backgroundColor: colors.backgroundLevel2,
          },
        ]}
        onContentSizeChange={() => {
          scrollParentResult.current.scrollTo({ x: 0, y: 0, animated: false });
        }}
      >
        {result ? (
          parseResult(result)
        ) : (
          <BookIcon
            style={{
              alignSelf: "center",
              justifySelf: "center",
              marginTop: 150 / 2 - 20,
            }}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    // This is need for android to work the meaning scrollview
    flex: 1,
    flexDirection: "column",
    alignContent: "space-between",
  },
  input: {
    paddingHorizontal: 10,
    fontSize: 18,
    lineHeight: 36,
    fontFamily: "iA Writer Duo",
  },
  title: {
    fontFamily: "iA Writer Duo Bold",
    fontSize: 24,
    height: 42,
    letterSpacing: -0.5,
  },
  resultContainer: {
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    fontFamily: "iA Writer Quattro",
    width: "100%",
    minHeight: 165,
    backgroundColor: "#E6E6E6",
    padding: 16,
    paddingTop: 12,
    flex: 1,
    flexGrow: 1,
  },
});
