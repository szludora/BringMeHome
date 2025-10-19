export function initAboutMarquee(options = {}) {
  const track = document.querySelector(".card-track-inner");
  if (!track) return;

  function isDuplicated(el) {
    const children = Array.from(el.children);
    if (children.length < 2) return false;
    if (children.length % 2 !== 0) return false;
    const half = children.length / 2;
    const first = children
      .slice(0, half)
      .map((n) => n.outerHTML)
      .join("");
    const second = children
      .slice(half)
      .map((n) => n.outerHTML)
      .join("");
    return first === second;
  }

  track.style.willChange = "transform";
  track.style.transform = "translate3d(0,0,0)";

  let originalNodes = Array.from(track.children);
  if (isDuplicated(track)) {
    originalNodes = Array.from(track.children).slice(
      0,
      track.children.length / 2
    );
  }

  const imgs = Array.from(originalNodes).flatMap((n) =>
    Array.from(n.querySelectorAll("img"))
  );
  const waitForImages = () => {
    if (imgs.length === 0) return Promise.resolve();
    return Promise.all(
      imgs.map((img) => {
        if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
        return new Promise((res) => {
          img.addEventListener("load", res);
          img.addEventListener("error", res);
        });
      })
    );
  };

  let singleWidth = 0;
  const computeSingleWidth = () => {
    const styles = window.getComputedStyle(
      originalNodes[0]?.parentElement || track
    );
    let sum = 0;
    for (const node of originalNodes) {
      const rect = node.getBoundingClientRect();
      const cs = window.getComputedStyle(node);
      const mr = parseFloat(cs.marginRight) || 0;

      sum += rect.width + mr;
    }
    singleWidth = sum;
  };

  const recalc = () => {
    originalNodes = Array.from(track.children);
    if (isDuplicated(track))
      originalNodes = originalNodes.slice(0, track.children.length / 2);
    computeSingleWidth();
  };

  waitForImages().then(() => {
    if (!isDuplicated(track)) {
      originalNodes = Array.from(track.children);

      computeSingleWidth();
      originalNodes.forEach((node) => track.appendChild(node.cloneNode(true)));
    } else {
      computeSingleWidth();
    }
  });

  window.addEventListener("resize", () => {
    setTimeout(recalc, 120);
  });
  let offset = 0;
  let running = true;
  let last = performance.now();
  const speedPxPerSec = options.speed || 200;

  function step(now) {
    if (!running) return;
    const dt = Math.min(0.01, (now - last) / 1000);
    last = now;
    offset += speedPxPerSec * dt;
    if (singleWidth > 0) {
      offset = offset % singleWidth;
    }
    track.style.transform = `translate3d(${-offset}px,0,0)`;
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);

  return {
    stop() {
      running = false;
    },
    start() {
      if (!running) {
        running = true;
        last = performance.now();
        requestAnimationFrame(step);
      }
    },
    recalc,
  };
}

export default initAboutMarquee;
