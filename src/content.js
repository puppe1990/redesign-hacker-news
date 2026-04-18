(function () {
  const INIT_FLAG = "hnEditorialRedesignMounted";

  if (window[INIT_FLAG]) {
    return;
  }

  window[INIT_FLAG] = true;

  const STYLE_ID = "hn-editorial-redesign-style";
  const TOPBAR_ID = "hn-editorial-topbar";
  const PAGE_CLASS = "hn-editorial-page";
  const LISTING_CLASS = "hn-editorial-listing";
  const DISCUSSION_CLASS = "hn-editorial-discussion";
  const SUBMIT_CLASS = "hn-editorial-submit";
  const LIGHT_THEME_CLASS = "hn-theme-light";
  const THEME_STORAGE_KEY = "hn-editorial-theme";

  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/news";

  const sections = [
    { href: "/news", label: "Top" },
    { href: "/newest", label: "New" },
    { href: "/show", label: "Show" },
    { href: "/ask", label: "Ask" },
    { href: "/jobs", label: "Jobs" },
    { href: "/best", label: "Best" },
    { href: "/submit", label: "Submit" }
  ];

  const pageLabels = {
    "/news": "Front Page",
    "/newest": "Newest",
    "/show": "Show HN",
    "/ask": "Ask HN",
    "/jobs": "Jobs",
    "/best": "Best",
    "/item": "Discussion",
    "/user": "Profile",
    "/submitted": "Submitted",
    "/threads": "Threads",
    "/favorites": "Favorites"
  };

  function getPreferredTheme() {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function applyTheme(theme) {
    document.body.classList.toggle(LIGHT_THEME_CLASS, theme === "light");
    document.documentElement.style.colorScheme = theme;
  }

  function syncThemeToggle(theme) {
    const toggle = document.getElementById("hn-editorial-theme-toggle");

    if (!toggle) {
      return;
    }

    toggle.textContent = theme === "light" ? "Dark" : "Light";
    toggle.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
    toggle.setAttribute("data-theme", theme);
  }

  function initializeTheme() {
    const theme = getPreferredTheme();
    applyTheme(theme);
    return theme;
  }

  function setupThemeToggle() {
    const toggle = document.getElementById("hn-editorial-theme-toggle");

    if (!toggle || toggle.dataset.bound === "true") {
      syncThemeToggle(getPreferredTheme());
      return;
    }

    toggle.dataset.bound = "true";
    syncThemeToggle(getPreferredTheme());

    toggle.addEventListener("click", () => {
      const currentTheme = document.body.classList.contains(LIGHT_THEME_CLASS) ? "light" : "dark";
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);
      syncThemeToggle(nextTheme);
    });
  }

  function ensureStyle() {
    let styleTag = document.getElementById(STYLE_ID);

    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = STYLE_ID;
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = `
      :root {
        --hn-bg: #071216;
        --hn-bg-elevated: rgba(9, 22, 28, 0.94);
        --hn-panel: rgba(10, 23, 30, 0.9);
        --hn-panel-strong: rgba(13, 31, 40, 0.98);
        --hn-text: #f3f3ed;
        --hn-muted: #9fb1ab;
        --hn-accent: #f59e0b;
        --hn-accent-soft: rgba(245, 158, 11, 0.16);
        --hn-line: rgba(159, 177, 171, 0.14);
        --hn-line-strong: rgba(245, 158, 11, 0.2);
        --hn-shadow: 0 28px 80px rgba(0, 0, 0, 0.34);
        --hn-content-width: 1180px;
        --hn-serif: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif;
        --hn-sans: "Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
        --hn-mono: "SFMono-Regular", "Menlo", "Consolas", monospace;
      }

      body.${LIGHT_THEME_CLASS} {
        --hn-bg: #f4efe4;
        --hn-bg-elevated: rgba(255, 251, 245, 0.95);
        --hn-panel: rgba(255, 252, 246, 0.92);
        --hn-panel-strong: rgba(255, 255, 251, 0.98);
        --hn-text: #1c2428;
        --hn-muted: #5c6a70;
        --hn-accent-soft: rgba(245, 158, 11, 0.12);
        --hn-line: rgba(28, 36, 40, 0.12);
        --hn-line-strong: rgba(245, 158, 11, 0.24);
        --hn-shadow: 0 24px 70px rgba(113, 91, 52, 0.14);
      }

      html,
      body {
        min-height: 100%;
      }

      html {
        background: var(--hn-bg) !important;
      }

      body,
      td {
        background: transparent !important;
      }

      body {
        margin: 0 !important;
        color: var(--hn-text) !important;
        font-family: var(--hn-sans) !important;
        background:
          radial-gradient(circle at top left, rgba(245, 158, 11, 0.13), transparent 24%),
          radial-gradient(circle at top right, rgba(59, 130, 246, 0.08), transparent 22%),
          linear-gradient(180deg, #0a1418 0%, #081216 42%, #050d11 100%) !important;
      }

      body.${LIGHT_THEME_CLASS} {
        background:
          radial-gradient(circle at top left, rgba(245, 158, 11, 0.14), transparent 24%),
          radial-gradient(circle at top right, rgba(14, 165, 233, 0.08), transparent 22%),
          linear-gradient(180deg, #f6f1e7 0%, #f2ece1 42%, #eee7db 100%) !important;
      }

      body.${PAGE_CLASS} {
        padding: 110px 20px 48px !important;
      }

      #hnmain {
        width: 100% !important;
        background: transparent !important;
      }

      #hnmain > tbody > tr:first-child {
        display: none !important;
      }

      body > center {
        display: block !important;
        width: 100% !important;
      }

      tr#bigbox {
        display: block !important;
        width: 100% !important;
      }

      tr#bigbox > td {
        display: block !important;
        width: 100% !important;
        padding: 0 !important;
      }

      tr#bigbox > td > div {
        text-align: center;
      }

      #${TOPBAR_ID} {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        padding: 18px 20px;
        backdrop-filter: blur(18px);
        background: linear-gradient(180deg, rgba(5, 13, 17, 0.96), rgba(5, 13, 17, 0.78));
        border-bottom: 1px solid var(--hn-line);
      }

      body.${LIGHT_THEME_CLASS} #${TOPBAR_ID} {
        background: linear-gradient(180deg, rgba(247, 241, 232, 0.96), rgba(247, 241, 232, 0.82));
      }

      body.${LIGHT_THEME_CLASS} .hn-editorial-nav a:hover,
      body.${LIGHT_THEME_CLASS} .hn-editorial-nav a:focus-visible,
      body.${LIGHT_THEME_CLASS} .hn-editorial-theme-toggle:hover,
      body.${LIGHT_THEME_CLASS} .hn-editorial-theme-toggle:focus-visible {
        background: rgba(28, 36, 40, 0.05);
      }

      .hn-editorial-topbar__inner {
        max-width: var(--hn-content-width);
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 24px;
      }

      .hn-editorial-brand {
        display: flex;
        align-items: center;
        gap: 14px;
        min-width: 0;
      }

      .hn-editorial-brand__badge {
        width: 38px;
        height: 38px;
        display: grid;
        place-items: center;
        border-radius: 12px;
        color: #241102;
        font: 700 16px/1 var(--hn-sans);
        background:
          linear-gradient(135deg, #f8b84a, #f59e0b 55%, #d97706);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.26);
      }

      .hn-editorial-brand__meta {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .hn-editorial-brand__title {
        font: 600 12px/1.1 var(--hn-sans);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--hn-muted);
      }

      .hn-editorial-brand__section {
        font: 600 26px/1.05 var(--hn-serif);
        color: var(--hn-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .hn-editorial-nav {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 4px;
      }

      .hn-editorial-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
      }

      .hn-editorial-nav a {
        color: var(--hn-muted);
        text-decoration: none;
        font: 600 10px/1 var(--hn-sans);
        letter-spacing: 0.05em;
        text-transform: uppercase;
        padding: 5px 9px;
        border-radius: 999px;
        border: 1px solid transparent;
        transition: color 160ms ease, border-color 160ms ease, background-color 160ms ease, transform 160ms ease;
      }

      .hn-editorial-nav a:hover,
      .hn-editorial-nav a:focus-visible {
        color: var(--hn-text);
        background: rgba(255, 255, 255, 0.04);
        border-color: var(--hn-line);
        transform: translateY(-1px);
        outline: none;
      }

      .hn-editorial-nav a[data-active="true"] {
        color: #1d1203;
        background: linear-gradient(135deg, #f4c15f, #f59e0b);
        border-color: transparent;
      }

      .hn-editorial-theme-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 56px;
        height: 28px;
        padding: 0 10px;
        border-radius: 999px;
        border: 1px solid var(--hn-line);
        background: rgba(255, 255, 255, 0.04);
        color: var(--hn-text);
        font: 600 10px/1 var(--hn-sans);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        transition: background-color 160ms ease, border-color 160ms ease, transform 160ms ease;
      }

      .hn-editorial-theme-toggle:hover,
      .hn-editorial-theme-toggle:focus-visible {
        background: rgba(255, 255, 255, 0.08);
        border-color: var(--hn-line-strong);
        transform: translateY(-1px);
        outline: none;
      }

      body.${LISTING_CLASS} tr#bigbox > td > table,
      body.${LISTING_CLASS} table.itemlist {
        display: block !important;
        width: 100% !important;
        max-width: 780px !important;
        margin: 0 auto !important;
        border-collapse: separate !important;
        border-spacing: 0 16px !important;
      }

      body.${LISTING_CLASS} tr#bigbox > td > table > tbody,
      body.${LISTING_CLASS} table.itemlist > tbody {
        display: block !important;
        width: 100% !important;
      }

      body.${LISTING_CLASS} .athing {
        display: flex !important;
        flex-direction: row;
        align-items: flex-start;
        gap: 12px;
        max-width: 780px;
        margin: 0 auto !important;
        padding: 10px 16px !important;
        border: 1px solid var(--hn-line);
        border-radius: 22px;
        background:
          radial-gradient(circle at top left, rgba(245, 158, 11, 0.07), transparent 30%),
          linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent 50%),
          var(--hn-panel);
        box-shadow: var(--hn-shadow);
        transition: transform 180ms ease, border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
      }

      body.${LISTING_CLASS} .athing:hover {
        transform: translateY(-3px);
        border-color: var(--hn-line-strong);
        background-color: var(--hn-panel-strong);
        box-shadow: 0 32px 90px rgba(0, 0, 0, 0.38);
      }

      body.${LISTING_CLASS} .athing > td {
        display: block !important;
        padding: 0 !important;
        box-sizing: border-box;
      }

      body.${LISTING_CLASS} .athing > td.title:first-child {
        flex: 0 0 auto;
        display: flex !important;
        align-items: flex-start;
        padding-top: 2px !important;
      }

      body.${LISTING_CLASS} .athing > td.title:last-child {
        flex: 1 1 0;
        min-width: 0;
      }

      body.${LISTING_CLASS} .votelinks {
        display: none !important;
      }

      body.${LISTING_CLASS} span.rank {
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        padding: 0;
        border-radius: 8px;
        background: var(--hn-accent-soft);
        border: 1px solid rgba(245, 158, 11, 0.18);
        color: #ffd386;
        font: 700 11px/1 var(--hn-mono);
      }

      body.${LISTING_CLASS} .titleline {
        display: block;
        margin-top: 0;
      }

      body.${LISTING_CLASS} .titleline > a {
        color: var(--hn-text);
        text-decoration: none;
        font: 600 18px/1.3 var(--hn-serif);
        letter-spacing: -0.01em;
      }

      body.${LISTING_CLASS} .titleline > a:hover,
      body.${LISTING_CLASS} .titleline > a:focus-visible {
        color: #ffd386;
        outline: none;
      }

      body.${LISTING_CLASS} .sitestr,
      .hn-editorial-badge,
      .hn-editorial-source {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 22px;
        padding: 0 8px;
        border: 1px solid var(--hn-line);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.03);
        color: var(--hn-muted);
        font: 700 11px/1 var(--hn-sans);
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      body.${LISTING_CLASS} .hn-editorial-meta {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-top: 6px;
        padding-top: 5px;
        border-top: 1px solid var(--hn-line);
        overflow: hidden;
        color: var(--hn-muted);
        font: 600 13px/1.5 var(--hn-sans);
      }

      body.${LISTING_CLASS} .hn-editorial-meta-main,
      body.${LISTING_CLASS} .hn-editorial-meta-tags {
        display: flex;
        align-items: center;
      }

      body.${LISTING_CLASS} .hn-editorial-meta-main {
        min-width: 0;
        flex: 1 1 auto;
        gap: 10px 14px;
        overflow: hidden;
      }

      body.${LISTING_CLASS} .hn-editorial-meta-tags {
        flex: 0 0 auto;
        gap: 10px;
        padding-left: 16px;
      }

      body.${LISTING_CLASS} .hn-editorial-meta-main > *,
      body.${LISTING_CLASS} .hn-editorial-meta-tags > * {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        flex: 0 0 auto;
        white-space: nowrap;
      }

      body.${LISTING_CLASS} .hn-editorial-meta-main > *::before,
      body.${LISTING_CLASS} .hn-editorial-meta-tags > *::before {
        content: "";
        width: 5px;
        height: 5px;
        border-radius: 999px;
        background: rgba(245, 158, 11, 0.45);
      }

      body.${LISTING_CLASS} .hn-editorial-meta-main > :first-child::before,
      body.${LISTING_CLASS} .hn-editorial-meta-tags > :first-child::before {
        display: none;
      }

      body.${LISTING_CLASS} td.subtext,
      body.${LISTING_CLASS} tr.athing + tr {
        display: none !important;
      }

      body.${LISTING_CLASS} .hn-editorial-meta a,
      a.hnuser,
      .age a {
        color: inherit;
        text-decoration: none;
      }

      body.${LISTING_CLASS} .hn-editorial-meta a:hover,
      a.hnuser:hover,
      .age a:hover {
        color: #ffd386;
      }

      .pagetop,
      .yclinks,
      body.${LISTING_CLASS} .title > a,
      body.${LISTING_CLASS} .titleline a:visited {
        color: inherit !important;
      }

      body.${DISCUSSION_CLASS} table.itemlist {
        width: min(var(--hn-content-width), 100%) !important;
        margin: 0 auto !important;
        border-collapse: separate !important;
        border-spacing: 0 !important;
      }

      body.${DISCUSSION_CLASS} .fatitem {
        display: block !important;
        width: min(var(--hn-content-width), 100%);
        margin: 0 auto 40px !important;
        padding: 36px 36px 32px;
        border-radius: 28px;
        border: 1px solid var(--hn-line);
        background:
          radial-gradient(circle at top left, rgba(245, 158, 11, 0.05), transparent 28%),
          linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent 42%),
          var(--hn-panel);
        box-shadow: var(--hn-shadow);
        box-sizing: border-box;
      }

      body.${DISCUSSION_CLASS} .fatitem > tbody,
      body.${DISCUSSION_CLASS} .fatitem > tbody > tr {
        display: block !important;
        width: 100% !important;
      }

      body.${DISCUSSION_CLASS} .fatitem .athing {
        display: block !important;
        margin: 0 0 18px 0 !important;
        padding: 0 !important;
        border: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      body.${DISCUSSION_CLASS} .fatitem td {
        display: block !important;
        padding: 0 !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }

      body.${DISCUSSION_CLASS} .fatitem span.rank,
      body.${DISCUSSION_CLASS} .fatitem .votelinks,
      body.${DISCUSSION_CLASS} .comment-tree .votelinks {
        display: none !important;
      }

      body.${DISCUSSION_CLASS} .fatitem .titleline {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
      }

      body.${DISCUSSION_CLASS} .fatitem .titleline > a {
        color: var(--hn-text);
        text-decoration: none;
        font: 600 50px/1.02 var(--hn-serif);
        letter-spacing: -0.03em;
      }

      body.${DISCUSSION_CLASS} .fatitem .titleline > a:hover {
        color: #ffd386;
      }

      body.${DISCUSSION_CLASS} .fatitem .hn-editorial-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 10px 14px;
        margin-top: 24px;
        color: var(--hn-muted);
        font: 600 13px/1.5 var(--hn-sans);
      }

      body.${DISCUSSION_CLASS} .fatitem .hn-editorial-meta > * {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      body.${DISCUSSION_CLASS} .fatitem .hn-editorial-meta > *::before {
        content: "";
        width: 5px;
        height: 5px;
        border-radius: 999px;
        background: rgba(245, 158, 11, 0.45);
      }

      body.${DISCUSSION_CLASS} .fatitem .hn-editorial-meta > :first-child::before {
        display: none;
      }

      body.${DISCUSSION_CLASS} .fatitem .toptext {
        margin-top: 26px;
        color: var(--hn-text);
        font: 400 22px/1.85 var(--hn-serif);
      }

      body.${DISCUSSION_CLASS} .fatitem form {
        margin-top: 22px;
      }

      body.${DISCUSSION_CLASS} textarea {
        width: 100% !important;
        min-height: 160px;
        padding: 18px;
        resize: vertical;
        box-sizing: border-box;
      }

      body.${DISCUSSION_CLASS} .comment-tree {
        width: min(var(--hn-content-width), 100%);
        margin: 0 auto !important;
      }

      body.${DISCUSSION_CLASS} .comment-tree .athing.comtr,
      body.${DISCUSSION_CLASS} .comment-tree .comtr {
        display: block !important;
        margin: 0 0 20px 0 !important;
        padding: 24px 28px !important;
        border: 1px solid rgba(159, 177, 171, 0.1);
        border-radius: 22px;
        background: rgba(8, 20, 27, 0.72);
        box-shadow: none;
      }

      body.${LIGHT_THEME_CLASS}.${DISCUSSION_CLASS} .fatitem {
        background:
          radial-gradient(circle at top left, rgba(245, 158, 11, 0.05), transparent 28%),
          linear-gradient(180deg, rgba(255, 255, 255, 0.7), rgba(255, 253, 248, 0.96)),
          var(--hn-panel);
      }

      body.${LIGHT_THEME_CLASS}.${DISCUSSION_CLASS} .comment-tree .athing.comtr,
      body.${LIGHT_THEME_CLASS}.${DISCUSSION_CLASS} .comment-tree .comtr {
        background: rgba(255, 251, 245, 0.96);
        border-color: rgba(28, 36, 40, 0.1);
        box-shadow: 0 14px 38px rgba(113, 91, 52, 0.08);
      }

      body.${DISCUSSION_CLASS} .comment-tree .comtr > td {
        display: block !important;
        width: auto !important;
        padding: 0 !important;
      }

      body.${DISCUSSION_CLASS} .comment-tree .ind {
        width: auto !important;
        min-width: 0 !important;
        padding-right: 0 !important;
      }

      body.${DISCUSSION_CLASS} .comment-tree .ind img {
        width: 0 !important;
        height: 0 !important;
        opacity: 0 !important;
      }

      body.${DISCUSSION_CLASS} .comment-tree .default {
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
      }

      body.${DISCUSSION_CLASS} .comment-tree .comhead {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 10px;
        margin-bottom: 16px;
        color: var(--hn-muted);
        font: 600 12px/1.5 var(--hn-sans);
      }

      body.${LIGHT_THEME_CLASS}.${DISCUSSION_CLASS} .comment-tree .comhead,
      body.${LIGHT_THEME_CLASS}.${DISCUSSION_CLASS} .comment-tree .navs,
      body.${LIGHT_THEME_CLASS}.${DISCUSSION_CLASS} .comment-tree .reply,
      body.${LIGHT_THEME_CLASS}.${DISCUSSION_CLASS} .fatitem .hn-editorial-meta,
      body.${LIGHT_THEME_CLASS}.${DISCUSSION_CLASS} .fatitem .toptext + form,
      body.${LIGHT_THEME_CLASS} .yclinks,
      body.${LIGHT_THEME_CLASS} .yclinks *,
      body.${LIGHT_THEME_CLASS} center > table:last-of-type tr td {
        color: #5c6a70 !important;
      }

      body.${DISCUSSION_CLASS} .comment-tree .comhead a,
      body.${DISCUSSION_CLASS} .comment-tree .navs a,
      body.${DISCUSSION_CLASS} .comment-tree .reply a,
      body.${DISCUSSION_CLASS} .fatitem .hn-editorial-meta a {
        color: inherit;
        text-decoration: none;
      }

      body.${DISCUSSION_CLASS} .comment-tree .comhead a:hover,
      body.${DISCUSSION_CLASS} .comment-tree .navs a:hover,
      body.${DISCUSSION_CLASS} .comment-tree .reply a:hover,
      body.${DISCUSSION_CLASS} .fatitem .hn-editorial-meta a:hover {
        color: #ffd386;
      }

      body.${DISCUSSION_CLASS} .comment-tree .comment,
      body.${DISCUSSION_CLASS} .comment-tree .commtext {
        color: var(--hn-text);
        font: 400 19px/1.85 var(--hn-serif);
      }

      body.${LIGHT_THEME_CLASS}.${DISCUSSION_CLASS} .comment-tree .comment,
      body.${LIGHT_THEME_CLASS}.${DISCUSSION_CLASS} .comment-tree .commtext,
      body.${LIGHT_THEME_CLASS}.${DISCUSSION_CLASS} .fatitem .toptext,
      body.${LIGHT_THEME_CLASS}.${DISCUSSION_CLASS} .fatitem .titleline > a,
      body.${LIGHT_THEME_CLASS} .titleline > a {
        color: #1c2428;
      }

      body.${DISCUSSION_CLASS} .comment-tree .comment p:first-child,
      body.${DISCUSSION_CLASS} .comment-tree .commtext p:first-child {
        margin-top: 0;
      }

      body.${DISCUSSION_CLASS} .commtext pre,
      body.${DISCUSSION_CLASS} .comment pre {
        overflow: auto;
        padding: 14px;
        border-radius: 16px;
        background: rgba(0, 0, 0, 0.22);
      }

      body.${DISCUSSION_CLASS} .comment-tree .navs,
      body.${DISCUSSION_CLASS} .comment-tree .reply {
        margin-top: 18px;
        color: var(--hn-muted);
        font: 700 11px/1.4 var(--hn-sans);
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .yclinks,
      .yclinks * {
        color: var(--hn-muted) !important;
      }

      .yclinks a,
      .pagetop a,
      .hnmore a {
        color: var(--hn-muted) !important;
        text-decoration: none !important;
      }

      .yclinks a:hover,
      .pagetop a:hover,
      .hnmore a:hover {
        color: #ffd386 !important;
      }

      center > table:last-of-type {
        width: min(var(--hn-content-width), 100%) !important;
        margin: 28px auto 0 !important;
        border-collapse: separate !important;
      }

      center > table:last-of-type tr td {
        color: var(--hn-muted) !important;
      }

      .yclinks {
        display: flex !important;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        margin: 0 auto 18px;
        padding: 18px 20px 0;
        font: 600 15px/1.6 var(--hn-sans);
      }

      .yclinks + br + form,
      .yclinks + form {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin: 0 auto;
        padding: 0 20px 12px;
        color: var(--hn-muted);
        font: 600 15px/1.4 var(--hn-sans);
      }

      .yclinks + br + form input[type="text"],
      .yclinks + form input[type="text"] {
        width: min(320px, 100%);
        min-height: 46px;
        padding: 0 16px;
        box-sizing: border-box;
      }

      .morelink,
      input[type="submit"] {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        padding: 0 18px;
        border: 1px solid transparent;
        border-radius: 999px;
        background: linear-gradient(135deg, #f4c15f, #f59e0b);
        color: #221302 !important;
        font: 700 12px/1 var(--hn-sans);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        text-decoration: none !important;
      }

      .morelink:hover,
      input[type="submit"]:hover {
        filter: brightness(1.03);
      }

      input,
      textarea,
      select {
        color: var(--hn-text);
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid var(--hn-line);
        border-radius: 14px;
      }

      body.${LIGHT_THEME_CLASS} input,
      body.${LIGHT_THEME_CLASS} textarea,
      body.${LIGHT_THEME_CLASS} select {
        background: rgba(255, 255, 255, 0.8);
        border-color: rgba(28, 36, 40, 0.14);
      }

      a:focus-visible,
      button:focus-visible,
      input:focus-visible,
      textarea:focus-visible,
      select:focus-visible {
        outline: 2px solid rgba(245, 158, 11, 0.7);
        outline-offset: 2px;
      }

      /* ── Submit / Login page ── */
      body.${SUBMIT_CLASS} {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-top: 80px;
        min-height: 100vh;
      }

      .hn-auth-card {
        background: var(--hn-panel);
        border: 1px solid var(--hn-line);
        border-radius: 24px;
        box-shadow: var(--hn-shadow);
        width: 100%;
        max-width: 420px;
        box-sizing: border-box;
        overflow: hidden;
      }

      .hn-auth-tabs {
        display: flex;
        border-bottom: 1px solid var(--hn-line);
      }

      .hn-auth-tab {
        flex: 1;
        padding: 16px 0;
        background: none;
        border: none;
        font: 600 13px/1 var(--hn-sans);
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--hn-muted);
        cursor: pointer;
        transition: color 160ms ease, background 160ms ease;
      }

      .hn-auth-tab[data-active="true"] {
        color: var(--hn-accent);
        background: rgba(245, 158, 11, 0.06);
      }

      .hn-auth-panel {
        padding: 32px 36px;
        display: none;
      }

      .hn-auth-panel[data-active="true"] {
        display: block;
      }

      .hn-submit-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 16px;
      }

      .hn-submit-field label {
        font: 600 11px/1 var(--hn-sans);
        letter-spacing: 0.07em;
        text-transform: uppercase;
        color: var(--hn-muted);
      }

      .hn-submit-field input[type="text"],
      .hn-submit-field input[type="password"] {
        width: 100% !important;
        min-height: 46px;
        padding: 0 16px;
        border-radius: 14px;
        font-size: 15px;
        box-sizing: border-box;
      }

      .hn-auth-panel input[type="submit"] {
        width: 100%;
        margin-top: 8px;
      }

      .hn-auth-footer {
        padding: 0 36px 20px;
        font: 400 13px/1.5 var(--hn-sans);
        color: var(--hn-muted);
        text-align: center;
      }

      .hn-auth-footer a {
        color: var(--hn-accent);
      }

      #hn-editorial-search {
        max-width: 780px;
        margin: 0 auto 20px;
        padding: 0 4px;
      }

      #hn-editorial-search-input {
        width: 100%;
        min-height: 48px;
        padding: 0 20px;
        border-radius: 999px;
        border: 1px solid var(--hn-line);
        background: var(--hn-panel);
        color: var(--hn-text);
        font: 400 16px/1 var(--hn-sans);
        box-sizing: border-box;
        box-shadow: var(--hn-shadow);
        transition: border-color 160ms ease, box-shadow 160ms ease;
      }

      body.${LIGHT_THEME_CLASS} #hn-editorial-search-input {
        background: rgba(255, 255, 255, 0.8);
        border-color: rgba(28, 36, 40, 0.14);
      }

      #hn-editorial-search-input:focus {
        outline: none;
        border-color: rgba(245, 158, 11, 0.5);
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.12), var(--hn-shadow);
      }

      #hn-editorial-search-input::placeholder {
        color: var(--hn-muted);
      }

      tr.athing.hn-search-hidden {
        display: none !important;
      }

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation: none !important;
          transition: none !important;
          scroll-behavior: auto !important;
        }
      }

      @media (max-width: 840px) {
        body.${PAGE_CLASS} {
          padding: 124px 12px 28px !important;
        }

        .hn-editorial-topbar__inner {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 10px;
        }

        .hn-editorial-nav {
          justify-content: flex-start;
        }

        .hn-editorial-actions {
          justify-content: flex-end;
        }

        body.${LISTING_CLASS} .athing {
          padding: 10px 16px !important;
          border-radius: 22px;
        }

        body.${LISTING_CLASS} span.rank {
          width: 36px;
          min-height: 36px;
          border-radius: 12px;
        }

        body.${LISTING_CLASS} .titleline > a {
          font-size: 23px;
        }

        .fatitem,
        .comment-tree {
          padding: 16px;
          border-radius: 20px;
        }

        body.${DISCUSSION_CLASS} .fatitem .titleline > a {
          font-size: 36px;
        }

        body.${DISCUSSION_CLASS} .comment-tree .comment,
        body.${DISCUSSION_CLASS} .comment-tree .commtext,
        body.${DISCUSSION_CLASS} .fatitem .toptext {
          font-size: 18px;
        }
      }

      @media (max-width: 560px) {
        body.${PAGE_CLASS} {
          padding-left: 8px !important;
          padding-right: 8px !important;
        }

        #${TOPBAR_ID} {
          padding: 14px 10px;
        }

        .hn-editorial-brand__section {
          font-size: 21px;
        }

        .hn-editorial-nav a {
          padding: 8px 10px;
          font-size: 11px;
        }

        .hn-editorial-actions {
          gap: 8px;
        }

        .hn-editorial-theme-toggle {
          min-width: 64px;
          height: 34px;
          padding: 0 12px;
        }

        body.${LISTING_CLASS} .athing {
          padding: 10px 14px !important;
        }

        body.${LISTING_CLASS} .titleline > a {
          font-size: 21px;
        }

        body.${LISTING_CLASS} span.rank {
          width: fit-content;
          min-height: 30px;
          margin-bottom: 2px;
        }

        body.${LISTING_CLASS} .hn-editorial-meta {
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: flex-start;
          font-size: 12px;
        }

        body.${LISTING_CLASS} .hn-editorial-meta-main,
        body.${LISTING_CLASS} .hn-editorial-meta-tags {
          flex-wrap: wrap;
          padding-left: 0;
        }

        body.${DISCUSSION_CLASS} .fatitem {
          padding: 20px 18px;
        }

        body.${DISCUSSION_CLASS} .fatitem .titleline > a {
          font-size: 28px;
        }

        body.${DISCUSSION_CLASS} .comment-tree .athing.comtr,
        body.${DISCUSSION_CLASS} .comment-tree .comtr {
          padding: 16px 16px !important;
          border-radius: 18px;
        }

        .yclinks {
          font-size: 14px;
          gap: 8px;
        }

        .yclinks + br + form,
        .yclinks + form {
          flex-direction: column;
          align-items: stretch;
        }
      }
    `;
  }

  function ensureTopbar() {
    if (document.getElementById(TOPBAR_ID)) {
      return;
    }

    const topbar = document.createElement("div");
    topbar.id = TOPBAR_ID;

    const sectionLabel = pageLabels[currentPath] || document.title.replace(" | Hacker News", "") || "Hacker News";
    const navMarkup = sections
      .map(({ href, label }) => {
        const isActive = currentPath === href || (href === "/news" && currentPath === "/");
        return `<a href="https://news.ycombinator.com${href}" data-active="${String(isActive)}">${label}</a>`;
      })
      .join("");

    topbar.innerHTML = `
      <div class="hn-editorial-topbar__inner">
        <div class="hn-editorial-brand">
          <div class="hn-editorial-brand__badge" aria-hidden="true">Y</div>
          <div class="hn-editorial-brand__meta">
            <span class="hn-editorial-brand__title">Hacker News Editorial</span>
            <span class="hn-editorial-brand__section">${sectionLabel}</span>
          </div>
        </div>
        <nav class="hn-editorial-nav" aria-label="Hacker News sections">
          ${navMarkup}
        </nav>
        <div class="hn-editorial-actions">
          <button id="hn-editorial-theme-toggle" class="hn-editorial-theme-toggle" type="button">Light</button>
        </div>
      </div>
    `;

    document.body.appendChild(topbar);
    setupThemeToggle();
  }

  function enhanceListings() {
    if (document.querySelector(".fatitem") || document.querySelector(".comment-tree")) {
      return;
    }

    const items = Array.from(document.querySelectorAll("tr.athing"));

    if (!items.length) {
      return;
    }

    document.body.classList.add(LISTING_CLASS);

    items.forEach((item) => {
      const titleline = item.querySelector(".titleline");
      const source = item.querySelector(".sitestr");
      const sitebit = titleline?.querySelector(".sitebit");
      const subtext = item.nextElementSibling?.querySelector(".subtext");
      const contentCell = item.querySelector("td:last-child");
      const titleLink = titleline?.querySelector("a");
      const isExternal = Boolean(source);
      const staleBadge = titleline?.querySelector(".hn-editorial-badge");

      if (staleBadge) {
        staleBadge.remove();
      }

      if (isExternal && titleLink) {
        titleLink.target = "_blank";
        titleLink.rel = "noopener noreferrer";
      }

      if (isExternal && source?.tagName === "SPAN") {
        const sourceLink = source.closest("a") || source.parentElement;

        if (sourceLink?.tagName === "A") {
          sourceLink.target = "_blank";
          sourceLink.rel = "noopener noreferrer";
        }
      }

      if (sitebit) {
        sitebit.remove();
      }

      if (subtext && contentCell && !contentCell.querySelector(".hn-editorial-meta")) {
        const meta = document.createElement("div");
        meta.className = "hn-editorial-meta";
        const metaMain = document.createElement("div");
        metaMain.className = "hn-editorial-meta-main";
        const metaTags = document.createElement("div");
        metaTags.className = "hn-editorial-meta-tags";

        const fragment = document.createDocumentFragment();

        while (subtext.firstChild) {
          fragment.appendChild(subtext.firstChild);
        }

        const nodes = Array.from(fragment.childNodes).filter((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent.trim() !== "|" && node.textContent.trim() !== "";
          }

          return true;
        });

        nodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const span = document.createElement("span");
            span.textContent = node.textContent.trim();
            if (span.textContent) {
              metaMain.appendChild(span);
            }
            return;
          }

          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "SPAN") {
            const span = document.createElement("span");
            span.innerHTML = node.innerHTML;
            metaMain.appendChild(span);
            return;
          }

          metaMain.appendChild(node);
        });

        if (source) {
          const sourceChip = document.createElement("span");
          sourceChip.className = "hn-editorial-source";

          const sourceLink = source.closest("a") || source.parentElement;
          if (sourceLink?.tagName === "A") {
            const sourceAnchor = document.createElement("a");
            sourceAnchor.href = sourceLink.href;
            sourceAnchor.target = "_blank";
            sourceAnchor.rel = "noopener noreferrer";
            sourceAnchor.textContent = source.textContent.trim();
            sourceChip.appendChild(sourceAnchor);
          } else {
            sourceChip.textContent = source.textContent.trim();
          }

          metaTags.appendChild(sourceChip);
        }

        const typeBadge = document.createElement("span");
        typeBadge.className = "hn-editorial-badge";
        typeBadge.textContent = isExternal ? "External" : "HN Native";
        metaTags.appendChild(typeBadge);

        meta.appendChild(metaMain);
        if (metaTags.childNodes.length) {
          meta.appendChild(metaTags);
        }
        contentCell.appendChild(meta);
      }
    });
  }

  function ensureSearch() {
    if (!document.body.classList.contains(LISTING_CLASS)) {
      return;
    }

    if (document.getElementById("hn-editorial-search")) {
      return;
    }

    const listingTable =
      document.querySelector("tr#bigbox > td > table") ||
      document.querySelector("table.itemlist");

    if (!listingTable) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.id = "hn-editorial-search";
    wrapper.innerHTML = `<input type="search" id="hn-editorial-search-input" placeholder="Filter stories…" autocomplete="off" aria-label="Filter stories" />`;
    listingTable.parentNode.insertBefore(wrapper, listingTable);

    const input = wrapper.querySelector("input");

    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();

      document.querySelectorAll("tr.athing").forEach((item) => {
        const title = item.querySelector(".titleline > a")?.textContent?.toLowerCase() || "";
        item.classList.toggle("hn-search-hidden", Boolean(query) && !title.includes(query));
      });
    });
  }

  function enhanceDiscussion() {
    const fatItem = document.querySelector(".fatitem");
    const commentTree = document.querySelector(".comment-tree");

    if (!fatItem && !commentTree) {
      return;
    }

    document.body.classList.add(DISCUSSION_CLASS);
  }

  function enhanceSubmitPage() {
    if (currentPath !== "/submit") return;
    document.body.classList.add(SUBMIT_CLASS);

    const body = document.body;
    const forms = Array.from(body.querySelectorAll("form"));
    const forgotLink = body.querySelector("a[href='forgot']");

    const topbar = document.getElementById(TOPBAR_ID);
    body.innerHTML = "";
    if (topbar) body.appendChild(topbar);

    function buildPanel(form, tabId) {
      const panel = document.createElement("div");
      panel.className = "hn-auth-panel";
      panel.dataset.active = tabId === "signin" ? "true" : "false";
      panel.dataset.tab = tabId;

      const newForm = document.createElement("form");
      newForm.action = form.action;
      newForm.method = form.method;

      form.querySelectorAll("input[type=hidden]").forEach(h => newForm.appendChild(h.cloneNode(true)));

      Array.from(form.querySelectorAll("tr")).forEach(row => {
        const tds = row.querySelectorAll("td");
        if (tds.length === 2) {
          const fieldDiv = document.createElement("div");
          fieldDiv.className = "hn-submit-field";
          const lbl = document.createElement("label");
          lbl.textContent = tds[0].textContent.replace(":", "").trim();
          const inp = tds[1].querySelector("input").cloneNode(true);
          const uid = tabId + "_" + inp.name;
          inp.id = uid;
          lbl.setAttribute("for", uid);
          fieldDiv.appendChild(lbl);
          fieldDiv.appendChild(inp);
          newForm.appendChild(fieldDiv);
        }
      });

      const submitBtn = form.querySelector("input[type=submit]").cloneNode(true);
      newForm.appendChild(submitBtn);
      panel.appendChild(newForm);
      return panel;
    }

    const card = document.createElement("div");
    card.className = "hn-auth-card";

    // Tabs
    const tabs = document.createElement("div");
    tabs.className = "hn-auth-tabs";
    ["Sign In", "Sign Up"].forEach((label, i) => {
      const btn = document.createElement("button");
      btn.className = "hn-auth-tab";
      btn.textContent = label;
      btn.type = "button";
      btn.dataset.tab = i === 0 ? "signin" : "signup";
      btn.dataset.active = i === 0 ? "true" : "false";
      btn.addEventListener("click", () => {
        tabs.querySelectorAll(".hn-auth-tab").forEach(t => t.dataset.active = "false");
        card.querySelectorAll(".hn-auth-panel").forEach(p => p.dataset.active = "false");
        btn.dataset.active = "true";
        card.querySelector(`.hn-auth-panel[data-tab="${btn.dataset.tab}"]`).dataset.active = "true";
      });
      tabs.appendChild(btn);
    });
    card.appendChild(tabs);

    if (forms[0]) card.appendChild(buildPanel(forms[0], "signin"));
    if (forms[1]) card.appendChild(buildPanel(forms[1], "signup"));

    if (forgotLink) {
      const footer = document.createElement("div");
      footer.className = "hn-auth-footer";
      footer.appendChild(forgotLink.cloneNode(true));
      card.appendChild(footer);
    }

    body.appendChild(card);
  }

  function boot() {
    if (!document.body || !document.head) {
      return;
    }

    document.body.classList.add(PAGE_CLASS);
    initializeTheme();
    ensureStyle();
    ensureTopbar();
    setupThemeToggle();
    enhanceListings();
    ensureSearch();
    enhanceDiscussion();
    enhanceSubmitPage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
