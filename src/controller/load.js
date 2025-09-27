import { log, error } from "../core/logger.js";
import { heroPages as pages } from "../main.js";

let container =
  document.getElementById("singlePage") ?? document.getElementById("app");
const template = `
  <div id="hero"></div>
  <div id="about"></div>
  <div id="adopt"></div>
  <div id="adopters"></div>
  <div id="team"></div>
  <div id="homeSeeker"></div>
  <div id="thanks"></div>
  <div id="faq"></div>
`;

export async function loadHero() {
  toggleVisibility(false);
  await loadLayout();
  await loadLandPage();
  toggleVisibility(true);
}

export async function loadLayout() {
  if (pages.navbar) {
    const res = await fetch(pages.navbar);
    document.getElementById("navbar").innerHTML = await res.text();
  }
  if (pages.footer) {
    const res = await fetch(pages.footer);
    document.getElementById("footer").innerHTML = await res.text();
  }
  log("Layout loaded");
}

async function loadLandPage() {
  if (!container.innerHTML.trim()) container.innerHTML = template;

  for (const page of Object.keys(pages)) {
    const file = pages[page];
    if (!file) continue;

    const res = await fetch(file);
    const html = await res.text();

    let section = document.getElementById(page);
    if (!section) {
      section = document.createElement("section");
      section.id = page;
      container.appendChild(section);
    }
    section.innerHTML = html;
  }

  log("LandPages loaded");
}

function toggleVisibility(show = true) {
  container.classList.toggle("d-none", !show);
}
