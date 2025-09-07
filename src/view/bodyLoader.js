export async function loadBody() {
  const res = await fetch('/src/view/body.html');
  const html = await res.text();
  document.body.innerHTML = html;
}
