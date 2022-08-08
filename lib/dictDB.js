import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

import { getOfflineLangs, deleteLang } from "./appDB";

let databaseKey = {};

export class DatabaseInit {
  constructor() {
    return (async () => {
      let baseDir = FileSystem.documentDirectory + "SQLite";

      //Check Folder and Default idiom
      if (!(await FileSystem.getInfoAsync(baseDir)).exists) {
        await FileSystem.makeDirectoryAsync(baseDir);
      }

      // Delete previus version of database
      if (await FileSystem.getInfoAsync(baseDir + "/dict_en.db").exists) {
        await FileSystem.deleteAsync(baseDir + "/dict_en.db");
      }

      if (!(await FileSystem.getInfoAsync(baseDir + "/dict_en_v2.db")).exists) {
        await FileSystem.downloadAsync(
          Asset.fromModule(require("../assets/dict_en_v2.db")).uri,
          baseDir + "/dict_en_v2.db"
        );
      }

      databaseKey["en"] = SQLite.openDatabase("dict_en_v2.db");

      // get all idioms unless "en" (default one)
      let langs = await getOfflineLangs();
      langs = langs.filter((lang) => lang !== "en");

      //for langs
      for (let i = 0; i < langs.length; i++) {
        let langcode = langs[i];
        let fileName = `/dict_${langcode}.db`;
        if ((await FileSystem.getInfoAsync(baseDir + fileName)).exists) {
          databaseKey[langcode] = SQLite.openDatabase(fileName);
        } else {
          console.log("File not found");
          deleteLang(langcode);
        }
      }

      return this;
    })();
  }

  getDatabase(key) {
    // TODO: If don't exist return error
    console.log(databaseKey[key]);
    return databaseKey[key];
  }

  addNewDatabase(key, fileName) {
    databaseKey[key] = SQLite.openDatabase(fileName);
  }

  removeDatabase(key) {
    let baseDir = FileSystem.documentDirectory;
    let fileName = `dict_${key}`;
    let pathFile = baseDir + "/SQLite/" + fileName + ".db";
    FileSystem.deleteAsync(pathFile);
  }

  testDatabase() {
    return this.getDatabase("en").transaction((tx) => {
      return tx.executeSql(
        "select * from words_en WHERE word='test'",
        [],
        (_, { rows }) => console.log(JSON.stringify(rows))
      );
    });
  }
}
