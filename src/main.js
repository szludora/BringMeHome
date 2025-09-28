import { initEvents } from "./controller/initEvents.js";
import { setDevMode, log } from "./core/logger.js";

setDevMode(true);

export const heroPages = {
  navbar: "/src/view/layout/navbar.html",
  hero: "/src/view/landing/hero.html",
  about: "/src/view/landing/about.html",
  adopt: "/src/view/landing/adopt.html",
  adopters: "/src/view/landing/adopters.html",
  team: "/src/view/landing/team.html",
  homeSeeker: "/src/view/landing/homeSeeker.html",
  thanks: "/src/view/landing/thanks.html",
  faq: "/src/view/landing/faq.html",
  footer: "/src/view/layout/footer.html",
};

await initEvents();
