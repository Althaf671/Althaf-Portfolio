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

console.log("NOW PLAYING POISON DOOR BY SISTER OF MERCY, INSTRUMENTAL version dari https://www.youtube.com/watch?v=nMaEo8HcJfw&list=RDnMaEo8HcJfw&start_radio=1")

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

// navigation controller utk multi page
const isHome = document.body.dataset.page === "home";
const resolveHref = (id) => {
    if (id.startsWith("#")) {
        return isHome ? id : `./index.html${id}`;
    }

    return id;
};

// set nav item 
let navItems = document.querySelector("#nav-items")
NAV_ITEMS.forEach((item) => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.textContent = item.name;
    a.href = resolveHref(item.id); 
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
    menuItems.appendChild(createMenuItem(i + 1, item.name, resolveHref(item.id)));
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

// loader image
const container = document.querySelector("#copyright-icon");
const image = helper.loadImage(SVG.COPYRIGHT, ASSET_TYPE.SVG);
container.appendChild(image);

// data loader
helper.loadData("./misc/data.json")
    .then((data) => {
        const page = document.body.dataset.page;
        const byId = (id) => document.getElementById(id);

        const el = (tag, className, text, attrs) => {
            const node = document.createElement(tag);
            if (className) node.className = className;
            if (text !== undefined && text !== null) node.textContent = text;
            if (attrs) Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
            return node;
        };

        const findContact = (key) =>
            data.about.contact.find((item) => item[key])?.[key];

        const email = findContact("email");
        const linkedIn = findContact("linkedIn");
        const github = findContact("github");

        githubMenuLink.href = github;

        // MAIN script untuk home
        const renderHero = () => {
            document.querySelector("#short-description").textContent =
                data.about["short-description"];

            const roleList = document.querySelector(".list-role-domicile ol");
            [
                ["Role", data.about.role[0]],
                ["Experience", data.about.yoe],
                ["Based in", data.about.domicile]
            ].forEach(([label, value]) => {
                const li = el("li");
                li.append(el("span", "role-label", label), el("span", "", value));
                roleList.appendChild(li);
            });

            const heroName = document.querySelector("#hero-name");
            heroName.textContent = "";
            data.about.name
                .split(" ")
                .forEach((part) => heroName.appendChild(el("span", "", part)));

            document.querySelector("#hero-linkedin").href = linkedIn;
        };

        const renderSkills = () => {
            const grid = document.querySelector(".skills-grid");

            data.skills.forEach((item) => {
                const icon = helper.loadImage(CAPABILITY_ICONS[item.icon], ASSET_TYPE.SVG);
                icon.alt = "";

                const iconBox = el("span", "capability__icon");
                iconBox.appendChild(icon);

                const body = el("div", "capability__body");
                body.append(el("h4", "", item.name), el("p", "", item.description));

                const card = el("div", "capability");
                card.append(iconBox, body);
                grid.appendChild(card);
            });
        };

        const renderTechMarquee = () => {
            const track = document.querySelector("#tech-marquee-track");

            const createGroup = () => {
                const group = el("div", "tech-marquee__group");
                data.techstacks.forEach((name) =>
                    group.appendChild(el("span", "tech-marquee__item", name))
                );
                return group;
            };

            const first = createGroup();
            track.appendChild(first);

            const groupWidth = first.getBoundingClientRect().width;
            const perHalf = Math.max(1, Math.ceil(window.innerWidth / groupWidth));

            for (let i = 1; i < perHalf * 2; i++) {
                track.appendChild(createGroup());
            }
        };

        const renderAbout = () => {
            document.querySelector("#about-description").textContent =
                data.about.description;

            const photo = helper.loadImage(IMAGE.MY_PHOTO, ASSET_TYPE.PNG);
            photo.alt = data.about.name;
            document.querySelector("#about-image").appendChild(photo);

            const EDUCATION = [
                { logo: IMAGE.SMP_LOGO,  name: "SMPI Raudhatul Jannah", year: "2019 – 2021" },
                { logo: IMAGE.SMA_LOGO,  name: "SMA Negeri 2 Harau",    year: "2021 – 2024" },
                { logo: IMAGE.UNIV_LOGO, name: "Universitas Andalas",   year: "2025 – 2029" }
            ];

            const list = document.querySelector("#education-list");

            EDUCATION.forEach((item) => {
                const logo = helper.loadImage(item.logo, ASSET_TYPE.PNG);
                logo.alt = item.name;
                logo.loading = "lazy";

                const logoBox = el("span", "education__logo");
                logoBox.appendChild(logo);

                const body = el("div");
                body.append(
                    el("h4", "education__name", item.name),
                    el("p", "education__year", item.year)
                );

                const li = el("li", "education__item");
                li.append(logoBox, body);
                list.appendChild(li);
            });
        };

        const renderApproach = () => {
            const template = document.querySelector(".approach-card");
            const blank = template.cloneNode(true);
            let last = template;

            data["design-approach"].forEach((approach, i) => {
                let card = template;

                if (i > 0) {
                    card = blank.cloneNode(true);
                    card.removeAttribute("id");
                    card.removeAttribute("aria-labelledby");
                    card.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
                    card.querySelector(".section-label").remove();

                    last.after(card);
                    last = card;
                }

                const q = (selector) => card.querySelector(selector);

                q(".approach-card__title").textContent = approach.header.title;
                q(".approach-card__lead").textContent = approach.header.lead;

                const [before, after] = approach.description.split(approach.highlight);
                q(".approach-card__description").append(
                    before,
                    el("strong", "", approach.highlight),
                    after
                );

                approach.details.forEach((text) =>
                    q(".approach-card__details").appendChild(el("li", "", text))
                );

                q(".approach-card__footer span:first-child").textContent = approach.footer.label;
                q(".approach-card__index").textContent = approach.footer.hint;

                const stack = q(".approach-stack");

                approach.images.forEach((item) => {
                    const button = el("button", "approach-stack__item", "", {
                        type: "button",
                        "aria-label": "Tampilkan contoh kode berikutnya"
                    });

                    const img = helper.loadImage(item.name, ASSET_TYPE.PNG);
                    img.alt = item.alt;
                    img.loading = "lazy";

                    button.appendChild(img);
                    stack.appendChild(button);
                });

                const items = [...stack.children];
                let active = 0;

                items.forEach((item) => {
                    item.addEventListener("click", () => {
                        active = (active + 1) % items.length;
                        helper.updateCodeStack(items, active);
                    });
                });

                helper.updateCodeStack(items, active);
            });
        };

        const renderShowcase = () => {
            const grid = byId("showcase-grid");
            const THEMES = ["dark", "light"];
            const MAX_PATTERNS = 4;

            data.showcase.forEach((project, i) => {
                const card = el("article", "showcase-card");
                card.dataset.theme = THEMES[i % THEMES.length];

                const visual = el("div", "showcase-card__visual");
                const imageName = Array.isArray(project.images)
                    ? project.images[0]
                    : project.images;

                if (imageName) {
                    const img = helper.loadImage(imageName, ASSET_TYPE.PNG);
                    img.alt = project.name;
                    img.loading = "lazy";
                    visual.appendChild(img);
                } else {
                    visual.appendChild(
                        el("span", "showcase-card__initial", project.name.charAt(0), {
                            "aria-hidden": "true"
                        })
                    );
                }

                const status = el("span", "showcase-card__status", project["project-status"]);
                status.dataset.status =
                    project["project-status"] === "Completed" ? "done" : "progress";

                const meta = el("div", "showcase-card__meta");
                meta.append(el("span", "", project.type), status);

                const list = el("ul", "showcase-card__list");
                project["architecture-or-pattern-or-principle"]
                    .slice(0, MAX_PATTERNS)
                    .forEach((name) => list.appendChild(el("li", "", name)));

                const link = el("a", "", "↗", {
                    href: project["project-url"],
                    target: "_blank",
                    rel: "noopener",
                    "aria-label": `Buka proyek ${project.name}`
                });
                const action = el("div", "showcase-card__action");
                action.appendChild(link);

                card.append(
                    visual,
                    meta,
                    el("h4", "showcase-card__title", project.name),
                    el(
                        "p",
                        "showcase-card__description",
                        project.description || "Deskripsi proyek akan segera ditambahkan."
                    ),
                    list,
                    action
                );
                grid.appendChild(card);
            });

            const prev = byId("showcase-prev");
            const next = byId("showcase-next");

            const getStep = () => {
                const card = grid.querySelector(".showcase-card");
                const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
                return card.getBoundingClientRect().width + gap;
            };

            const updateNav = () => {
                const max = grid.scrollWidth - grid.clientWidth;
                prev.disabled = grid.scrollLeft <= 2;
                next.disabled = grid.scrollLeft >= max - 2;
            };

            prev.addEventListener("click", () =>
                grid.scrollBy({ left: -getStep(), behavior: "smooth" })
            );
            next.addEventListener("click", () =>
                grid.scrollBy({ left: getStep(), behavior: "smooth" })
            );

            grid.addEventListener("scroll", updateNav, { passive: true });
            window.addEventListener("resize", updateNav);
            updateNav();
        };

        const renderContactLinks = () => {
            const list = byId("contact-list");

            [
                { label: "Email",    href: `mailto:${email}`, external: false },
                { label: "LinkedIn", href: linkedIn,          external: true },
                { label: "GitHub",   href: github,            external: true }
            ].forEach((item) => {
                const a = el("a", "contact__link", item.label, { href: item.href });

                if (item.external) {
                    a.target = "_blank";
                    a.rel = "noopener";
                }

                const li = el("li");
                li.appendChild(a);
                list.appendChild(li);
            });
        };

        // CONTACT Scripts
        const renderContactPage = () => {
            const c = data["contact-page"];
            const form = byId("contact-form");

            const [firstWord, accentWord] = c.title;
            byId("contact-title").append(
                `${firstWord} `,
                el("span", "contact-page__accent", accentWord)
            );

            byId("contact-intro").textContent = c.intro;
            byId("contact-email-label").textContent = c["email-label"];
            byId("contact-location-label").textContent = c["location-label"];
            byId("contact-location").textContent = c.location;

            const emailLink = byId("contact-email");
            emailLink.textContent = email;
            emailLink.href = `mailto:${email}`;

            Object.entries(c.fields).forEach(([name, text]) => {
                byId(`${name}-label`).textContent = text;
                form.elements[name].placeholder = text;
            });

            byId("contact-submit").textContent = c.submit;

            const renderOptions = (container, name, options) => {
                options.forEach((text, i) => {
                    const input = el("input", "chip__input", "", {
                        type: "radio",
                        name,
                        id: `${name}-${i}`,
                        value: text
                    });
                    const label = el("label", "chip", text, { for: input.id });

                    container.append(input, label);
                });
            };

            byId("need-legend").textContent = c.need.legend;
            byId("budget-legend").textContent = c.budget.legend;
            renderOptions(byId("need-options"), "need", c.need.options);
            renderOptions(byId("budget-options"), "budget", c.budget.options);

            form.addEventListener("input", (event) => {
                const error = form.querySelector(`[data-error-for="${event.target.name}"]`);
                if (error) error.textContent = "";

                event.target.removeAttribute("aria-invalid");
                byId("contact-status").textContent = "";
            });

            form.addEventListener("submit", (event) => {
                event.preventDefault();

                if (!helper.formValidation({ form, errors: c.errors })) return;

                const d = new FormData(form);
                const subject = `[Portofolio] ${d.get("need")} - ${d.get("name")}`;
                const body = [
                    `Nama: ${d.get("name")}`,
                    `Email: ${d.get("email")}`,
                    `Kebutuhan: ${d.get("need")}`,
                    `Anggaran: ${d.get("budget")}`,
                    "",
                    d.get("message")
                ].join("\n");

                window.location.href =
                    `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                byId("contact-status").textContent = c.success;
                form.reset();
            });
        };

        // Capabilities script
        const renderCapabilitiesPage = () => {
            const c = data["capabilities-page"];
            const COLUMNS = ["type", "stack", "cost", "duration", "deliverable"];

            byId("capabilities-title").textContent = c.title;
            byId("capabilities-lead").textContent = c.lead;
            byId("capabilities-note").textContent = c.note;
            byId("capabilities-caption").textContent = c.caption;

            const headRow = byId("capabilities-head");
            COLUMNS.forEach((key, i) => {
                const th = el("th", "", null, { scope: "col" });
                th.append(
                    el("span", "cap-table__index", String(i + 1).padStart(2, "0")),
                    ` · ${c.columns[key]}`
                );
                headRow.appendChild(th);
            });

            const table = byId("capabilities-table");

            c.items.forEach((item) => {
                const tbody = el("tbody");

                item.options.forEach((option, i) => {
                    const tr = el("tr");

                    if (i === 0) {
                        const th = el("th", "cap-table__type", null, {
                            scope: "rowgroup",
                            rowspan: String(item.options.length)
                        });
                        th.append(
                            el("span", "cap-type__name", item.type),
                            el("span", "cap-type__summary", item.summary)
                        );
                        tr.appendChild(th);
                    }

                    const stackCell = el("td", "", null, { "data-label": c.columns.stack });
                    const stack = el("div", "cap-stack");

                    if (option.label) {
                        stack.appendChild(el("span", "cap-option-label", option.label));
                    }

                    const chips = el("ul", "cap-chips");
                    option.stack.forEach((name) => chips.appendChild(el("li", "cap-chip", name)));
                    stack.appendChild(chips);
                    stackCell.appendChild(stack);

                    tr.append(
                        stackCell,
                        el("td", "cap-table__cost", option.cost, { "data-label": c.columns.cost }),
                        el("td", "cap-table__duration", option.duration, { "data-label": c.columns.duration }),
                        el("td", "cap-table__deliverable", option.deliverable, { "data-label": c.columns.deliverable })
                    );

                    tbody.appendChild(tr);
                });

                table.appendChild(tbody);
            });
        };

        if (page === "home") {
            renderHero();
            renderSkills();
            renderTechMarquee();
            renderAbout();
            renderApproach();
            renderShowcase();
            renderContactLinks();
        }

        if (page === "contact") {
            renderContactPage();
        }

if (page === "capabilities") {
    console.log("Capabilities page detected");
    console.log("Capabilities data:", data["capabilities-page"]);

    renderCapabilitiesPage();

    console.log("Capabilities rendered");
}
    });  
    