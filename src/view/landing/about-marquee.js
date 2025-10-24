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
      track.children.length / 2,
    );
  }

  const imgs = Array.from(originalNodes).flatMap((n) =>
    Array.from(n.querySelectorAll("img")),
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
      }),
    );
  };

  let singleWidth = 0;
  const computeSingleWidth = () => {
    const parent = originalNodes[0]?.parentElement || track;
    const parentStyles = window.getComputedStyle(parent);
    const gap =
      parseFloat(parentStyles.gap) ||
      parseFloat(parentStyles.columnGap) ||
      0;

    let sum = 0;
    for (const node of originalNodes) {
      const rect = node.getBoundingClientRect();
      const cs = window.getComputedStyle(node);
      const mr = parseFloat(cs.marginRight) || 0;
      const ml = parseFloat(cs.marginLeft) || 0;

      // rect.width already includes padding and borders, add both margins
      sum += rect.width + ml + mr;
    }

    // add gaps between items (gap applies between items, so count = n-1)
    if (originalNodes.length > 1 && gap) {
      sum += gap * (originalNodes.length - 1);
    }

    singleWidth = sum;
  };

  const recalc = () => {
    // Treat originals as children without the 'duplicated' marker
    originalNodes = Array.from(track.children).filter(
      (c) => !(c.classList && c.classList.contains("duplicated")),
    );

    // fallback: if nothing filtered (no markers), keep all children
    if (originalNodes.length === 0) {
      originalNodes = Array.from(track.children);
      if (isDuplicated(track)) {
        originalNodes = originalNodes.slice(0, track.children.length / 2);
      }
    }

    computeSingleWidth();
  };

  // helper to manage clones: defined in outer scope so resize handler can access them
  function hasClones() {
    return Array.from(track.children).some((c) => c.classList && c.classList.contains("duplicated"));
  }

  function addClones() {
    if (hasClones()) return;
    // determine originals at time of adding
    const originals = Array.from(track.children).filter((c) => !(c.classList && c.classList.contains("duplicated")));
    originals.forEach((node) => {
      const clone = node.cloneNode(true);
      clone.classList.add("duplicated");
      track.appendChild(clone);
    });
  }

  function removeClones() {
    // remove elements marked as duplicated
    Array.from(track.children).forEach((c) => {
      if (c.classList && c.classList.contains("duplicated")) c.remove();
    });
  }

  waitForImages().then(() => {
    // If author put a wrapper .duplicated in the HTML (static markup),
    // unwrap its children so the track stays a single flat list (prevents vertical stacking).
    const dupWrappers = Array.from(track.querySelectorAll('.duplicated'));
    dupWrappers.forEach((wrap) => {
      while (wrap.firstChild) {
        track.insertBefore(wrap.firstChild, wrap);
      }
      wrap.remove();
    });

    // determine current originals (ignore existing duplicated clones)
    originalNodes = Array.from(track.children).filter(
      (c) => !(c.classList && c.classList.contains("duplicated")),
    );

    if (isDuplicated(track)) {
      originalNodes = originalNodes.slice(0, track.children.length / 2);
    }

    computeSingleWidth();

    // Create clones only on wide viewports (desktop). On mobile we avoid adding clones to prevent duplicated stacked cards.
    if (window.innerWidth >= 768) {
      addClones();
    } else {
      // ensure no clones present on small screens
      removeClones();
    }
  });

  window.addEventListener("resize", () => {
    // recalc sizes slightly after resize end
    setTimeout(() => {
      recalc();
       // pause the marquee on small viewports, resume on larger ones
  const shouldRun = window.innerWidth >= 768;
       if (shouldRun && !running) {
         // restart animation
         last = performance.now();
         requestAnimationFrame(step);
         running = true;
       } else if (!shouldRun && running) {
         // stop and reset transform so it doesn't show mid-scroll
         running = false;
         offset = 0;
         track.style.transform = "translate3d(0,0,0)";
       }
       // also add/remove clones depending on viewport width
       if (shouldRun) {
         addClones();
       } else {
         removeClones();
       }
     }, 120);
   });

  let offset = 0;
  let running = window.innerWidth >= 768; // start only if wide enough
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

  // start loop only if running allowed by viewport width
  if (running) requestAnimationFrame(step);

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
