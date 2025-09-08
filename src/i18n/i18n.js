let translations = {};
let currentLang = "hu";
let blackListForUpdate = [];
blackListForUpdate.push("visibility_btn");

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
    if (translations[key] && !blackListForUpdate.includes(el.id)) el.textContent = translations[key];
  });
}

export function getValueForKey(key){
  if(translations[key])
    return translations[key];
  else
    return "";
}

export function getCurrentLang() {
  return currentLang;
}
