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

        const createGroup = () => {
            const group = document.createElement("div");
            group.className = "tech-marquee__group";

            data.techstacks.forEach((name) => {
                const item = document.createElement("span");
                item.className = "tech-marquee__item";
                item.textContent = name;
                group.appendChild(item);
            });

            return group;
        };

        const firstGroup = createGroup();
        marqueeTrack.appendChild(firstGroup);
        const groupWidth = firstGroup.getBoundingClientRect().width;

        const copiesPerHalf = Math.max(1, Math.ceil(window.innerWidth / groupWidth));
        const totalCopies = copiesPerHalf * 2;

        for (let copy = 1; copy < totalCopies; copy++) {
            marqueeTrack.appendChild(createGroup());
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
        const showcaseGrid = document.querySelector("#showcase-grid");
        const SHOWCASE_THEMES = ["dark", "light"];
        const MAX_PATTERNS = 4;

        data.showcase.forEach((project, i) => {
            const card = document.createElement("article");
            card.className = "showcase-card";
            card.dataset.theme = SHOWCASE_THEMES[i % SHOWCASE_THEMES.length];

            const visual = document.createElement("div");
            visual.className = "showcase-card__visual";

            const imageName = Array.isArray(project.images) ? project.images[0] : project.images;

            if (imageName) {
                const img = helper.loadImage(imageName, ASSET_TYPE.PNG);
                img.alt = project.name;
                img.loading = "lazy";
                visual.appendChild(img);
            } else {
                const initial = document.createElement("span");
                initial.className = "showcase-card__initial";
                initial.textContent = project.name.charAt(0);
                initial.setAttribute("aria-hidden", "true");
                visual.appendChild(initial);
            }

            const meta = document.createElement("div");
            meta.className = "showcase-card__meta";

            const type = document.createElement("span");
            type.textContent = project.type;

            const status = document.createElement("span");
            status.className = "showcase-card__status";
            status.dataset.status = project["project-status"] === "Completed" ? "done" : "progress";
            status.textContent = project["project-status"];

            meta.append(type, status);

            const title = document.createElement("h4");
            title.className = "showcase-card__title";
            title.textContent = project.name;

            const description = document.createElement("p");
            description.className = "showcase-card__description";
            description.textContent = project.description || "Deskripsi proyek akan segera ditambahkan.";

            const patterns = project["architecture-or-pattern-or-principle"];
            const list = document.createElement("ul");
            list.className = "showcase-card__list";

            patterns.slice(0, MAX_PATTERNS).forEach((name) => {
                const li = document.createElement("li");
                li.textContent = name;
                list.appendChild(li);
            });

            const action = document.createElement("div");
            action.className = "showcase-card__action";

            const link = document.createElement("a");
            link.href = project["project-url"];
            link.target = "_blank";
            link.rel = "noopener";
            link.setAttribute("aria-label", `Buka proyek ${project.name}`);
            link.textContent = "↗";

            action.appendChild(link);

            card.append(visual, meta, title, description, list, action);
            showcaseGrid.appendChild(card);
        });

        // about me
        const aboutDescription = document.querySelector("#about-description");
        const aboutImage = document.querySelector("#about-image");

        const setAboutImage = helper.loadImage(IMAGE.MY_PHOTO, ASSET_TYPE.PNG);
        setAboutImage.alt = data.about.name;

        aboutDescription.textContent = data.about.description;
        aboutImage.appendChild(setAboutImage);

        const EDUCATION = [
            { logo: IMAGE.SMP_LOGO,  name: "SMPI Raudhatul Jannah", year: "2019 – 2021" },
            { logo: IMAGE.SMA_LOGO,  name: "SMA Negeri 2 Harau", year: "2021 – 2024" },
            { logo: IMAGE.UNIV_LOGO, name: "Universitas Andalas", year: "2025 – 2029" }
        ];

        const educationList = document.querySelector("#education-list");

        EDUCATION.forEach((item) => {
            const li = document.createElement("li");
            li.className = "education__item";

            const logoBox = document.createElement("span");
            logoBox.className = "education__logo";

            const logo = helper.loadImage(item.logo, ASSET_TYPE.PNG);
            logo.alt = item.name;
            logo.loading = "lazy";
            logoBox.appendChild(logo);

            const body = document.createElement("div");

            const name = document.createElement("h4");
            name.className = "education__name";
            name.textContent = item.name;

            const year = document.createElement("p");
            year.className = "education__year";
            year.textContent = item.year;

            body.append(name, year);
            li.append(logoBox, body);
            educationList.appendChild(li);

            educationList.appendChild(li);
        });   

        // contact
        const findContact = (key) =>
            data.about.contact.find((item) => item[key])?.[key];

        const email = findContact("email");
        const linkedIn = findContact("linkedIn");
        const github = findContact("github");

        const CONTACTS = [
            { label: "Email", href: `mailto:${email}`, external: false },
            { label: "LinkedIn", href: linkedIn, external: true },
            { label: "GitHub", href: github, external: true }
        ];

        const contactList = document.querySelector("#contact-list");

        CONTACTS.forEach((item) => {
            const li = document.createElement("li");

            const a = document.createElement("a");
            a.className = "contact__link";
            a.href = item.href;
            a.textContent = item.label;

            if (item.external) {
                a.target = "_blank";
                a.rel = "noopener";
            }

            li.appendChild(a);
            contactList.appendChild(li);
        });

        githubMenuLink.href = github;
    });   
    