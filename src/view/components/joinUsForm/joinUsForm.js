import { initLanguage } from "../../../i18n/i18n.js";

export async function onLoad(){
    initLanguage();
}

export async function unLoad(){
    document.getElementById("show-join-us-btn").disabled = false;
}