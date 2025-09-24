import { warn } from "../core/logger.js";

let translations = {};
let currentLang = "hu";

export async function loadLanguage(lang) {
  const res = await fetch(`/src/i18n/${lang}.json`);
  translations = await res.json();
  currentLang = lang;
  updateTexts();
}

function updateTexts() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[key]) {
      el.textContent = translations[key] || key; // default value: key -> if there is no translation
    } else {
      warn(`There is no translation for the key: ${key}`);
    }
  });
}

export function getCurrentLang() {
  return currentLang;
}
