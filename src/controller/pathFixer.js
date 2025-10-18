import { log } from "../core/logger.js";

function getBasePath() {
  const path = window.location.pathname;
  const isGitHubPages = path.includes("/BringMeHome/");
  return isGitHubPages ? "/BringMeHome/" : "/";
}

function fixRelativePath(relativePath) {
  const basePath = getBasePath();

  log(`Fixing path: ${relativePath}, basePath: ${basePath}`);

  if (basePath === "/") {
    return relativePath;
  }

  if (relativePath.startsWith("http") || relativePath.startsWith("/")) {
    return relativePath;
  }

  if (relativePath.startsWith("../../../")) {
    const cleanPath = relativePath.substring(9);
    const result = `${basePath}${cleanPath}`;
    log(`../../../: ${relativePath} -> ${result}`);
    return result;
  }

  if (relativePath.startsWith("../../")) {
    const cleanPath = relativePath.substring(6);
    const result = `${basePath}${cleanPath}`;
    log(`../../: ${relativePath} -> ${result}`);
    return result;
  }

  if (relativePath.startsWith("./")) {
    const cleanPath = relativePath.substring(2);
    const result = `${basePath}${cleanPath}`;
    log(`./: ${relativePath} -> ${result}`);
    return result;
  }

  if (
    !relativePath.includes("/") ||
    relativePath.startsWith("assets/") ||
    relativePath.startsWith("src/")
  ) {
    const result = `${basePath}${relativePath}`;
    log(`Direct: ${relativePath} -> ${result}`);
    return result;
  }

  log(`No change: ${relativePath}`);
  return relativePath;
}

function fixImagePaths() {
  const images = document.querySelectorAll("img[src]");
  let fixedCount = 0;

  images.forEach((img) => {
    const originalSrc = img.getAttribute("src");
    if (originalSrc && !originalSrc.startsWith("http") && originalSrc !== "") {
      const fixedSrc = fixRelativePath(originalSrc);
      if (fixedSrc !== originalSrc) {
        img.src = fixedSrc;
        fixedCount++;
      }
    }
  });

  if (fixedCount > 0) {
    log(`Fixed ${fixedCount} image paths`);
  }
}

function fixScriptPaths() {
  const scripts = document.querySelectorAll("script[src]");
  let fixedCount = 0;

  scripts.forEach((script) => {
    const originalSrc = script.getAttribute("src");
    if (originalSrc && !originalSrc.startsWith("http") && originalSrc !== "") {
      const fixedSrc = fixRelativePath(originalSrc);
      if (fixedSrc !== originalSrc) {
        script.src = fixedSrc;
        fixedCount++;
      }
    }
  });

  if (fixedCount > 0) {
    log(`Fixed ${fixedCount} script paths`);
  }
}

function fixLinkPaths() {
  const links = document.querySelectorAll("link[href]");
  let fixedCount = 0;

  links.forEach((link) => {
    const originalHref = link.getAttribute("href");
    if (
      originalHref &&
      !originalHref.startsWith("http") &&
      originalHref !== ""
    ) {
      const fixedHref = fixRelativePath(originalHref);
      if (fixedHref !== originalHref) {
        link.href = fixedHref;
        fixedCount++;
      }
    }
  });

  if (fixedCount > 0) {
    log(`Fixed ${fixedCount} link paths`);
  }
}

function fixAnchorPaths() {
  const anchors = document.querySelectorAll("a[href]");
  let fixedCount = 0;

  anchors.forEach((anchor) => {
    const originalHref = anchor.getAttribute("href");

    if (
      originalHref &&
      !originalHref.startsWith("http") &&
      !originalHref.startsWith("#") &&
      !originalHref.startsWith("mailto:") &&
      originalHref !== "" &&
      originalHref !== "/"
    ) {
      const fixedHref = fixRelativePath(originalHref);
      if (fixedHref !== originalHref) {
        anchor.href = fixedHref;
        fixedCount++;
      }
    }
  });

  if (fixedCount > 0) {
    log(`Fixed ${fixedCount} anchor paths`);
  }
}

export function fixAllPaths() {
  if (getBasePath() === "/") {
    log("Local environment detected, skipping path fixes");
    return;
  }

  fixImagePaths();
  fixScriptPaths();
  fixLinkPaths();
  fixAnchorPaths();
  log("GitHub Pages path fixing completed");
}

export function setupPathObserver() {
  if (getBasePath() === "/") {
    return;
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            fixElementPaths(node);
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  log("GitHub Pages path observer set up");
}

function fixElementPaths(element) {
  // Képek
  const imageList = element.querySelectorAll
    ? element.querySelectorAll("img[src]")
    : [];
  const images = Array.from(imageList);
  if (element.tagName === "IMG" && element.src) {
    images.push(element);
  }

  images.forEach((img) => {
    const originalSrc = img.getAttribute("src");
    if (originalSrc && !originalSrc.startsWith("http") && originalSrc !== "") {
      const fixedSrc = fixRelativePath(originalSrc);
      if (fixedSrc !== originalSrc) {
        img.src = fixedSrc;
      }
    }
  });

  // Scripts
  const scriptList = element.querySelectorAll
    ? element.querySelectorAll("script[src]")
    : [];
  const scripts = Array.from(scriptList);
  if (element.tagName === "SCRIPT" && element.src) {
    scripts.push(element);
  }

  scripts.forEach((script) => {
    const originalSrc = script.getAttribute("src");
    if (originalSrc && !originalSrc.startsWith("http") && originalSrc !== "") {
      const fixedSrc = fixRelativePath(originalSrc);
      if (fixedSrc !== originalSrc) {
        script.src = fixedSrc;
      }
    }
  });

  // Anchor linkek
  const anchorList = element.querySelectorAll
    ? element.querySelectorAll("a[href]")
    : [];
  const anchors = Array.from(anchorList);
  if (element.tagName === "A" && element.href) {
    anchors.push(element);
  }

  anchors.forEach((anchor) => {
    const originalHref = anchor.getAttribute("href");
    if (
      originalHref &&
      !originalHref.startsWith("http") &&
      !originalHref.startsWith("#") &&
      !originalHref.startsWith("mailto:") &&
      originalHref !== "" &&
      originalHref !== "/"
    ) {
      const fixedHref = fixRelativePath(originalHref);
      if (fixedHref !== originalHref) {
        anchor.href = fixedHref;
      }
    }
  });
}

export function getAbsolutePath(relativePath) {
  return fixRelativePath(relativePath);
}

export { getBasePath };
