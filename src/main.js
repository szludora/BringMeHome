import { loadBody } from "./view/bodyLoader.js";
import { loadLanguage } from "./i18n/i18n.js";
import { initEvents, initFormEvents } from "./controller/events.js";
import { loadGlobalForm } from "./global_form/global_form.js";

loadBody().then(() => {
  const savedLang = localStorage.getItem("lang") || "hu";
  loadLanguage(savedLang);

  initEvents();

  loadGlobalForm("sample_form").then(() => {
    initFormEvents();
  });
});
