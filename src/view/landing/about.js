import {loadDynamicContent, destroyDynamicContent} from "/src/controller/load.js";

export async function onLoad(){
    // TODO
}

export async function unLoad(){
    // TODO
}

export function showJoinUsForm(event){
    loadDynamicContent("/src/view/components/joinUsForm/joinUsForm.html",document.getElementById("join-us-form-container"));
    event.target.disabled = true;
}

export function abandonJoinUsForm(){
    document.getElementById("sample_form").classList.toggle("slideBottomToTop");
    setTimeout(() => {
        destroyDynamicContent(document.getElementById("join-us-form-container"));
    },1000);
}

export function submitJoinUsForm(e){
    e.preventDefault();

    const form = document.getElementById('sample_form');


    if(form.checkValidity()){
        const fd = new FormData(form);
        const data = Object.fromEntries(fd.entries());
        if(validateJoinUsForm(data)){
            document.getElementById("sample_form").classList.toggle("slideBottomToTop");
            setTimeout(() => {
                destroyDynamicContent(document.getElementById("join-us-form-container"));
            },900);
        }
    }else{
        e.stopPropagation();
        form.reportValidity();
    }


}

function validateJoinUsForm(data){
    if(!isCapitalizedNameSimple(data.fullName)){
        const nameInput = document.getElementById("full_name_input");
        nameInput.setCustomValidity('Please provide a valid name.');
        nameInput.reportValidity();
        return false;
    }
    return true;
}

function isCapitalizedNameSimple(value, locale = 'hu-HU') {
    if (!value) return false;
    const trimmed = value.trim().replace(/\s+/g, ' '); // collapse spaces
    const words = trimmed.split(' ');

    return words.every(word => {
        const segments = word.split('-');
        return segments.every(seg => isCapitalizedSegment(seg, locale));
    });
}

function isCapitalizedSegment(seg, locale = 'hu-HU') {
    if (!seg) return false;
    const chars = Array.from(seg);
    const first = chars[0];
    const rest = chars.slice(1);
    if (!isLetter(first, locale)) return false;
    if (first !== first.toLocaleUpperCase(locale)){
        return false;
    }
    for (const ch of rest) {
        if (!isLetter(ch, locale)) return false;
        if (ch !== ch.toLocaleLowerCase(locale)) return false;
    }
    return true;
}

function isLetter(ch, locale = 'hu-HU') {
    return ch.toLocaleLowerCase(locale) !== ch.toLocaleUpperCase(locale);
}

