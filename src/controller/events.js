import { loadLanguage } from "../i18n/i18n.js";
import { changeFormVisibility } from "../global_form/global_form.js";

export function initEvents() {
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-setlang]")) {
      const currentButtonLang = e.target.getAttribute("data-setlang");
      const newLang = currentButtonLang === "hu" ? "en" : "hu";
      loadLanguage(newLang);
      e.target.setAttribute("data-setlang", newLang);
    }
  });
}

export function  initFormEvents(){
  document.addEventListener("click", (e) => {
    if (e.target.id === "visibility_btn") {
      changeFormVisibility();
    }
  });
}
