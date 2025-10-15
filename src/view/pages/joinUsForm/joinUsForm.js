import { initLanguage } from "../../../i18n/i18n.js";

export async function onLoad(){
    initLanguage();
}

export async function unLoad(){
    console.log("Unloading join us form.");
    document.getElementById("show-join-us-btn").disabled = false;
}