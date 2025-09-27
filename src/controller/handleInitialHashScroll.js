export function handleInitialHashScroll() {
  const hash = window.location.hash;
  if (!hash) return;

  const id = hash.replace(/^#/, "").replace(/\.html$/, "");
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth" });
}
