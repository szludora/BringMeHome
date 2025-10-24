import { log, warn, error } from "../core/logger.js";
// TODO: change this route
import { getBasePath } from "../controller/navbarAndScrollController.js";

let currentLanguage = localStorage.getItem("lang") || "hu";
let translations = {};

export async function initLanguage() {
  await loadTranslations(currentLanguage);
  updateTexts();
  setupLanguageSwitches();
  log("Languages loaded");
}

function getI18nPath() {
  const basePath = getBasePath();
  return `${basePath}src/i18n/`;
}

function getFlagPath() {
  const basePath = getBasePath();
  return `${basePath}assets/img/flags/`;
}

async function loadTranslations(lang) {
  try {
    const i18nPath = getI18nPath();
    const res = await fetch(`${i18nPath}${lang}.json`);

    translations = await res.json();
  } catch (err) {
    error("Failed to load translations", err);
    translations = {};
  }
}

export function updateTexts() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const text = key.split(".").reduce((o, k) => o?.[k], translations);
    if (text !== undefined) el.textContent = text;
    else {
      el.textContent = key;
      warn(`Missing translation: ${key}`).show({
        message: "Some translations might not have loaded… sorry about that.",
        type: Snackbar.TYPE.ERROR,
      });
    }
  });
}

function setupLanguageSwitches() {
  const switches = [
    { inputId: "languageSwitch", iconId: "langIcon" },
    { inputId: "languageSwitchMobile", iconId: "langIconMobile" },
  ];

  switches.forEach(({ inputId, iconId }) => {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input || !icon) return;

    input.checked = currentLanguage === "en";

    const flagPath = getFlagPath();
    icon.src = input.checked ? `${flagPath}en.png` : `${flagPath}hu.png`;

    input.addEventListener("change", async () => {
      currentLanguage = input.checked ? "en" : "hu";
      localStorage.setItem("lang", currentLanguage);
      icon.src = input.checked ? `${flagPath}en.png` : `${flagPath}hu.png`;
      await loadTranslations(currentLanguage);
      updateTexts();
    });
  });
}
