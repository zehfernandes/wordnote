import * as Localization from "expo-localization";
import i18n from "i18n-js";

// Languages
import en from "../lang/en.json";
import pt from "../lang/pt.json";

// Normalizating locale returns.
const normalizeTranslate = {
  pt: "pt-BR",
  "pt-BR": "pt-BR",
  en: "en-US",
  "en-US": "en-US",
};

// Configuring translations.
i18n.fallbacks = true;
i18n.translations = { en, pt };
i18n.defaultLocale = "en";
i18n.locale = normalizeTranslate[Localization.locale];

// Exports translations lib.
export default i18n;
