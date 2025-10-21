import { getBasePath } from "./pathFixer.js";
let sections = [];
let navLinks = [];

sections = Array.from(document.querySelectorAll("[data-wrapper][id]")).map(
  (el) => ({ id: el.id, el })
);
navLinks = Array.from(document.querySelectorAll(".nav-link")).filter((link) =>
  link.getAttribute("href")
);

export function setupLayoutLinksForSinglePage(layoutClassSelector) {
  document.querySelectorAll(layoutClassSelector).forEach((link) => {
    const target = link.getAttribute("href");
    if (!target) return;

    const basePath = getBasePath();
    link.href = `${basePath}${target}`;
  });
}

export function handleInitialHashScroll() {
  const hash = window.location.hash;
  if (!hash) return;

  const id = hash.replace(/^#/, "").replace(/\.html$/, "");
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth" });
}

export function onScroll(ticking = false) {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const fromTop = window.scrollY + window.innerHeight / 2; // visible when half passes

    // find the last section whose top is <= fromTop
    let activeId = null;
    for (let i = 0; i < sections.length; i++) {
      const { el, id } = sections[i];
      const top = el.offsetTop;
      if (fromTop >= top) activeId = id;
      else break;
    }

    // nav links
    navLinks.forEach((link) => {
      const h = hrefHash(link);
      link.classList.toggle("active", h && activeId === h);
    });

    // sections
    sections.forEach(({ el, id }) => {
      el.classList.toggle("active", id === activeId);
    });

    ticking = false;
  });
}

export function refreshNavState() {
  sections = Array.from(document.querySelectorAll("[data-wrapper][id]")).map(
    (el) => ({ id: el.id, el })
  );
  navLinks = Array.from(document.querySelectorAll(".nav-link")).filter((link) =>
    link.getAttribute("href")
  );
}

function hrefHash(link) {
  const raw = (link.getAttribute("href") || "").trim();
  if (raw === "#") {
    // index
    return sections.length ? sections[0].id : "";
  }
  try {
    return new URL(raw, location.href).hash.replace("#", "");
  } catch (e) {
    return raw.replace(/^#/, "");
  }
}
