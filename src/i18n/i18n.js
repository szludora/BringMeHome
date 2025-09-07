let translations = {};
let currentLang = "hu";

export async function loadLanguage(lang) {
  const res = await fetch(`/src/i18n/${lang}.json`);
  translations = await res.json();
  currentLang = lang;
  updateTexts();
  localStorage.setItem("lang", lang);
}

function updateTexts() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[key]) el.textContent = translations[key];
  });
}

export function getCurrentLang() {
  return currentLang;
}
