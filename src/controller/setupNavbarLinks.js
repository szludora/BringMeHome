import { getBasePath } from "./pathFixer.js";

export function setupNavbarLinks(isIndexPage) {
  document.querySelectorAll(".nav-link:not(.navbar-brand)").forEach((link) => {
    const target = link.getAttribute("href");
    if (!target) return;

    const newLink = link.cloneNode(true);
    link.replaceWith(newLink);

    if (isIndexPage) {
      const id = target.split("#")[1] || target.replace(/\.html$/, "");
      newLink.addEventListener("click", (e) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      });
    } else {
      const basePath = getBasePath();
      if (target.startsWith("#")) {
        newLink.href = `${basePath}${target}`;
      } else {
        newLink.href = `${basePath}${target}`;
      }
    }
  });

  document.querySelectorAll(".navbar-brand").forEach((brand) => {
    if (!isIndexPage) {
      const basePath = getBasePath();
      brand.href = basePath === "/" ? "/" : basePath;
    }
  });
}
