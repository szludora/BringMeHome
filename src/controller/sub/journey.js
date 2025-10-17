const { Collapse } = window.bootstrap;

/* ---------- Sample Made-Up Data ---------- */
/* Under normal conditions this object would come from a server. Creating a sample object for now for demo. */
const data = [
    { year: 2024, month: 11, type: '1', images: ["./assets/img/events/event_12_1.png"] },
    { year: 2024, month: 12, type: '3', images: ["./assets/img/events/event_11_1.png", "./assets/img/events/event_11_2.png", "./assets/img/events/event_11_3.png"] },
    { year: 2025, month: 1, type: '2', images: ["./assets/img/events/event_10_1.png"] },
    { year: 2025, month: 2, type: '4', images: ["./assets/img/events/event_9_1.png"] },
    { year: 2025, month: 3, type: '5', images: [] },
    { year: 2025, month: 4, type: '6', images: ["./assets/img/events/event_7_1.png"] },
    { year: 2025, month: 5, type: '7', images: ["./assets/img/events/event_6_1.png"] },
    { year: 2025, month: 6, type: '8', images: [] },
    { year: 2025, month: 7, type: '2', images: ["./assets/img/events/event_4_1.png"] },
    { year: 2025, month: 8, type: '3', images: ["./assets/img/events/event_3_1.png", "./assets/img/events/event_3_2.png"] },
    { year: 2025, month: 9, type: '5', images: ["./assets/img/events/event_2_1.png"] },
    { year: 2025, month: 10, type: '8', images: ["./assets/img/events/event_1_1.png", "./assets/img/events/event_1_2.png"] },
];

const TYPE_BADGE = {
    "1": "text-bg-primary",
    "2": "text-bg-secondary",
    "3": "text-bg-success",
    "4": "text-bg-warning",
    "5": "text-bg-info",
    "6": "text-bg-danger",
    "7": "text-bg-light border",
    "8": "text-bg-primary",
};

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const pad2 = n => String(n).padStart(2, "0");

function renderTimeline(items, { sort = "asc", groupByYear = true } = {}) {

    const sorted = [...items].sort((a,b)=>{
        const aKey = a.year*100 + a.month;
        const bKey = b.year*100 + b.month;
        return sort === "desc" ? bKey - aKey : aKey - bKey;
    });

    const parentList = document.getElementById("timeline");
    const mainTemplate = document.getElementById("timeline-item");

    parentList.innerHTML = "";
    let index = 0;
    sorted.forEach(it => {
        resolveEvent(it,parentList,mainTemplate,index);
        index++;
    });
}

// This function resolves an element of the data list.
function resolveEvent(event,parentList,mainTemplate, index){
    const node = mainTemplate.content.firstElementChild.cloneNode(true);
    resolveDateDisplay(node, event);
    resolveShortDescription(node, index);
    resolveBadge(node, event);
    const hiddenContainer = resolveInteractArea(node, index);
    resolveLongDescription(node, hiddenContainer, event, index);


    parentList.appendChild(node);
}

// This function update the date displayed for the given event.
function resolveDateDisplay(node, event){
    const timeEl = node.querySelector("time");
    timeEl.dateTime = `${event.year}-${pad2(event.month)}`;
    timeEl.innerHTML = `<span data-i18n="month-names.${monthNames[event.month - 1]}.short"></span> ${event.year}`;
}

// This function updates the short description for the given event.
function resolveShortDescription(node,index){
    const p = node.querySelector("p");
    p.setAttribute("data-i18n", "journey.events." + index + ".short");
}

// This function updates the badge positioned on the right side of the list for the given event.
function resolveBadge(node,event){
    const cat = TYPE_BADGE[event.type];
    const badge = node.querySelector(".badge");
    badge.className = `badge ${cat} align-self-start ms-3`;

    badge.setAttribute("data-i18n", "journey.eventTypes." + event.type);
}

// This function adds the dynamic behavior to show/hide the long description, when event is clicked.
function resolveInteractArea(node,index){
    const hiddenContainer = node.querySelector("[data-hidden-index]");

    // Mark the "To-Be-Clicked" (event.target) and the "To-Be-Revealed" item with the same marker based on index.
    hiddenContainer.setAttribute("data-hidden-index","content-" + index);
    node.setAttribute("data-event-index","content-" + index);

    node.addEventListener("click",(e) => {
        revealLongDescription(e);
    });

    return hiddenContainer;
}

// This function defines the exact behavior how long description is opening/closing.
// It also ensures that only one event is opened at a given time.
function revealLongDescription(event){
    // 1. Get the index based marking of the clicked object.
    const triggeredIndex = event.target.getAttribute("data-event-index");
    // 2. Iterate the "To-Be-Revealed" candidates.
    for(let hiddenEl of document.querySelectorAll("[data-hidden-index]")){
        // 3. Get the index based marking of the candidate.
        const contentIndex = hiddenEl.getAttribute("data-hidden-index");
        // If markings match -> open
        if(contentIndex === triggeredIndex){
            const c = new Collapse(hiddenEl, { toggle: false });
            c.toggle();
        }
        // If markings do not match, but is open -> close
        else if(hiddenEl.classList.contains("show")){
            const c = new Collapse(hiddenEl, { toggle: false });
            c.toggle();
        }
    }
}

// This function updates the long description content.
// Add the text, and only if need add image(s), and hide redundant elements based on the amount of provided images.
function resolveLongDescription(node, hiddenContainer, event, index){
    const hiddenContentTemplate = document.getElementById("hidden-content-multi-image");
    const contentNode = resolveDefaultDetails(hiddenContentTemplate, hiddenContainer,index);
    if(event.images.length > 0){
        const contentImg = contentNode.querySelector(".hidden-content-image");
        contentImg.setAttribute("src",event.images[0]);
        contentImg.setAttribute("data-image-index","0");

        if(event.images.length > 1){
            resolveGalleryCounter(contentNode,event,1);
            resolveNavigationButtons(contentNode, event);
        }else{
            removeMultiImageRelatedElements(contentNode);
        }
    }else{
        removeAllImageRelatedElements(contentNode);
    }
}

// This function adds the long description and append the content to the DOM.
function resolveDefaultDetails(hiddenContentTemplate, hiddenContainer, index){
    const contentNode = hiddenContentTemplate.content.firstElementChild.cloneNode(true);
    const contentHolder = contentNode.querySelector(".hidden-content");
    contentHolder.setAttribute("data-i18n","journey.events." + index + ".long");
    contentHolder.addEventListener("click", (event) => {
        event.stopPropagation();
    });
    hiddenContainer.appendChild(contentNode);
    return contentNode;
}

// Hides the navigation buttons and the gallery counter elements.
function removeMultiImageRelatedElements(contentNode){
    for(let btn of contentNode.querySelectorAll("button")){
        btn.classList.toggle("hide-this");
    }
    contentNode.querySelector(".gallery-counter").classList.toggle("hide-this");
}

// Hides the whole image related element.
function removeAllImageRelatedElements(contentNode){
    contentNode.querySelector(".position-relative").classList.toggle("hide-this");
}

// This function updates the Gallery Counter element with correct value
function resolveGalleryCounter(contentNode,event, index){
    const galleryCounter = contentNode.querySelector("#gallery-counter");
    galleryCounter.innerText = index + "/" + event.images.length;
}

// This function defines what should happen when an gallery navigation button is pressed.
function resolveNavigationButtons(contentNode, event){
    const navigationButtons = contentNode.querySelectorAll("button");
    for(let navigationButton of navigationButtons){
        navigationButton.addEventListener("click",(e) => {
            e.stopPropagation();
            navigateImage(contentNode, event, e);
        });
    }
}

// This function defines the exact logic how images are updated and update counters.
function navigateImage(contentNode, event, e){
    try{
        const contentImg = contentNode.querySelector(".hidden-content-image");
        const direction = e.target.getAttribute("data-gallery-action") === "next";
        let imageIndex = Number(contentImg.getAttribute("data-image-index"));
        if(direction){
            if(imageIndex === event.images.length - 1){
                imageIndex = 0;
            }else{
                imageIndex++;
            }
        }else{
            if(imageIndex === 0){
                imageIndex = event.images.length - 1;
            }else{
                imageIndex--;
            }
        }
        resolveGalleryCounter(contentNode,event,imageIndex + 1);
        contentImg.setAttribute("data-image-index", imageIndex);
        contentImg.setAttribute("src",event.images[imageIndex]);
    }catch (error){
        console.warn("Something went wrong when updating the image. " + error);
    }
}

export function createTimeline(){
    renderTimeline(data, { sort: "desc", groupByYear: false });
}

