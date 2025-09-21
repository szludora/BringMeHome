import { loadLanguage } from "./i18n/i18n.js";
import { initEvents } from "./controller/events.js";
import { load, setPages } from "./view/load.js";

const pages = {
  navbar: "/src/view/landing/navbar.html",
  hero: "/src/view/landing/hero.html",
  about: "/src/view/landing/about.html",
  adopt: "/src/view/landing/adopt.html",
  adopters: "/src/view/landing/adopters.html",
  team: "/src/view/landing/team.html",
  homeSeeker: "/src/view/landing/homeSeeker.html",
  thanks: "/src/view/landing/thanks.html",
  faq: "/src/view/landing/faq.html",
  footer: "/src/view/landing/footer.html",
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
      try {
        await loadLanguage(newLang);
        localStorage.setItem("lang", newLang);
      } catch (error) {
        if (error instanceof ChangeLanguageError) {
          console.error("Language error:", error.message);
          alert(
            "Error while changing the language. The language is set to the default language. Try again later."
          );
        } else {
          console.error("Unknown error:", error);
        }
      }
      updateSwitchIcons(newLang);
    });
  });
})();
