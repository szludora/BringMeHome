const { Collapse } = window.bootstrap;

/* ---------- Sample Made-Up Data ---------- */
/* Under normal conditions this object would come from a server. Creating a sample object for now for demo. */
const data = [
    { year: 2024, month: 11, type: '1', images: ["/assets/img/events/event_12_1.png"] },
    { year: 2024, month: 12, type: '3', images: ["/assets/img/events/event_11_1.png", "/assets/img/events/event_11_2.png", "/assets/img/events/event_11_3.png"] },
    { year: 2025, month: 1, type: '2', images: ["/assets/img/events/event_10_1.png"] },
    { year: 2025, month: 2, type: '4', images: ["/assets/img/events/event_9_1.png"] },
    { year: 2025, month: 3, type: '5', images: [] },
    { year: 2025, month: 4, type: '6', images: ["/assets/img/events/event_7_1.png"] },
    { year: 2025, month: 5, type: '7', images: ["/assets/img/events/event_6_1.png"] },
    { year: 2025, month: 6, type: '8', images: [] },
    { year: 2025, month: 7, type: '2', images: ["/assets/img/events/event_4_1.png"] },
    { year: 2025, month: 8, type: '3', images: ["/assets/img/events/event_3_1.png", "/assets/img/events/event_3_2.png"] },
    { year: 2025, month: 9, type: '5', images: ["/assets/img/events/event_2_1.png"] },
    { year: 2025, month: 10, type: '8', images: ["/assets/img/events/event_1_1.png", "/assets/img/events/event_1_2.png"] },
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
    const list = document.getElementById("timeline");
    const tpl = document.getElementById("timeline-item");

    const sorted = [...items].sort((a,b)=>{
        const aKey = a.year*100 + a.month;
        const bKey = b.year*100 + b.month;
        return sort === "desc" ? bKey - aKey : aKey - bKey;
    });

    list.innerHTML = "";
    let lastYear = null;
    let index = 0;
    sorted.forEach(it => {
        if (groupByYear && it.year !== lastYear) {
            const h = document.createElement("h6");
            h.className = "text-uppercase text-body-secondary mt-4 mb-2";
            h.textContent = it.year;
            list.appendChild(h);
            lastYear = it.year;
        }

        const node = tpl.content.firstElementChild.cloneNode(true);

        const timeEl = node.querySelector("time");
        timeEl.dateTime = `${it.year}-${pad2(it.month)}`;
        timeEl.innerHTML = `<span data-i18n="month-names.${monthNames[it.month - 1]}.short"></span> ${it.year}`;
        // timeEl.textContent = `${monthNames[it.month - 1]} ${it.year}`;

        const p = node.querySelector("p");
        p.setAttribute("data-i18n", "journey.events." + index + ".short");

        const cat = TYPE_BADGE[it.type];
        const badge = node.querySelector(".badge");
        badge.className = `badge ${cat} align-self-start ms-3`;

        badge.setAttribute("data-i18n", "journey.eventTypes." + it.type);


        const hiddenContainer = node.querySelector("[data-hidden-index]");
        hiddenContainer.setAttribute("data-hidden-index","content-" + index);
        const ref = node.querySelector("a");
        ref.setAttribute("data-i18n","read-more");
        node.setAttribute("data-event-index","content-" + index);
        node.addEventListener("click",(event) => {
            const triggeredIndex = event.target.getAttribute("data-event-index");
            for(let hiddenEl of document.querySelectorAll("[data-hidden-index]")){
                const contentIndex = hiddenEl.getAttribute("data-hidden-index");
                if(contentIndex === triggeredIndex){
                    const c = new Collapse(hiddenEl, { toggle: false });
                    c.toggle();
                }else{
                    if(hiddenEl.classList.contains("show")){
                        const c = new Collapse(hiddenEl, { toggle: false });
                        c.toggle();
                    }
                }
            }
        });
        if(!it.images || it.images.length === 0){
            const hiddenContentTemplate = document.getElementById("hidden-content-no-image");
            addDetailedDescription(hiddenContentTemplate, hiddenContainer, index);
        }else if(it.images && it.images.length === 1){
            const hiddenContentTemplate = document.getElementById("hidden-content-one-image");
            const contentNode = addDetailedDescription(hiddenContentTemplate, hiddenContainer, index);
            const contentImg = contentNode.querySelector(".hidden-content-image");
            contentImg.setAttribute("src",it.images[0]);
        }else{
            const hiddenContentTemplate = document.getElementById("hidden-content-multi-image");
            const contentNode = addDetailedDescription(hiddenContentTemplate, hiddenContainer,index);
            const contentImg = contentNode.querySelector(".hidden-content-image");
            contentImg.setAttribute("src",it.images[0]);
            contentImg.setAttribute("data-image-index","0");
            const navigationButtons = contentNode.querySelectorAll("button");
            const galleryCounter = contentNode.querySelector("#gallery-counter");
            galleryCounter.innerText = 1 + "/" + it.images.length;
            for(let navigationButton of navigationButtons){
                navigationButton.addEventListener("click",(event) => {
                    event.stopPropagation();
                    try{
                        const contentImg = contentNode.querySelector(".hidden-content-image");
                        const galleryAction = event.target.getAttribute("data-gallery-action");
                        let imageIndex = Number(contentImg.getAttribute("data-image-index"));
                        if(galleryAction === "prev"){
                            if(imageIndex === 0){
                                imageIndex = it.images.length - 1;
                            }else{
                                imageIndex--;
                            }

                        }else if(galleryAction === "next"){
                            if(imageIndex === it.images.length - 1){
                                imageIndex = 0;
                            }else{
                                imageIndex++;
                            }
                        }
                        const galleryCounter = contentNode.querySelector("#gallery-counter");
                        galleryCounter.innerText = (imageIndex + 1) + "/" + it.images.length;
                        contentImg.setAttribute("data-image-index", imageIndex);
                        contentImg.setAttribute("src",it.images[imageIndex]);
                    }catch (error){
                        console.warn("Something went wrong when updating the image.");
                    }

                });
            }
        }

        list.appendChild(node);
        index++;
    });
}

function addDetailedDescription(hiddenContentTemplate, hiddenContainer, index){
    const contentNode = hiddenContentTemplate.content.firstElementChild.cloneNode(true);
    const contentHolder = contentNode.querySelector(".hidden-content");
    contentHolder.setAttribute("data-i18n","journey.events." + index + ".long");
    hiddenContainer.appendChild(contentNode);
    return contentNode;
}

export function createTimeline(){
    renderTimeline(data, { sort: "desc", groupByYear: false });
}

