import {getValueForKey} from "../i18n/i18n.js";



export async function loadGlobalForm(formID) {

    // Load Form
    const html_form = await fetch(`/src/global_form/${formID}/global_form.html`);
    const html_form_content = await html_form.text();
    document.getElementById("sample_form_container").innerHTML = html_form_content;

    // Load Form Open/Close button
    const html_btn = await fetch(`/src/global_form/form_button.html`);
    const html_btn_content = await html_btn.text();
    document.getElementById("sample_form_container").innerHTML += html_btn_content;

    // Set default label for button based on selected language.
    let fab = document.getElementById("visibility_btn");
    const label = getValueForKey("openForm");
    fab.setAttribute('aria-label', label);
    fab.title = label;
}

export async function changeFormVisibility() {
    let myForm = document.getElementById("sample_form");
    let isOpen = myForm.style.display === "block";
    myForm.style.display = isOpen ? "none" : "block";
    myForm.style.pointerEvents  = isOpen ? "none" : "auto";
    myForm.reset();

    let fab = document.getElementById("visibility_btn");
    fab.classList.toggle('is-open', !isOpen);
    fab.setAttribute('aria-expanded', String(!isOpen));
    const label = !isOpen ? getValueForKey("closeForm") : getValueForKey("openForm");
    fab.setAttribute('aria-label', label);
    fab.title = label;
}