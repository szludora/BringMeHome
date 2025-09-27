import { log, warn, error } from "../core/logger.js";

let currentLanguage = localStorage.getItem("lang") || "hu";
let translations = {};

export async function initLanguage() {
  await loadTranslations(currentLanguage);
  updateTexts();
  setupLanguageSwitches();
  log("Languages loaded");
}

async function loadTranslations(lang) {
  try {
    const res = await fetch(`/src/i18n/${lang}.json`);
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
    else warn(`Missing translation: ${key}`);
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
    if (!input) return;

    input.checked = currentLanguage === "en";
    icon.src = input.checked
      ? "/assets/img/flags/en.png"
      : "/assets/img/flags/hu.png";

    input.addEventListener("change", async () => {
      currentLanguage = input.checked ? "en" : "hu";
      localStorage.setItem("lang", currentLanguage);
      icon.src = input.checked
        ? "/assets/img/flags/en.png"
        : "/assets/img/flags/hu.png";
      await loadTranslations(currentLanguage);
      updateTexts();
    });
  });
}
