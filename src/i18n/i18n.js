import { warn } from "../core/logger.js";

let translations = {};
let currentLang = "hu";

export async function loadLanguage(lang) {
  const res = await fetch(`/src/i18n/${lang}.json`);
  translations = await res.json();
  currentLang = lang;
  updateTexts();
}

function getNestedTranslation(obj, key) {
  return key.split(".").reduce((res, k) => (res ? res[k] : undefined), obj);
}

function updateTexts() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const translation = getNestedTranslation(translations, key);
    if (translation !== undefined) {
      el.textContent = translation;
    } else {
      warn(`There is no translation for the key: ${key}`);
    }
  });
}

export function getCurrentLang() {
  return currentLang;
}
