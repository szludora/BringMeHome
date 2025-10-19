# Snackbar 🍫

A lightweight, zero-dependency snackbar/notification utility for your web projects.

---

## ✨ Features

- 🎨 Simple API with runtime style customization
- ↕️ Top or bottom positioning
- 💡 Built-in types: `SUCCESS`, `ERROR`, `INFO`, `WARNING`
- ➕ Add custom types easily
- ⏱️ Auto-hide with duration + delay
- 📚 Multiple snackbars stack gracefully

---

## ⚡ Usage

```js
import { Snackbar } from "snackbar";

// Basic usage
Snackbar.show({ message: "This snackbar uses default values" });

Snackbar.show({
  message: "Data saved successfully! 🎉",
  type: Snackbar.TYPE.SUCCESS,
  position: Snackbar.POSITION.TOP,
  duration: 4000,
  delay: 200,
});
```

---

## 🎨 Runtime Customization

```js
// Change default styles at runtime
Snackbar.applyStyle({
  padding: "2rem 3rem",
  borderRadius: "12px",
  width: "70%",
});

// Add a custom type dynamically
Snackbar.createCustom("PURPLE", {
  bg: () => "#d6a0f0",
  text: () => "#2a004f",
  position: Snackbar.POSITION.TOP,
});

// Show custom type
Snackbar.show({
  message: "Custom purple snack! 💜",
  type: Snackbar.TYPE.PURPLE,
});
```

---

## 🌍 Global CSS Customization

You can override any default style via CSS variables in `:root`:

```css
:root {
  --snack-padding: 2rem 3rem;
  --snack-borderRadius: 12px;
  --snack-border: 2px solid #222;
  --snack-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  --snack-top: 5rem;
  --snack-bottom: 2rem;
  --snack-width: 80%;
  --snack-pointerEvents-auto: auto;

  /* Type colors */
  --snack-bg-success: #a0f0c4;
  --snack-text-success: #054321;
  --snack-bg-error: #fcbfbf;
  --snack-text-error: #4f0808;
  --snack-bg-warning: #fdff88;
  --snack-text-warning: #4e4f08;
  --snack-bg-info: #a0e8f0;
  --snack-text-info: #0f575f;

  /* Custom type example */
  --snack-bg-purple: #d6a0f0;
  --snack-text-purple: #2a004f;
}
```

> 💡 Runtime JS `applyStyle` modifies values on-the-fly, while `:root` CSS allows global theming without touching JS.

---

## 🔑 Constants

```js
export const POSITION = { BOTTOM: "bottom", TOP: "top" };

export const TYPE = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
};
```

---

## 📝 Notes

- ⚠️ `message` is required
- 🛠️ Unknown `type` or `position` logs a warning but does not break the app
- 🧹 Containers auto-remove when empty
- 🏗️ Extendable at runtime via `TYPE` and `createCustom()`

---

## 📝 License

This project is licensed under the **MIT License**.

You are free to:
- Use it in personal or commercial projects
- Modify it for your own needs
- Share it with others

Conditions:

Include the original license and copyright notice (© 2025 [SzluDora](https://github.com/szludora/)) in any distributed version.

Full license text can be found in the LICENSE
file.
