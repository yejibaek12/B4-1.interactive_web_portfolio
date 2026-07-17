/**
 * B4-1 Interactive Web Portfolio
 * Event → State → Render 패턴을 명시적으로 구현합니다.
 *
 * Threshold / scroll criteria (README에도 명시):
 * - Nav scrolled style: 60px
 * - Scroll-top button: 300px
 * - Intersection Observer: threshold 0.2
 */

const GITHUB_USERNAME = "yejibaek12";
const NAV_SCROLL_THRESHOLD = 60;
const SCROLL_TOP_THRESHOLD = 300;
const OBSERVER_THRESHOLD = 0.2;

/* ----------------------------------------
   Theme state → render
   ---------------------------------------- */
const themeState = {
  theme: "light",
};

const applyTheme = (theme) => {
  themeState.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  const icon = document.querySelector("#theme-toggle i");
  if (!icon) return;
  icon.classList.toggle("fa-moon", theme === "light");
  icon.classList.toggle("fa-sun", theme === "dark");
};

const initTheme = () => {
  const saved = localStorage.getItem("theme");
  applyTheme(saved === "dark" ? "dark" : "light");
};

const setupThemeToggle = () => {
  const toggle = document.querySelector("#theme-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const next = themeState.theme === "dark" ? "light" : "dark";
    applyTheme(next);
  });
};

/* ----------------------------------------
   Mobile menu
   ---------------------------------------- */
const setupMenuToggle = () => {
  const menuToggle = document.querySelector("#menu-toggle");
  const navLinks = document.querySelector("#nav-menu");
  if (!menuToggle || !navLinks) return;

  const closeMenu = () => {
    navLinks.classList.remove("active");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "메뉴 열기");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
};

/* ----------------------------------------
   Smooth scroll (anchors)
   ---------------------------------------- */
const setupSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });
};

/* ----------------------------------------
   Scroll UI: header + scroll-top
   ---------------------------------------- */
const setupScrollUI = () => {
  const header = document.querySelector("#site-header");
  const scrollTopBtn = document.querySelector("#scroll-top");
  if (!header || !scrollTopBtn) return;

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y >= NAV_SCROLL_THRESHOLD);
    scrollTopBtn.classList.toggle("visible", y >= SCROLL_TOP_THRESHOLD);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

/* ----------------------------------------
   Scroll reveal (Intersection Observer)
   ---------------------------------------- */
const setupScrollReveal = () => {
  const sections = document.querySelectorAll(".reveal");
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, threshold: OBSERVER_THRESHOLD }
  );

  sections.forEach((section) => observer.observe(section));
};

/* ----------------------------------------
   Contact form: validation state → render
   ---------------------------------------- */
const formState = {
  name: { value: "", error: "", touched: false },
  email: { value: "", error: "", touched: false },
  message: { value: "", error: "", touched: false },
  success: false,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateField = (field, value) => {
  const trimmed = value.trim();

  if (!trimmed) {
    const labels = { name: "이름", email: "이메일", message: "메시지" };
    return `${labels[field]}을(를) 입력해 주세요.`;
  }

  if (field === "email" && !emailPattern.test(trimmed)) {
    return "올바른 이메일 형식을 입력해 주세요.";
  }

  return "";
};

const renderFormErrors = () => {
  ["name", "email", "message"].forEach((field) => {
    const input = document.querySelector(`#${field}`);
    const errorEl = document.querySelector(`#${field}-error`);
    const { error } = formState[field];

    if (input) input.classList.toggle("error", Boolean(error));
    if (errorEl) errorEl.textContent = error;
  });

  const successEl = document.querySelector("#form-success");
  if (successEl) {
    successEl.hidden = !formState.success;
  }
};

const setupContactForm = () => {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const updateField = (field, value, { forceValidate = false } = {}) => {
    formState[field].value = value;

    if (formState[field].touched || forceValidate) {
      formState[field].error = validateField(field, value);
    }

    formState.success = false;
    renderFormErrors();
  };

  ["name", "email", "message"].forEach((field) => {
    const input = document.querySelector(`#${field}`);
    if (!input) return;

    input.addEventListener("input", () => {
      updateField(field, input.value);
    });

    input.addEventListener("blur", () => {
      formState[field].touched = true;
      updateField(field, input.value);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    ["name", "email", "message"].forEach((field) => {
      const input = document.querySelector(`#${field}`);
      const value = input ? input.value : "";
      formState[field].touched = true;
      updateField(field, value, { forceValidate: true });
    });

    const hasError = ["name", "email", "message"].some(
      (field) => formState[field].error
    );

    formState.success = !hasError;
    renderFormErrors();

    if (!hasError) {
      form.reset();
      ["name", "email", "message"].forEach((field) => {
        formState[field].value = "";
        formState[field].touched = false;
        formState[field].error = "";
      });
      renderFormErrors();
    }
  });
};

/* ----------------------------------------
   Projects API: loading / success / empty / error
   ---------------------------------------- */
const projectsState = {
  status: "idle", // idle | loading | success | empty | error
  repos: [],
  errorMessage: "프로젝트를 불러올 수 없습니다.",
};

const statusEl = () => document.querySelector("#projects-status");
const gridEl = () => document.querySelector("#project-grid");

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const renderProjectsStatus = () => {
  const status = statusEl();
  const grid = gridEl();
  if (!status || !grid) return;

  if (projectsState.status === "loading") {
    status.hidden = false;
    grid.hidden = true;
    status.innerHTML = `
      <div class="spinner" aria-hidden="true"></div>
      <p>로딩 중...</p>
    `;
    return;
  }

  if (projectsState.status === "error") {
    status.hidden = false;
    grid.hidden = true;
    status.innerHTML = `
      <p>${projectsState.errorMessage}</p>
      <button type="button" class="btn btn--primary btn--retry" id="retry-projects">
        다시 시도
      </button>
    `;
    const retryBtn = document.querySelector("#retry-projects");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        loadProjects();
      });
    }
    return;
  }

  if (projectsState.status === "empty") {
    status.hidden = false;
    grid.hidden = true;
    status.innerHTML = `<p>표시할 프로젝트가 없습니다.</p>`;
    return;
  }

  status.hidden = true;
  grid.hidden = false;

  grid.innerHTML = projectsState.repos
    .map((repo) => {
      const {
        name,
        description,
        html_url: htmlUrl,
        stargazers_count: stars,
        language,
        forks_count: forks,
      } = repo;

      return `
        <article class="project-card">
          <h3 class="project-card__title">${escapeHtml(name)}</h3>
          <p class="project-card__desc">
            ${escapeHtml(description || "설명이 없는 저장소입니다.")}
          </p>
          <div class="project-card__meta">
            <span class="project-card__lang">${escapeHtml(language || "Other")}</span>
            <span><i class="fa-solid fa-star" aria-hidden="true"></i> ${stars}</span>
            <span><i class="fa-solid fa-code-fork" aria-hidden="true"></i> ${forks}</span>
          </div>
          <a class="project-card__link" href="${htmlUrl}" target="_blank" rel="noopener noreferrer">
            GitHub에서 보기 <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
          </a>
        </article>
      `;
    })
    .join("");
};

const loadProjects = async () => {
  projectsState.status = "loading";
  projectsState.errorMessage = "프로젝트를 불러올 수 없습니다.";
  renderProjectsStatus();

  try {
    // 여기서 주석하면 error
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`
    );

    // 여기부터 주석하면 로딩
    if (response.status === 403) {
      throw new Error("rate-limit");
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const repos = Array.isArray(data) ? data : [];
    // const repos = []

    projectsState.repos = repos;

    if (!repos.length) {
      projectsState.status = "empty";
    } else {
      projectsState.status = "success";
    }

    renderProjectsStatus();
  } catch (error) {
    projectsState.status = "error";
    if (error instanceof Error && error.message === "rate-limit") {
      projectsState.errorMessage =
        "요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.";
    } else {
      projectsState.errorMessage = "프로젝트를 불러올 수 없습니다.";
    }
    renderProjectsStatus();
  }
};

/* ----------------------------------------
   Init
   ---------------------------------------- */
const init = () => {
  initTheme();
  setupThemeToggle();
  setupMenuToggle();
  setupSmoothScroll();
  setupScrollUI();
  setupScrollReveal();
  setupContactForm();
  loadProjects();
};

init();
