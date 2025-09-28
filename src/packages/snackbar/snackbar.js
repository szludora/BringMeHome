import { TYPE, POSITION, TYPE_STYLES, DEFAULT as config } from "./config.js";

const queue = [];
let isShowing = false;

export const Snackbar = (() => {
  // ---- public API ----
  function show(options = {}) {
    const {
      message,
      type = TYPE.SUCCESS,
      position = POSITION.TOP,
      duration = 5000,
      delay = 300,
    } = options;
    if (!_validateOptions({ message, type, position, duration, delay })) return;
    queue.push({ message, type, position, duration, delay });
    if (!isShowing) _showNext();
  }

  return { show };

  function _validateOptions({ message, type, position, duration, delay }) {
    let valid = true;

    if (!message) {
      console.warn("message param is required");
      valid = false;
    }

    if (!Object.values(TYPE).includes(type)) {
      console.warn(
        `Invalid type: ${type}. Must be: ${Object.values(TYPE).join(
          " / "
        )}. E.g.: TYPE.SUCCESS`
      );
    }

    if (!Object.values(POSITION).includes(position)) {
      console.warn(
        `Invalid position: ${position}. Must be: ${Object.values(POSITION).join(
          " / "
        )}. E.g.: POSITION.TOP`
      );
    }

    if (duration <= 0) {
      console.warn(`Invalid duration: ${duration}. Must be > 0`);
      valid = false;
    }

    if (delay < 0) {
      console.warn(`Invalid delay: ${delay}. Must be >= 0`);
      valid = false;
    }

    return valid;
  }

  function _createContainer(position) {
    const containerId = `snackbar-container-${position}`;
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      Object.assign(container.style, {
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: config.width ?? "none",
        zIndex: "9999",
        display: "flex",
        flexDirection: "column",
        width: config.width ?? "95%",
        top: position === POSITION.TOP ? config.top ?? "4.5rem" : "unset",
        bottom:
          position === POSITION.BOTTOM ? config.bottom ?? "0.5rem" : "unset",
      });
      document.body.appendChild(container);
    }
    return container;
  }

  function _createSnackbar({ message, type, position }) {
    const snackbar = document.createElement("div");
    snackbar.textContent = message;

    Object.assign(snackbar.style, {
      backgroundColor: TYPE_STYLES[type].bg() ?? "#a0f0c4",
      color: TYPE_STYLES[type].text() ?? "#4f0808",
      padding: config.padding ?? "1rem 2rem",
      borderRadius: config.borderRadius ?? "5px",
      boxShadow: config.shadow ?? "0 2px 6px rgba(0,0,0,0.2)",
      opacity: 0,
      transform:
        position === POSITION.BOTTOM ? "translateY(100%)" : "translateY(-100%)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
      pointerEvents: config.pointerEvents ?? "auto",
    });

    return snackbar;
  }

  function _showNext() {
    if (queue.length === 0) {
      isShowing = false;
      return;
    }

    isShowing = true;
    const { message, type, position, duration, delay } = queue.shift();

    const container = _createContainer(position);
    const snackbar = _createSnackbar({ message, type, position });
    container.appendChild(snackbar);

    setTimeout(() => {
      snackbar.style.opacity = "1";
      snackbar.style.transform = "translateY(0)";
    }, delay);

    setTimeout(() => {
      _hideSnackbar(snackbar, container, position);
    }, duration + delay);
  }

  function _hideSnackbar(snackbar, container, position) {
    snackbar.style.opacity = "0";
    snackbar.style.transform =
      position === POSITION.BOTTOM ? "translateY(100%)" : "translateY(-100%)";
    snackbar.addEventListener(
      "transitionend",
      () => {
        snackbar.remove();
        if (!container.hasChildNodes()) container.remove();
        isShowing = false;
        _showNext();
      },
      { once: true }
    );
  }
})();
