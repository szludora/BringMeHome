# Snackbar 🍫

A lightweight, zero-dependency snackbar/notification utility for your web projects.
Import the JS, and you're ready to roll. 🎉

---

## ✨ Features

- 🎨 Simple API with customizable options
- ↕️ Top or bottom positioning
- 💡 Built-in types: `SUCCESS`, `ERROR`, `INFO`, `WARNING` (easy to extend)
- ⏱️ Auto-hide with duration + delay
- 📚 Multiple snackbars stack gracefully
- 🛡️ Private helpers; public API only exposes `show`
- 🎨 Fully configurable via CSS variables
- ➕ Add custom types easily

---

## ⚙️ Parameters

| Name       | Type     | Default        | Description                     |
| ---------- | -------- | -------------- | ------------------------------- |
| `message`  | string   | **required**   | Text shown in the snackbar      |
| `position` | POSITION | `POSITION.TOP` | Where to display: top or bottom |
| `type`     | TYPE     | `TYPE.SUCCESS` | Snackbar style                  |
| `duration` | number   | 5000 (ms)      | How long it stays visible       |
| `delay`    | number   | 300 (ms)       | Delay before showing            |

---

## 📦 Setup

```js
import { Snackbar, TYPE, POSITION } from "./snackbar.js";

Snackbar.show({
  message: "Data saved successfully! 🎉",
  type: TYPE.SUCCESS,
  position: POSITION.TOP,
  duration: 4000,
  delay: 200,
});
```

---

## 🎨 CSS Configuration

Globally override defaults in `:root`:

```css
:root {
  --snack-padding: 1rem 2rem;
  --snack-borderRadius: 5px;
  --snack-border: 1px solid #000;
  --snack-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  --snack-top: 4.5rem;
  --snack-bottom: 1rem;
  --snack-width: 95%;
  --snack-pointerEvents-auto: auto;

  --snack-bg-success: #a0f0c4;
  --snack-text-success: #054321;
  --snack-bg-error: #fcbfbf;
  --snack-text-error: #4f0808;
  --snack-bg-warning: #fdff88;
  --snack-text-warning: #4e4f08;
  --snack-bg-info: #a0e8f0;
  --snack-text-info: #0f575f;

  /* Custom type example */
  --snack-bg-custom: #ff0;
  --snack-text-custom: #000;
}
```

---

## 🔑 Constants

```js
export const POSITION = { BOTTOM: "bottom", TOP: "top" };
export const TYPE = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
  // CUSTOM: "custom"
};
```

---

## 🧪 Examples

```js
// Basic
Snackbar.show({
  message: "Oops! ⚠️",
  type: TYPE.ERROR,
  position: POSITION.BOTTOM,
});

// Multiple
Snackbar.show({ message: "First", type: TYPE.INFO });
Snackbar.show({ message: "Second", type: TYPE.SUCCESS });

// Custom duration & position
Snackbar.show({
  message: "Top warning ⚠️",
  type: TYPE.WARNING,
  position: POSITION.TOP,
  duration: 5000,
  delay: 100,
});
```

---

## 📝 Notes

- ⚠️ `message` is mandatory
- 🛠️ Invalid `position` or `type` logs a warning but doesn’t break the app
- 🧹 Multiple snackbars stack; containers auto-remove when empty
- ➕ Extendable via `TYPE` and `TYPE_STYLES`
- Private helpers prevent external modification
