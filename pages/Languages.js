import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { View } from "react-native";
import DownloadList from "../components/DownloadList";
import { getOfflineLangs } from "../lib/appDB.js";

import { languages } from "../languages";

export default function LanguagePage({ langsDB, navigation, route, i18n }) {
  const [languageList, setLanguageList] = useState(languages);
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (route.params?.lang) {
      console.log(route.params.lang);
      setActive(route.params.lang);
    }
  }, [route.params?.lang]);

  const changeLanguageAndBackToNote = (code) => {
    console.log("changeLanguageAndBackToNote", code);
    // Close and back to note
    navigation.navigate("Editor", { lang: code, updateFromModal: true });
  };

  // Effects
  // --------------------
  useEffect(() => {
    const updateData = async () => {
      const langs = await getOfflineLangs();

      languageList.map((lang, i) => {
        if (langs.includes(lang.code)) {
          languageList[i].local = true;
        } else {
          languageList[i].local = false;
        }
      });

      setLanguageList([...languageList]);
    };

    updateData();
  }, []);

  return (
    <View>
      <View
        style={{
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}
      >
        {languageList.map((lang, i) => (
          <DownloadList
            key={lang.code + i}
            changeLanguageAndBackToNote={changeLanguageAndBackToNote}
            langsDB={langsDB}
            active={active == lang.code}
            localizeLabel={i18n.t(`languages.${lang.code}`)}
            {...lang}
          />
        ))}
      </View>
    </View>
  );
}
