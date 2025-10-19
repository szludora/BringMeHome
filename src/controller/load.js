import { log, warn } from "../core/logger.js";
import { heroPages as pages, layoutForIndividualPages } from "../main.js";

const template = `
  <div id="navbar"></div>
  <div id="hero"></div>
  <div id="about"></div>
  <div id="adopt"></div>
  <div id="adopters"></div>
  <div id="team"></div>
  <div id="homeSeeker"></div>
  <div id="thanks"></div>
  <div id="faq"></div>
  <div id="footer"></div>
`;

function getContainer() {
  let c =
    document.getElementById("singlePage") ?? document.getElementById("app");
  if (!c) {
    c = document.createElement("div");
    c.id = "singlePage";
    document.body.appendChild(c);
    warn("Container not found, created a new 'singlePage' div dynamically.");
  }
  return c;
}

export async function loadContent(isIndex = false) {
  const container = getContainer();
  toggleVisibility(false);

  if (isIndex && !container.innerHTML.trim()) container.innerHTML = template;

  if (!isIndex) {
    // For special single-page views (e.g. noFooter) we only inject the
    // navbar and skip the rest of the site chrome (footer etc.). For normal
    // pages load all layout parts defined in layoutForIndividualPages.
    if (container.classList.contains("noFooter")) {
      await loadSection("navbar", false);
    } else {
      await Promise.all(Object.keys(layoutForIndividualPages).map((page) => loadSection(page, false)));
    }
  }

  if (isIndex) {
    const landPages = Object.keys(pages);
    await Promise.all(landPages.map((page) => loadSection(page, true)));
  }

  log("pages loaded");
  toggleVisibility(true);
}

async function loadSection(id, isHeroPage = true) {
  const container = getContainer();
  const file = isHeroPage ? pages[id] : layoutForIndividualPages[id];
  if (!file || !container) return;

  let section = document.getElementById(id);
  if (!section) {
    section = document.createElement("section");
    section.id = id;
    container.appendChild(section);
  }

  const html = await (await fetch(file)).text();
  section.innerHTML = html;
  reloadScripts(section);
}

function toggleVisibility(show = true) {
  const container = getContainer();
  if (!container) return;
  container.classList.toggle("d-none", !show);
}

function reloadScripts(section) {
  // reload all scripts that are attached to the html file
  section.querySelectorAll("script").forEach((script) => {
    const newScript = document.createElement("script");
    if (script.src) {
      newScript.src = script.src;
      newScript.type = script.type || "text/javascript";
      newScript.onload = () => {
        for (let key in window) {
          if (
            (key == "onLoad" && typeof window[key] === "function") ||
            (key == "onload" && typeof window[key] === "function")
          ) {
            window[key]();
          }
        }
      };
    } else {
      newScript.textContent = script.textContent;
      newScript.onload = () => makeGlobals(newScript);
    }
    script.replaceWith(newScript);
  });
}
