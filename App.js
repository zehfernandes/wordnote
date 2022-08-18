import React, { useEffect, useState, useRef, useCallback } from "react";
import { UIManager, Platform, View, Text, Alert } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import i18n from "./lib/i18n";

import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  firstLaunch,
  getAllData,
  getSettings,
  updateSettings,
  clearData,
} from "./lib/appDB.js";
import { DatabaseInit } from "./lib/dictDB.js";

import Editor from "./pages/Editor";
import Notes from "./pages/Notes";
import Languages from "./pages/Languages";
import Settings from "./pages/Settings";
import About from "./pages/About";

import { LightThemeTokens, DarkThemeTokens } from "./assets/theme/tokens";
const Stack = createNativeStackNavigator();

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

//TODO: Move Appereance to AppDB
let MyTheme = generateTheme(false);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const db = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [globalData, setGlobalData] = useState({});
  const [loadedDatabase, setLoadedDatabase] = useState(false);
  const [loaded] = useFonts({
    "iA Writer Duo": require("./assets/fonts/iAWriterDuoS-Regular.ttf"),
    "iA Writer Duo Bold": require("./assets/fonts/iAWriterDuoS-Bold.ttf"),
    "iA Writer Quattro Italic": require("./assets/fonts/iAWriterQuattroS-Italic.ttf"),
    "iA Writer Quattro": require("./assets/fonts/iAWriterQuattroS-Regular.ttf"),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const v = await Promise.all([
          getAllData(),
          getSettings(),
          firstLaunch(),
        ]);

        const data = v[0];
        const settings = v[1];

        db.current = new DatabaseInit();
        await db.current.init();

        setGlobalData(data);
        setLoadedDatabase(true);

        updateTheme(settings.darkMode);

        await SplashScreen.hideAsync();
      } catch (e) {
        console.log(e);
        // Alert.alert(e);
      }
    };

    fetchData();
  }, []);

  // Theme
  const updateTheme = async (newValue) => {
    MyTheme = generateTheme(newValue);

    setIsDarkMode(newValue);

    const settings = await getSettings();
    settings.darkMode = newValue;

    console.log(settings);

    updateSettings(settings);
  };

  if (!loaded || !loadedDatabase) {
    return null;
  }

  const commonProps = {
    globalData,
    setGlobalData,
    i18n,
  };

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Notes"
          options={{
            title: "",
            headerShadowVisible: false,
          }}
        >
          {(props) => <Notes {...props} {...commonProps} />}
        </Stack.Screen>
        <Stack.Screen
          name="Editor"
          options={{
            title: "",
            headerBackTitleVisible: false,
            headerShadowVisible: false,
          }}
        >
          {(props) => (
            <Editor {...props} {...commonProps} langsDB={db.current} />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Settings"
          options={{
            title: i18n.t("settings.title"),
            headerShadowVisible: false,
          }}
        >
          {(props) => (
            <Settings
              {...props}
              isDarkMode={isDarkMode}
              updateTheme={updateTheme}
              {...commonProps}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Settings.languages"
          options={{
            title: i18n.t("languages.title"),
            headerShadowVisible: false,
            presentation: "modal",
          }}
        >
          {(props) => (
            <Languages {...props} {...commonProps} langsDB={db.current} />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Settings.about"
          options={{
            title: i18n.t("about.title"),
            headerShadowVisible: false,
            presentation: "modal",
          }}
        >
          {(props) => <About {...props} {...commonProps} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// -----------------
// Helpers
// -----------------
function generateTheme(dark) {
  const theme = dark ? DarkThemeTokens : LightThemeTokens;
  const colorSpread = dark ? DarkTheme : DefaultTheme;

  const MyTheme = {
    ...colorSpread,
    colors: {
      ...colorSpread.colors,
      primary: theme.primary,
      card: theme.surface0,
      background: theme.surface0,
      backgroundLevel2: theme.surface1,
    },
  };

  return MyTheme;
}
