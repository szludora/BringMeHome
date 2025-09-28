const pre = "snack";

/*

Don't forget to change the 'snack' prefix if you ever change the default prefix value.
'pre' is the base name for all CSS variables, e.g., "snack".
Use the `root()` helper to generate CSS variable names consistently:
root({ attr: "bg", type: "success" }) -> "--snack-bg-success"
root({ attr: "padding" }) -> "--snack-padding"

*/

const root = ({ pre = "snack", attr, type = null }) => {
  if (!type) return `--${pre}-${attr}`;
  return `--${pre}-${attr}-${type}`;
};

/*

---- DEFAULT CONFIG ----
These are the default styles for all snackbars.
You can override them globally using CSS variables in :root, e.g.:
:root {
    --snack-padding: 1rem 2rem;
    --snack-borderRadius: 5px;
    --snack-border: 1px solid #000;
    --snack-shadow: 0 2px 6px rgba(0,0,0,0.2);
    --snack-top: 4.5rem;
    --snack-bottom: 1rem;
    --snack-width: 95%;
    --snack-pointerEvents-auto: auto;
}

*/

export const DEFAULT = {
  padding: getCssVar(root({ attr: "padding" }), "1rem 2rem"),
  borderRadius: getCssVar(root({ attr: "borderRadius" }), "5px"),
  border: getCssVar(root({ attr: "border" }), "5px"),
  shadow: getCssVar(root({ attr: "shadow" }), "0 2px 6px rgba(0,0,0,0.2)"),
  top: getCssVar(root({ attr: "top" }), "4.5rem"),
  bottom: getCssVar(root({ attr: "bottom" }), "1rem"),
  width: getCssVar(root({ attr: "width" }), "95%"),
  pointerEvents: getCssVar(root({ attr: "pointerEvents-auto" }), "auto"),
};

// ---- TYPES ----
// Built-in types; add new types by extending TYPE and TYPE_STYLES
export const TYPE = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  // Example for custom type:
  // CUSTOM: "custom",
};

// ---- POSITION ----
// Do not change these; use them for positioning snackbars
export const POSITION = {
  BOTTOM: "bottom",
  TOP: "top",
};

// ---- TYPE STYLES ----
// Each type has a background, text color, and default position
// Hint: override colors in :root using `--snack-bg-TYPE` and `--snack-text-TYPE`
export const TYPE_STYLES = {
  [TYPE.SUCCESS]: {
    bg: () => getCssVar(root({ attr: "bg", type: TYPE.SUCCESS }), _DefaultColors[TYPE.SUCCESS].bg),
    text: () => getCssVar(root({ attr: "text", type: TYPE.SUCCESS }), _DefaultColors[TYPE.SUCCESS].text),
    position: POSITION.BOTTOM,
  },
  [TYPE.ERROR]: {
    bg: () => getCssVar(root({ attr: "bg", type: TYPE.ERROR }), _DefaultColors[TYPE.ERROR].bg),
    text: () => getCssVar(root({ attr: "text", type: TYPE.ERROR }), _DefaultColors[TYPE.ERROR].text),
    position: POSITION.BOTTOM,
  },
  [TYPE.WARNING]: {
    bg: () => getCssVar(root({ attr: "bg", type: TYPE.WARNING }), _DefaultColors[TYPE.WARNING].bg),
    text: () => getCssVar(root({ attr: "text", type: TYPE.WARNING }), _DefaultColors[TYPE.WARNING].text),
    position: POSITION.TOP,
  },
  [TYPE.INFO]: {
    bg: () => getCssVar(root({ attr: "bg", type: TYPE.INFO }), _DefaultColors[TYPE.INFO].bg),
    text: () => getCssVar(root({ attr: "text", type: TYPE.INFO }), _DefaultColors[TYPE.INFO].text),
    position: POSITION.TOP,
  },
  // Example of adding a custom type:
  // [TYPE.CUSTOM]: {
  //   bg: () => getCssVar(root({ attr: "bg", type: TYPE.CUSTOM }), "#ff0"),
  //   text: () => getCssVar(root({ attr: "text", type: TYPE.CUSTOM }), "#000"),
  //   position: POSITION.TOP,
  // },
};

// ---- DEFAULT COLORS ----
// Fallback colors if CSS variables are not defined
const _DefaultColors = {
  [TYPE.SUCCESS]: { bg: "#a0f0c4", text: "#054321" },
  [TYPE.ERROR]: { bg: "#fcbfbf", text: "#4f0808" },
  [TYPE.WARNING]: { bg: "#fdff88", text: "#4e4f08" },
  [TYPE.INFO]: { bg: "#a0e8f0", text: "#0f575f" },
};

// ---- HELPER FUNCTION ----
// Use this to fetch CSS variables with a fallback value
function getCssVar(name, fallback) {
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name) ||
    fallback
  );
}
