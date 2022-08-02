import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

const NOTESKEY = "@notes";
const FIRSTVISITKEY = "@firstLaunch";
const LANGUAGESKEY = "@langs";
const SETTINGSKEY = "@settings";

export const firstLaunch = async () => {
  try {
    const alreadyLaunch = await AsyncStorage.getItem(FIRSTVISITKEY);
    if (!alreadyLaunch) {
      await Promise.all([
        AsyncStorage.setItem(FIRSTVISITKEY, "true"), 
        AsyncStorage.setItem(NOTESKEY, JSON.stringify([])), 
        AsyncStorage.setItem(LANGUAGESKEY, JSON.stringify(["en"])), 
        AsyncStorage.setItem(
          SETTINGSKEY,
          JSON.stringify({
            userID: makeid(11),
            isFullAppAvailable: true,
            darkMode: Appearance.getColorScheme() === "dark",
          })
        );
      ]);
    }
  } catch (e) {
    console.log(e);
  }
};

export const getAllData = async () => {
  try {
    const notes = await getNotes();
    const keys = notes.map((note) => note.id);
    const values = await AsyncStorage.multiGet(keys);

    values.map((value, i) => {
      if (value[0] == notes[i].id) {
        notes[i].content = value[1];
      }
    });

    return notes;
  } catch (e) {
    console.log(e);
  }
};

export const getNotes = async () => {
  try {
    const value = await AsyncStorage.getItem(NOTESKEY);
    if (value !== null) {
      return JSON.parse(value);
    } else {
      return [];
    }
  } catch (e) {
    console.log(e);
  }
};

export const createNewNote = async () => {
  try {
    let list = await getNotes();

    let note = {
      title: "",
      content: "",
      id: makeid(5),
      createAt: Date.now(),
      lastModified: Date.now(),
      lang: "en", // TODO: Add option to set a new default language
    };

    if (list.length > 0) {
      list.push(note);
    } else {
      list = [note];
    }

    const jsonValue = JSON.stringify(list);
    await AsyncStorage.setItem(NOTESKEY, jsonValue);

    return note;
  } catch (e) {
    console.log(e);
  }
};

export const deleteNote = async (id, notes) => {
  try {
    const newState = notes.filter((item) => item.id !== id);
    const jsonValue = JSON.stringify(newState);
    await AsyncStorage.setItem(NOTESKEY, jsonValue);
    await AsyncStorage.removeItem(id);
  } catch (e) {
    console.log(e);
  }
};

// ------------------
// Content
// ------------------
export const updateTitle = async (id, content) => {
  if (content) {
    try {
      const list = await getNotes();
      const index = list.findIndex((item) => item.id === id);

      if (index !== -1) {
        list[index].title = content;
        const jsonValue = JSON.stringify(list);
        await AsyncStorage.setItem(NOTESKEY, jsonValue);
      }
    } catch (e) {
      console.log(e);
    }
  }
};

export const updateLang = async (id, content) => {
  if (content) {
    try {
      const list = await getNotes();
      const index = list.findIndex((item) => item.id === id);

      if (index !== -1) {
        list[index].lang = content;
        const jsonValue = JSON.stringify(list);
        await AsyncStorage.setItem(NOTESKEY, jsonValue);
      }
    } catch (e) {
      console.log(e);
    }
  }
};

export const getNoteContent = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    } else {
      return "";
    }
  } catch (e) {
    console.log(e);
  }
};

// @key is the id of the note
// @value is a string
export const updateNoteContent = async (key, value) => {
  console.log("Update content");
  // Multiset to update lastmodified
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }
};

// ------------------
// Lang
// ------------------
export const getOfflineLangs = async () => {
  try {
    const value = await AsyncStorage.getItem(LANGUAGESKEY);
    if (value !== null) {
      return JSON.parse(value);
    } else {
      return [];
    }
  } catch (e) {
    console.log(e);
  }
};

export const deleteLang = async (value) => {
  try {
    let langs = await getOfflineLangs();
    const newState = langs.filter((item) => item !== value);
    const jsonValue = JSON.stringify(newState);
    await AsyncStorage.setItem(LANGUAGESKEY, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const addOfflineLang = async (value) => {
  try {
    let langs = await getOfflineLangs();

    langs.push(value);

    const jsonValue = JSON.stringify(langs);
    await AsyncStorage.setItem(LANGUAGESKEY, jsonValue);

    return langs;
  } catch (e) {
    console.log(e);
  }
};

// --------------------
// Settings
// --------------------
export const getSettings = async (value) => {
  try {
    const value = await AsyncStorage.getItem(SETTINGSKEY);
    if (value !== null) {
      return JSON.parse(value);
    } else {
      return {};
    }
  } catch (error) {
    console.log(e);
  }
};

export const updateSettings = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(SETTINGSKEY, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

// --------------------
// Helper
// --------------------
export const clearData = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.log(e);
  }
};

const makeid = (length) => {
  var result = [];
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
};
