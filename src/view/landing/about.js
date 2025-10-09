import {loadDynamicContent, destroyDynamicContent} from "/src/controller/load.js";

export async function onLoad(){
    // TODO
}

export async function unLoad(){
    // TODO
}

export function showJoinUsForm(event){
    loadDynamicContent("/src/view/pages/joinUsForm/joinUsForm.html",document.getElementById("join-us-form-container"));
    event.target.disabled = true;
}

export function abaddonJoinUsForm(){
    console.log("I give up on you...for now.");
    destroyDynamicContent(document.getElementById("join-us-form-container"));
}

function notExposedFunction(){
    // TODO This is used for internal logic
}