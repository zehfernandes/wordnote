import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import CheckIcon from "../assets/icons/Check";
import DonwloadIcon from "../assets/icons/Download";
import PauseIcon from "../assets/icons/Pause";

import { useTheme } from "@react-navigation/native";

import * as FileSystem from "expo-file-system";
import { addOfflineLang } from "../lib/appDB";

export default function DownloadList({
  flag,
  label,
  localizeLabel,
  local,
  active,

  // From Obj
  url,
  code,

  // Parent Methods
  changeLanguageAndBackToNote,
  langsDB,
}) {
  const { colors } = useTheme();
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [offline, setOffline] = useState(local);
  const isMounted = useRef(null);

  function calculateProgress(downloadProgress) {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;

    if (isMounted.current) {
      setProgress(progress * 100);
    }
  }

  const startDownload = async () => {
    setDownloading(true);
    downloadFile(
      url,
      `dict_${code}`,
      () => {
        langsDB.addNewDatabase(code, `dict_${code}.db`);
        addOfflineLang(code);
        setOffline(true);
        setDownloading(false);
      },
      calculateProgress
    );
  };

  const _handleLanguagePress = () => {
    console.log("Language pressed");
    // If come from the notes page
    if (offline) {
      //TODO: Check if the file is downloaded if not remove from available languages
      changeLanguageAndBackToNote(code);
      return;
    }

    // Pause download, store data where?
    // if (downloading) {
    //   downloadResumable.pauseAsync();
    //   return;
    // }

    startDownload();
  };

  // Effects
  // --------------------
  useEffect(() => {
    setOffline(local);
  }, [local]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <TouchableOpacity onPress={_handleLanguagePress}>
      <View style={[styles.downloadItem, { borderBottomColor: colors.border }]}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Image
            source={flag}
            style={{
              width: 40 * 1.2,
              height: 35 * 1.2,
              marginTop: 8,
              marginRight: 5,
            }}
          />
          <View style={styles.textContainer}>
            <Text
              style={{
                fontSize: 18,
                marginBottom: 5,
                color: colors.text,
              }}
            >
              {localizeLabel}
            </Text>
            {offline && (
              <View
                style={[
                  styles.downloadedCircle,
                  { backgroundColor: colors.primary },
                ]}
              ></View>
            )}
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          {offline
            ? localView(active, colors)
            : downloadView(downloading, progress, colors)}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function downloadView(downloading, progress, colors) {
  if (downloading) {
    return (
      <View>
        <AnimatedCircularProgress
          size={40}
          width={2}
          fill={progress}
          tintColor={colors.primary}
          backgroundColor={colors.border}
          rotation={-360}
          children={(fill) => (
            <PauseIcon width={24} height={24} fill={colors.text} />
          )}
        />
      </View>
    );
  } else {
    return <DonwloadIcon width={24} height={24} fill={colors.text} />;
  }
}

function localView(active, colors) {
  if (active) {
    return (
      <View>
        <CheckIcon width={24} height={24} fill={colors.text} />
      </View>
    );
  } else {
    return <View></View>;
  }
}

const styles = StyleSheet.create({
  downloadedCircle: {
    width: 6,
    height: 6,
    borderRadius: 16,
    marginLeft: 8,
    marginTop: -2,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  downloadItem: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});

// -----------------
// Manage Donwload
// -----------------
async function downloadFile(uri, fileName, onFinish, onProgress) {
  let baseDir = FileSystem.documentDirectory;
  let pathFile = baseDir + "/SQLite/" + fileName + ".db";

  try {
    await FileSystem.deleteAsync(pathFile);
  } catch (e) {}

  const downloadResumable = await FileSystem.createDownloadResumable(
    uri,
    pathFile,
    {
      sessionType: FileSystem.FileSystemSessionType.FOREGROUND,
    },
    onProgress
  );

  try {
    downloadResumable.downloadAsync().then(async ({ uri }) => {
      console.log("Finished downloading to ", uri);

      let opa = await FileSystem.getInfoAsync(pathFile);
      console.log(opa);
      onFinish();
    });
  } catch (e) {
    console.error(e);
  }
}
