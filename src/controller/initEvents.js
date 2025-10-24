import { loadContent } from "./load.js";
import { initLanguage } from "../i18n/i18n.js";
import { createTimeline } from "./sub/journey.js";
import initAboutMarquee from "../view/landing/about-marquee.js";
import { warn } from "../core/logger.js";
import {
  handleInitialHashScroll,
  setupLayoutLinksForSinglePage,
  onScroll,
  refreshNavState,
  setIsFooterVisible
} from "./navbarAndScrollController.js";

export async function initEvents() {
  const isIndex =
    window.location.pathname.includes("/index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("/BringMeHome/");

  if (isIndex) {
    await loadContent(true);
    refreshNavState();
    createTimeline();

    const scrollObserver = new IntersectionObserver((e) => {
      setIsFooterVisible(e[0].isIntersecting ? true : false);
    });
    scrollObserver.observe(document.getElementById("footer"));

    window.addEventListener("scroll", () => onScroll(), {
      passive: true,
    });
  } else {
    await loadContent();
    setupLayoutLinksForSinglePage(".nav-link");
    setupLayoutLinksForSinglePage(".footer-link");
    refreshNavState();
  }
  try {
    initAboutMarquee();
  } catch (e) {
    warn("About marquee init failed", e);
  }
  initLanguage();
  handleInitialHashScroll();
  handleButtonMiddleClick();
}

function handleButtonMiddleClick() {
  function extractUrlFromOnclick(onclick) {
    if (!onclick) return null;
    const m =
      onclick.match(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/i) ||
      onclick.match(/location\.href\s*=\s*['"]([^'"]+)['"]/i) ||
      onclick.match(/window\.open\(\s*['"]([^'"]+)['"]/i);
    return m ? m[1] : null;
  }

  document.querySelectorAll("button[onclick]").forEach((btn) => {
    const onclick = btn.getAttribute("onclick");
    const url = extractUrlFromOnclick(onclick);
    if (!url) return;

    // middle click (wheel) -> open in new tab
    btn.addEventListener("auxclick", (e) => {
      if (e.button === 1) {
        window.open(url, "_blank");
        e.preventDefault();
      }
    });

    // ctrl/cmd + left click -> open in new tab (mimic anchor behavior)
    btn.addEventListener("click", (e) => {
      if (e.button === 0 && (e.ctrlKey || e.metaKey)) {
        window.open(url, "_blank");
        e.preventDefault();
      }
    });
  });
}
