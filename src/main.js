import { initEvents } from "./controller/initEvents.js";
import { setDevMode } from "./core/logger.js";
import { getBasePath } from "./controller/pathFixer.js";
import { Snackbar } from "./packages/snackbar/dist/snackbar.min.js";

window.Snackbar = Snackbar;
window.TYPE = Snackbar.TYPE;
window.POSITION = Snackbar.POSITION;

setDevMode(true);

function getLayoutPath() {
  const basePath = getBasePath();
  return `${basePath}src/view/layout/`;
}

export const heroPages = {
  navbar: `${getLayoutPath()}navbar.html`,
  hero: `${getBasePath()}src/view/landing/hero.html`,
  about: `${getBasePath()}src/view/landing/about.html`,
  adopt: `${getBasePath()}src/view/landing/adopt.html`,
  adopters: `${getBasePath()}src/view/landing/adopters.html`,
  journey: `${getBasePath()}src/view/landing/journey.html`,
  homeSeeker: `${getBasePath()}src/view/landing/homeSeeker.html`,
  thanks: `${getBasePath()}src/view/landing/thanks.html`,
  faq: `${getBasePath()}src/view/landing/faq.html`,
  footer: `${getLayoutPath()}footer.html`,
};

export const layoutForIndividualPages = {
  navbar: `${getLayoutPath()}navbar.html`,
  footer: `${getLayoutPath()}footer.html`,
};

await initEvents();
