// events.js

import { loadLanguage } from "../i18n/i18n.js";

export function initEvents() {
    document.addEventListener("click", (e) => {
        if (e.target.matches("[data-setlang]")) {
            const currentButtonLang = e.target.getAttribute("data-setlang");
            const newLang = currentButtonLang === "hu" ? "en" : "hu";
            loadLanguage(newLang);
            e.target.setAttribute("data-setlang", newLang);
        }
    });

    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('is-flipped');
        });
    });
}