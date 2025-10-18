const queue = [];
let isShowing = false;

const defaultConfig = {
  pre: "snack",
  padding: "1rem 2rem",
  borderRadius: "5px",
  border: "unset",
  shadow: "0 2px 6px rgba(0,0,0,0.2)",
  top: "4.5rem",
  bottom: "1rem",
  width: "95%",
  pointerEvents: "auto",
};

const defaultTypes = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

const POSITION = {
  TOP: "top",
  BOTTOM: "bottom",
};

const defaultColors = {
  SUCCESS: { bg: "#a0f0c4", text: "#054321" },
  ERROR: { bg: "#fcbfbf", text: "#4f0808" },
  WARNING: { bg: "#fdff88", text: "#4e4f08" },
  INFO: { bg: "#a0e8f0", text: "#0f575f" },
};

export const Snackbar = (() => {
  const config = { ...defaultConfig };
  const TYPE = { ...defaultTypes };
  let styles = {};

  function getCssVar(name, fallback) {
    const val = getComputedStyle(document.documentElement).getPropertyValue(
      name,
    );
    return val ? val.trim() : fallback;
  }

  function cssVar(attr, type = null) {
    const prefix = config.pre || defaultConfig.pre;
    return `--${prefix}-${attr}${type ? "-" + type : ""}`;
  }

  function getTypeStyles() {
    return {
      [TYPE.SUCCESS]: {
        bg: () =>
          getCssVar(cssVar("bg", TYPE.SUCCESS), defaultColors.SUCCESS.bg),
        text: () =>
          getCssVar(cssVar("text", TYPE.SUCCESS), defaultColors.SUCCESS.text),
        position: POSITION.BOTTOM,
      },
      [TYPE.ERROR]: {
        bg: () => getCssVar(cssVar("bg", TYPE.ERROR), defaultColors.ERROR.bg),
        text: () =>
          getCssVar(cssVar("text", TYPE.ERROR), defaultColors.ERROR.text),
        position: POSITION.BOTTOM,
      },
      [TYPE.WARNING]: {
        bg: () =>
          getCssVar(cssVar("bg", TYPE.WARNING), defaultColors.WARNING.bg),
        text: () =>
          getCssVar(cssVar("text", TYPE.WARNING), defaultColors.WARNING.text),
        position: POSITION.TOP,
      },
      [TYPE.INFO]: {
        bg: () => getCssVar(cssVar("bg", TYPE.INFO), defaultColors.INFO.bg),
        text: () =>
          getCssVar(cssVar("text", TYPE.INFO), defaultColors.INFO.text),
        position: POSITION.TOP,
      },
    };
  }

  styles = { ...getTypeStyles() };

  function getDefaultColorForType(type) {
    const key =
      Object.keys(defaultTypes).find((k) => defaultTypes[k] === type) || "INFO";
    return defaultColors[key] || defaultColors.INFO;
  }

  function show(options = {}) {
    const {
      message,
      type = TYPE.SUCCESS,
      position = POSITION.TOP,
      duration = 5000,
      delay = 300,
    } = options;

    if (!message) {
      console.warn("Snackbar: message param is required");
      return;
    }

    if (!styles[type]) {
      console.warn(`Snackbar: unknown type "${type}". Using fallback style.`);
    }

    queue.push({ message, type, position, duration, delay });
    if (!isShowing) _showNext();
  }

  function createCustom(key, style, value) {
    if (!key || typeof key !== "string")
      throw new Error("createCustom: key must be string");
    const val = value && typeof value === "string" ? value : key.toLowerCase();
    TYPE[key] = val;
    styles[val] = style;
  }

  function applyStyle(newConfig = {}) {
    Object.assign(config, newConfig);
  }

  function setPrefixForVariables(value) {
    if (!value || typeof value !== "string") return;
    config.pre = value;
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
        pointerEvents: config.pointerEvents,
        zIndex: "9999",
        display: "flex",
        flexDirection: "column",
        width: config.width,
        top: position === POSITION.TOP ? config.top : "unset",
        bottom: position === POSITION.BOTTOM ? config.bottom : "unset",
      });
      document.body.appendChild(container);
    }
    return container;
  }

  function _createSnackbar({ message, type, position }) {
    const snackbar = document.createElement("div");
    snackbar.textContent = message;

    const style = styles[type] || {};
    const fallback = getDefaultColorForType(type);

    Object.assign(snackbar.style, {
      backgroundColor: (style.bg ? style.bg() : undefined) ?? fallback.bg,
      color: (style.text ? style.text() : undefined) ?? fallback.text,
      padding: config.padding,
      borderRadius: config.borderRadius,
      border: config.border,
      boxShadow: config.shadow,
      opacity: 0,
      transform:
        position === POSITION.BOTTOM ? "translateY(100%)" : "translateY(-100%)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
      pointerEvents: config.pointerEvents,
    });

    return snackbar;
  }

  function _hideSnackbar(snackbar, container) {
    snackbar.style.opacity = "0";
    snackbar.style.transform = container.id.includes(POSITION.BOTTOM)
      ? "translateY(100%)"
      : "translateY(-100%)";

    snackbar.addEventListener(
      "transitionend",
      () => {
        snackbar.remove();
        if (!container.hasChildNodes()) container.remove();
        isShowing = false;
        _showNext();
      },
      { once: true },
    );
  }

  return {
    show,
    createCustom,
    applyStyle,
    setPrefixForVariables,
    TYPE,
    POSITION,
    TYPE_STYLES: styles,
    config,
  };
})();
