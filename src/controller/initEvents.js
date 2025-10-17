import { loadContent } from "./load.js";
import { initLanguage } from "../i18n/i18n.js";
import { setupNavbarLinks } from "./setupNavbarLinks.js";
import { handleInitialHashScroll } from "./handleInitialHashScroll.js";
import { createTimeline } from "./sub/journey.js";
import { fixAllPaths, setupPathObserver } from "./pathFixer.js";

export async function initEvents() {
  fixAllPaths();
  setupPathObserver();

  const isIndex =
    window.location.pathname.includes("/index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("/BringMeHome/");

  if (isIndex) {
    await loadContent(true);
    setupNavbarLinks(true);
    createTimeline();
  } else {
    await loadContent();
    setupNavbarLinks(false);
  }
  initLanguage();
  handleInitialHashScroll();
}
