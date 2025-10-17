# Bring Me Home - University Project
## Project Description
**[Bring Me Home](https://szludora.github.io/BringMeHome/)** is a simple web application (HTML, CSS, JS) created as a university assignment.
It represents a single animal shelter where users can view animals and potentially adopt them.

Click [here](https://szludora.github.io/BringMeHome/) to check the page.


## Collaborators
- Ladóczki-Szabó Ágnes Lilla
- Nándor Segyevy
- Szlucska Dóra


## Features
Currently, the site is under development, but it includes:
- Language switching (Hungarian / English) via a button
- Dynamic text translation using JSON-based i18n
- Meta description and keywords adapted to the selected language

## Folder Structure
* [assets](./assets)
   * [css](./assets/css)
   * [img](./assets/img)
 * [src](./src)
   * [controller](./src/controller)
      * [events.js](./src/controller/events.js)
   * [model](./src/model)
   * [view](./src/view)
      * [bodyLoader](./src/view/bodyLoader.js)
   * [i18n](./src/i18n)
     * [hu.json](./src/i18n/hu.json)
     * [en.json](./src/i18n/en.json)
   * [main.js](./src/main.js)
 * [index.hu.html](./index.hu.html)
 * [index.en.html](./index.en.html)


## How to Run Locally
1. Clone the repository
```bash
git clone https://github.com/szludora/bringmehome.git
```
2. Run `npm install` and `npm build-snackbar`
3. Use VS Code with the `Live Server` plugin and click `Go Live` button at the right bottom of the VS Code window.

## Technologies
- HTML5
- CSS3 + Bootstrap 5
- Vanilla JavaScript (ES6 modules)
- JSON-based internationalization (i18n)

---

**Note:** This project is a **university assignment** demonstrating front-end development concepts, responsive layout, and multi-language support for a shelter adoption platform.
