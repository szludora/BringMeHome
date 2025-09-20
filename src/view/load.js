let pages = {};

export function setPages(newPages) {
  pages = newPages;
}

export async function load(name) {
  const file = pages[name];
  if (!file) {
    console.error(`Nincs ilyen oldal: ${name}`);
    return;
  }
  const res = await fetch(file);
  const html = await res.text();
  document.querySelector(`#` + name).innerHTML = html;
}
