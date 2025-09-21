import { error } from "../core/logger.js";

let pages = {};

export function setPages(newPages) {
  pages = newPages;
}

export async function load(name) {
  const file = pages[name];
  if (!file) {
    error(`There is no page like this: ${name}`);
    return;
  }
  const res = await fetch(file);
  const html = await res.text();
  const container = document.querySelector(`#${name}`);
  if (!container) {
    error(`There is no container in the DOM like this: ${name}`);
    return;
  }
  container.innerHTML = html;
}
