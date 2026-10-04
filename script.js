const pages = [
  ["home", "Home"],
  ["about", "About"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["skills", "Skills"],
  ["certs", "Certifications"],
  ["contact", "Contact"]
];

const projects = {
  health: {
    t: "Healthcare Insurance Platform",
    s: "Mobile, Web & Admin | Confianz Global Technologies",
    tags: ["Flutter", "Laravel", "MySQL", "REST APIs"],
    e: "&#127973;",
    d: "A live platform serving 50,000+ policyholders across the UAE, Qatar, Kuwait, Bahrain and Oman.",
    b: [
      "Built Flutter Android features and 20+ Laravel REST APIs powering mobile, web and the admin portal.",
      "Implemented app-wide accessibility (semantic labels, TalkBack, keyboard and screen-reader navigation, touch target sizing) across 12+ screens.",
      "Designed the UI and integrated a third-party chatbot used by 5,000+ policyholders for claim status, policies, complaints and FAQs.",
      "Diagnosed and fixed production bugs across mobile, web and backend, keeping releases stable."
    ]
  },
  odoo: {
    t: "Odoo-Integrated Mobile App",
    s: "Confianz Global Technologies | Sole developer",
    tags: ["Flutter", "BLoC", "Clean Architecture", "Drift", "Odoo RPC"],
    e: "&#128241;",
    d: "A mobile app that connects to Odoo through RPC API calls, built from scratch and close to completion.",
    b: [
      "Designed and built the app end to end as the only developer.",
      "Structured with BLoC state management and clean architecture for testability and maintainability.",
      "Used Drift (SQLite) as the local database."
    ]
  },
  award: {
    t: "Rising Star Award 2025",
    s: "Confianz Global Technologies",
    tags: [],
    e: "&#127942;",
    d: "Earned for taking ownership of the app-wide accessibility initiative under a critical deadline within my first year, as a fresher on the team.",
    b: []
  }
};

const skills = [
  ["Mobile", "Flutter,Dart,BLoC,Clean Architecture,Drift,React Native"],
  ["Backend & APIs", "Laravel,PHP,REST APIs,JSON,MVC,Odoo RPC"],
  ["Databases", "MySQL,SQLite,SQL,NoSQL (basic)"],
  ["Tools & DevOps", "Git,GitHub,Docker (basic),Jira,Postman,Android Studio,VS Code"],
  ["Working knowledge", "React,JavaScript,Node.js,Python,Microservices,C"]
];

const certs = [
  ["HR", "Software Engineer Intern", "HackerRank"],
  ["HR", "Python, SQL, Problem Solving (Basic)", "HackerRank"],
  ["FC", "Legacy Responsive Web Design (V8)", "freeCodeCamp"],
  ["IN", "Fundamentals of Python", "Infosys"],
  ["AC", "Data Analytics & Visualization Job Simulation", "Accenture North America / Forage"],
  ["in", "Intro to Career Skills in Data Analytics", "LinkedIn"]
];

const stats = [
  [50000, "+", "Policyholders served"],
  [5, "", "Countries"],
  [20, "+", "REST APIs built"],
  [12, "+", "Screens made accessible"]
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const root = document.documentElement;
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme) {
  root.dataset.theme = savedTheme;
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  root.dataset.theme = "dark";
}

function syncThemeButton() {
  const toggle = $("#tog");
  if (!toggle) return;
  const dark = root.dataset.theme === "dark";
  toggle.textContent = dark ? "☀" : "☾";
}

syncThemeButton();

$("#nav").innerHTML = pages
  .map(([id, label]) => `<button data-go="${id}">${label}</button>`)
  .join("");

$("#pgrid").innerHTML = ["health", "odoo"]
  .map((key) => {
    const project = projects[key];
    return `
      <div class="card click" data-open="${key}">
        <div style="font-size: 1.8rem">${project.e}</div>
        <h3 style="margin: 6px 0">${project.t}</h3>
        <p class="muted sm">${project.d}</p>
        ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
    `;
  })
  .join("");

$("#sgrid").innerHTML = skills
  .map(
    ([title, items]) => `
      <div class="card">
        <b>${title}</b>
        <div class="chips" style="margin-top: 8px">
          ${items
            .split(",")
            .map((item) => `<span>${item}</span>`)
            .join("")}
        </div>
      </div>
    `
  )
  .join("");

$("#cgrid").innerHTML = certs
  .map(
    ([label, title, provider]) => `
      <div class="card click cert">
        <i>${label}</i>
        <div>
          <b>${title}</b>
          <div class="muted sm">${provider}</div>
        </div>
      </div>
    `
  )
  .join("");

$("#stats").innerHTML = stats
  .map(
    ([value, suffix, label]) => `
      <div class="card stat">
        <b data-n="${value}" data-x="${suffix}">0</b>
        <span>${label}</span>
      </div>
    `
  )
  .join("");

function count() {
  $$('[data-n]').forEach((el) => {
    const maxValue = Number(el.dataset.n);
    const startTime = performance.now();

    function animate(now) {
      const progress = Math.min((now - startTime) / 1200, 1);
      const currentValue = Math.round(maxValue * (1 - Math.pow(1 - progress, 3)));
      const suffix = el.dataset.x || "";
      el.textContent = `${currentValue.toLocaleString()}${progress === 1 ? suffix : ""}`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  });
}

const sections = $$('section');
let counted = false;
let lock = false;
let scrollTimer = null;

function activateSection(section) {
  sections.forEach((item) => item.classList.toggle('on', item === section));

  const navButtons = $$('nav button');
  const navContainer = $('#nav');

  navButtons.forEach((button) => {
    const isActive = button.dataset.go === section.id;
    button.classList.toggle('on', isActive);

    if (isActive) {
      navContainer.scrollTo({
        left: button.offsetLeft - navContainer.clientWidth / 2 + button.clientWidth / 2,
        behavior: 'smooth'
      });
    }
  });

  if (section.id === 'home' && !counted) {
    counted = true;
    count();
  }
}

function spy() {
  if (lock) return;

  let current = sections[0];
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= 110) {
      current = section;
    }
  });

  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) {
    current = sections[sections.length - 1];
  }

  activateSection(current);
}

function go(id) {
  const el = document.getElementById(id);
  if (!el) return;

  activateSection(el);
  lock = true;
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    lock = false;
  }, 1000);

  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

let tickFrame = 0;
window.addEventListener(
  'scroll',
  () => {
    if (!tickFrame) {
      tickFrame = requestAnimationFrame(() => {
        tickFrame = 0;
        spy();
      });
    }
  },
  { passive: true }
);

const girl = `
  <svg viewBox="0 0 200 220" aria-hidden="true">
    <defs>
      <linearGradient id="gd" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#6d5efc"/>
        <stop offset="1" stop-color="#18b8d8"/>
      </linearGradient>
      <linearGradient id="sk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f8d3b0"/>
        <stop offset="1" stop-color="#e8b48a"/>
      </linearGradient>
      <radialGradient id="hl" cx=".3" cy=".3">
        <stop offset="0" stop-color="#5a3a4c"/>
        <stop offset="1" stop-color="#2b1d2f"/>
      </radialGradient>
    </defs>
    <g class="breathe">
      <path d="M42 84Q36 30 100 26Q164 30 158 84L166 158Q152 176 140 150L60 150Q48 176 34 158Z" fill="url(#hl)"/>
      <path d="M26 220Q28 150 100 144Q172 150 174 220Z" fill="url(#gd)"/>
      <path d="M86 124H114V150Q100 162 86 150Z" fill="#e3ab82"/>
      <g class="head">
        <circle cx="61" cy="94" r="7" fill="#efbf98"/>
        <circle cx="139" cy="94" r="7" fill="#efbf98"/>
        <ellipse cx="100" cy="90" rx="39" ry="45" fill="url(#sk)"/>
        <path d="M60 86Q58 42 100 40Q142 42 140 86Q126 60 104 58Q78 58 60 86Z" fill="url(#hl)"/>
        <path d="M72 76Q80 71 90 74M110 74Q120 71 128 76" stroke="#3a2636" stroke-width="3" fill="none" stroke-linecap="round"/>
        <g class="eye">
          <ellipse cx="82" cy="92" rx="8" ry="5.5" fill="#fff"/>
          <g class="iris">
            <circle cx="82" cy="92" r="4" fill="#4a2f22"/>
            <circle cx="82" cy="92" r="1.8" fill="#120a08"/>
            <circle cx="83.5" cy="90.5" r="1" fill="#fff"/>
          </g>
        </g>
        <g class="eye">
          <ellipse cx="118" cy="92" rx="8" ry="5.5" fill="#fff"/>
          <g class="iris">
            <circle cx="118" cy="92" r="4" fill="#4a2f22"/>
            <circle cx="118" cy="92" r="1.8" fill="#120a08"/>
            <circle cx="119.5" cy="90.5" r="1" fill="#fff"/>
          </g>
        </g>
        <path d="M100 98Q95 108 101 110" stroke="#d49a76" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M90 119Q100 128 110 119Q100 122 90 119Z" fill="#c4574f"/>
      </g>
    </g>
  </svg>
`;

$("#girlSm").innerHTML = girl;
$("#girlBig").innerHTML = girl;

window.addEventListener('pointermove', (event) => {
  $$('.girl').forEach((element) => {
    const rect = element.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height * 0.4);
    const distance = Math.hypot(dx, dy) || 1;
    const intensity = Math.min(distance, 120) / 120;

    element.querySelectorAll('.iris').forEach((iris) => {
      iris.style.transform = `translate(${(dx / distance) * 2.6 * intensity}px, ${(dy / distance) * 2.2 * intensity}px)`;
    });
  });
});

function openModal(key) {
  const project = projects[key];
  $("#modal").innerHTML = `
    <button class="x" id="closeModal">&#10005;</button>
    <div style="font-size: 2rem">${project.e}</div>
    <h3 style="margin: 4px 0">${project.t}</h3>
    <div class="muted sm">${project.s}</div>
    <p>${project.d}</p>
    ${project.b.length ? `<ul>${project.b.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
    <p>${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</p>
  `;

  $("#ov").classList.add('on');
  $("#closeModal").onclick = closeModal;
}

function closeModal() {
  $("#ov").classList.remove('on');
}

document.addEventListener('click', (event) => {
  const navButton = event.target.closest('[data-go]');
  if (navButton) {
    go(navButton.dataset.go);
    return;
  }

  const projectCard = event.target.closest('[data-open]');
  if (projectCard) {
    openModal(projectCard.dataset.open);
    return;
  }

  if (event.target.id === 'ov') {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

$("#tog").addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = nextTheme;
  localStorage.setItem('portfolio-theme', nextTheme);
  syncThemeButton();
});

const roles = [
  'Full Stack Software Engineer',
  'Flutter Developer',
  'Laravel API Developer',
  'Accessibility Advocate'
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function tickTypewriter() {
  const currentRole = roles[roleIndex];
  const typeElement = $('#type');

  if (!deleting) {
    charIndex += 1;
    typeElement.textContent = currentRole.slice(0, charIndex);

    if (charIndex === currentRole.length) {
      deleting = true;
      setTimeout(tickTypewriter, 1400);
      return;
    }
  } else {
    charIndex -= 1;
    typeElement.textContent = currentRole.slice(0, charIndex);

    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(tickTypewriter, deleting ? 35 : 70);
}

tickTypewriter();
spy();

if (location.hash) {
  setTimeout(() => go(location.hash.slice(1)), 150);
}
