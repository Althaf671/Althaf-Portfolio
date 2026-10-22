import { Animation } from "./animation.js";
import { 
    ASSET_TYPE,
    IMAGE,
    NAV_ITEMS, 
    SVG,
    CAPABILITY_ICONS
} from "./constants.js";
import { Helper } from "./helper.js";
import { Worker } from "./worker.js";

// deklarasi class pembantu
const helper = new Helper();
const animation = new Animation();
const worker = new Worker();

// registry
animation.initSmoothScroll();
worker.register();

// set tahun sekarang
let currentYear = document.querySelector("#copyright-year");
currentYear.textContent = helper.getCurrentYear();
console.log(currentYear);

// set jam dan kota
let currentTime = document.querySelector("#current-time");
currentTime.textContent = helper.getCurrentTime();
console.log(currentTime);

// glasmo header controller
const header = document.querySelector('header');
const BatasTrigger = 20; 

const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > BatasTrigger);
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// set nav item 
let navItems = document.querySelector("#nav-items")
NAV_ITEMS.forEach((item) => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.textContent = item.name;
    a.href = item.id;
    a.className = "text-muted";

    li.appendChild(a);
    navItems.appendChild(li);
});
console.log(navItems);

// mobile menu hamburger
const menuButton = document.querySelector("#menu-btn");
const menuOverlay = document.querySelector("#menu-overlay");
const menuItems = document.querySelector("#menu-items");

const createMenuItem = (number, name, href) => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    const index = document.createElement("span");
    index.className = "menu-index";
    index.textContent = String(number).padStart(2, "0");

    const label = document.createElement("span");
    label.className = "menu-label";
    label.textContent = name;

    const arrow = document.createElement("span");
    arrow.className = "menu-arrow";
    arrow.textContent = "↗";

    a.href = href;
    a.append(index, label, arrow);
    li.appendChild(a);

    return li;
};

NAV_ITEMS.forEach((item, i) => {
    menuItems.appendChild(createMenuItem(i + 1, item.name, item.id));
});

const githubMenuItem = createMenuItem(NAV_ITEMS.length + 1, "My Github", "#");
const githubMenuLink = githubMenuItem.querySelector("a");
githubMenuLink.id = "menu-github";
githubMenuLink.target = "_blank";
githubMenuLink.rel = "noopener";
menuItems.appendChild(githubMenuItem);

const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuOverlay.setAttribute("aria-hidden", String(!open));
};

menuButton.addEventListener("click", () => {
    setMenu(!document.body.classList.contains("menu-open"));
});

menuOverlay.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
        setMenu(false);
    }
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setMenu(false);
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        setMenu(false);
    }
});

// bg music control
const playIconContainer = document.querySelector("#play-icon");

const playIcon = helper.loadImage(SVG.PLAY_ICON, ASSET_TYPE.SVG);
playIcon.classList.add("icon-play");
playIconContainer.appendChild(playIcon);

const stopIcon = helper.loadImage(SVG.STOP_ICON, ASSET_TYPE.SVG);
stopIcon.classList.add("icon-stop");
playIconContainer.appendChild(stopIcon);

const audio = document.querySelector("#background-audio");
const toggle = document.querySelector("#play-bg");

let shouldResumeAudio = false;

toggle.addEventListener("click", () => {
    if (audio.paused) {
        helper.playAudio(audio, toggle);
    } else {
        helper.stopAudio(audio, toggle);
    }
});

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        shouldResumeAudio = !audio.paused;

        if (shouldResumeAudio) {
            helper.stopAudio(audio, toggle);
        }
    } else if (shouldResumeAudio) {
        helper.playAudio(audio, toggle);
    }
});

helper.playAudio(audio, toggle);

// set animasi scroll progress
const percentage = document.querySelector("#scroll-percentage");
const progressBar = document.querySelector("#scroll-progress-bar");

window.addEventListener("scroll", () => {
    animation.updateScrollProgress(percentage, progressBar);
});

window.addEventListener("resize", () => {
    animation.updateScrollProgress(percentage, progressBar);
});

animation.updateScrollProgress(percentage, progressBar);

// back to top
const backToTop = document.querySelector("#back-to-top");

backToTop.addEventListener("click", () => {
    animation.scrollToPosition(0);
});

// load image
const container = document.querySelector("#copyright-icon");
const image = helper.loadImage(SVG.COPYRIGHT, ASSET_TYPE.SVG);
container.appendChild(image);

// data loader
helper.loadData("./misc/data.json")
    .then((data) => {
        // hero
        const shortDescription = document.querySelector("#short-description");
        const roleList = document.querySelector(".list-role-domicile ol");
        const heroName = document.querySelector("#hero-name");
        const heroLinkedIn = document.querySelector("#hero-linkedin");

        // short description
        shortDescription.textContent = data.about["short-description"];

        // role
        const roleItem = document.createElement("li");
        const roleLabel = document.createElement("span");
        roleLabel.className = "role-label";
        roleLabel.textContent = "Role";
        const roleValue = document.createElement("span");
        roleValue.textContent = data.about.role[0];
        roleItem.append(roleLabel, roleValue);
        roleList.appendChild(roleItem);

        // experience
        const experienceItem = document.createElement("li");
        const experienceLabel = document.createElement("span");
        experienceLabel.className = "role-label";
        experienceLabel.textContent = "Experience";
        const experienceValue = document.createElement("span");
        experienceValue.textContent = data.about.yoe;
        experienceItem.append(experienceLabel, experienceValue);
        roleList.appendChild(experienceItem);

        // domicile
        const domicileItem = document.createElement("li");
        const domicileLabel = document.createElement("span");
        domicileLabel.className = "role-label";
        domicileLabel.textContent = "Based in";
        const domicileValue = document.createElement("span");
        domicileValue.textContent = data.about.domicile;
        domicileItem.append(domicileLabel, domicileValue);
        roleList.appendChild(domicileItem);

        const nameParts = data.about.name.split(" ");

        heroName.textContent = "";

        const namePart1 = document.createElement("span");
        namePart1.textContent = nameParts[0];
        heroName.appendChild(namePart1);

        const namePart2 = document.createElement("span");
        namePart2.textContent = nameParts[1];
        heroName.appendChild(namePart2);

        const namePart3 = document.createElement("span");
        namePart3.textContent = nameParts[2];
        heroName.appendChild(namePart3);

        // linkedin
        const linkedInContact = data.about.contact.find((item) => item.linkedIn);
        heroLinkedIn.href = linkedInContact.linkedIn;

        // skills
        const skillsGrid = document.querySelector(".skills-grid");

        data.skills.forEach((item) => {
            const card = document.createElement("div");
            card.className = "capability";

            const iconBox = document.createElement("span");
            iconBox.className = "capability__icon";

            const icon = helper.loadImage(CAPABILITY_ICONS[item.icon], ASSET_TYPE.SVG);
            icon.alt = "";
            iconBox.appendChild(icon);

            const body = document.createElement("div");
            body.className = "capability__body";

            const title = document.createElement("h4");
            title.textContent = item.name;

            const description = document.createElement("p");
            description.textContent = item.description;

            body.append(title, description);

            card.append(iconBox, body);
            skillsGrid.appendChild(card);
        });

        // techstacks
        const marqueeTrack = document.querySelector("#tech-marquee-track");

        for (let copy = 0; copy < 2; copy++) {
            const group = document.createElement("div");
            group.className = "tech-marquee__group";

            data.techstacks.forEach((name) => {
                const item = document.createElement("span");
                item.className = "tech-marquee__item";
                item.textContent = name;
                group.appendChild(item);
            });

            marqueeTrack.appendChild(group);
        }

        // design approach
        const approachTemplate = document.querySelector(".approach-card");
        const approachBlank = approachTemplate.cloneNode(true);
        let lastApproachCard = approachTemplate;

        data["design-approach"].forEach((approach, i) => {
            let card = approachTemplate;

            if (i > 0) {
                card = approachBlank.cloneNode(true);
                card.removeAttribute("id");
                card.removeAttribute("aria-labelledby");
                card.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
                card.querySelector(".section-label").remove();

                lastApproachCard.after(card);
                lastApproachCard = card;
            }

            card.querySelector(".approach-card__title").textContent = approach.header.title;
            card.querySelector(".approach-card__lead").textContent = approach.header.lead;

            const description = card.querySelector(".approach-card__description");
            const [textBefore, textAfter] = approach.description.split(approach.highlight);
            const highlight = document.createElement("strong");
            highlight.textContent = approach.highlight;
            description.append(textBefore, highlight, textAfter);

            const details = card.querySelector(".approach-card__details");
            approach.details.forEach((text) => {
                const li = document.createElement("li");
                li.textContent = text;
                details.appendChild(li);
            });

            card.querySelector(".approach-card__footer span:first-child").textContent = approach.footer.label;
            card.querySelector(".approach-card__index").textContent = approach.footer.hint;

            const stack = card.querySelector(".approach-stack");

            approach.images.forEach((item) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "approach-stack__item";
                button.setAttribute("aria-label", "Tampilkan contoh kode berikutnya");

                const img = helper.loadImage(item.name, ASSET_TYPE.PNG);
                img.alt = item.alt;
                img.loading = "lazy";

                button.appendChild(img);
                stack.appendChild(button);
            });

            const stackItems = [...stack.children];
            let active = 0;

            stackItems.forEach((item) => {
                item.addEventListener("click", () => {
                    active = (active + 1) % stackItems.length;
                    helper.updateCodeStack(stackItems, active);
                });
            });

            helper.updateCodeStack(stackItems, active);
        });

        // showcase

        // about me
        const aboutDescription = document.querySelector("#about-description");
        const aboutImage = document.querySelector("#about-image");

        const setAboutImage = helper.loadImage(IMAGE.MY_PHOTO, ASSET_TYPE.PNG);

        aboutDescription.textContent = data.about.description;
        aboutImage.appendChild(setAboutImage);
    });
    