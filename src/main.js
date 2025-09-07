import { loadBody } from "./view/bodyLoader.js";
import { loadLanguage } from "./i18n/i18n.js";
import { initEvents } from "./controller/events.js";

loadBody().then(() => {
  const savedLang = localStorage.getItem("lang") || "hu";
  loadLanguage(savedLang);
  initEvents();
});
