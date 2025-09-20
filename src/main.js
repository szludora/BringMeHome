import { loadLanguage } from "./i18n/i18n.js";
import { initEvents } from "./controller/events.js";
import { load, setPages } from "./view/load.js";

const pages = {
  navbar: "/src/view/landing/navbar.html",
  hero: "/src/view/landing/about.html",
  about: "/src/view/landing/about.html",
  adopt: "/src/view/landing/about.html",
  adopters: "/src/view/landing/about.html",
  team: "/src/view/landing/about.html",
  givingForAdoption: "/src/view/landing/about.html",
  thanks: "/src/view/landing/about.html",
  qa: "/src/view/landing/about.html",
  footer: "/src/view/landing/about.html",
};
setPages(pages);

(async function init() {
  for (const page of Object.keys(pages)) {
    await load(page);
  }

  const savedLang = localStorage.getItem("lang") || "hu";
  await loadLanguage(savedLang);

  const toggler = document.querySelector(".navbar-toggler");
  if (toggler) toggler.classList.remove("d-none");

  initEvents();

  const switches = [
    { inputId: "languageSwitchMobile", iconId: "langIconMobile" },
    { inputId: "languageSwitch", iconId: "langIcon" },
  ];

  function updateSwitchIcons(lang) {
    switches.forEach((sw) => {
      const icon = document.getElementById(sw.iconId);
      const input = document.getElementById(sw.inputId);
      if (icon && input) {
        icon.src =
          lang === "en"
            ? "/assets/img/flags/en.png"
            : "/assets/img/flags/hu.png";
        input.checked = lang === "en";
      }
    });
  }

  updateSwitchIcons(savedLang);

  switches.forEach((s) => {
    const switchEl = document.getElementById(s.inputId);
    if (!switchEl) return;

    switchEl.addEventListener("change", async () => {
      const newLang = switchEl.checked ? "en" : "hu";
      localStorage.setItem("lang", newLang);
      await loadLanguage(newLang);
      updateSwitchIcons(newLang);
    });
  });
})();
