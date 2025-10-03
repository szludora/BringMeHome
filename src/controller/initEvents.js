import { loadHero, loadLayout } from "./load.js";
import { initLanguage } from "../i18n/i18n.js";
import { setupNavbarLinks } from "./setupNavbarLinks.js";
import { handleInitialHashScroll } from "./handleInitialHashScroll.js";
import {createTimeline} from "./sub/journey.js";

export async function initEvents() {
  const isIndex =
    window.location.pathname.includes("/index.html") ||
    window.location.pathname === "/";

  if (isIndex) {
    await loadHero();
    setupNavbarLinks(true);
    createTimeline();
  } else {
    await loadLayout();
    setupNavbarLinks(false);
  }
  initLanguage();
  handleInitialHashScroll();
}
