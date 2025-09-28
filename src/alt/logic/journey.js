/* ---------- Sample Made-Up Data ---------- */
const data = [
    { year: 2024, month: 11, type: '1' },
    { year: 2024, month: 12, type: '3' },
    { year: 2025, month: 1, type: '2' },
    { year: 2025, month: 2, type: '4' },
    { year: 2025, month: 3, type: '5' },
    { year: 2025, month: 4, type: '6' },
    { year: 2025, month: 5, type: '7' },
    { year: 2025, month: 6, type: '8' },
    { year: 2025, month: 7, type: '2' },
    { year: 2025, month: 8, type: '3' },
    { year: 2025, month: 9, type: '5' },
    { year: 2025, month: 10, type: '8' },
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

        const timeEl = node.querySelector(".timeline_list_date");
        timeEl.dateTime = `${it.year}-${pad2(it.month)}`;
        timeEl.textContent = `${monthNames[it.month - 1]} ${it.year}`;

        const p = node.querySelector(".timeline_list_content");
        p.setAttribute("data-i18n", "journey.events." + index);

        const cat = TYPE_BADGE[it.type];
        const badge = node.querySelector(".badge");
        badge.className = `badge ${cat} align-self-start ms-3`;

        badge.setAttribute("data-i18n", "journey.eventTypes." + it.type);
        list.appendChild(node);
        index++;
    });
}

export function createTimeline(){
    renderTimeline(data, { sort: "asc", groupByYear: false });
}

