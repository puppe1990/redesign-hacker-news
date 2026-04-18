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
  const FORGOT_CLASS = "hn-editorial-forgot";
  const FAVORITES_CLASS = "hn-editorial-favorites";
  const FAVORITES_COMMENT_CLASS = "hn-editorial-fav-comments";
  const SHOWLIM_CLASS = "hn-editorial-showlim";
  const USER_CLASS = "hn-editorial-user";
  const LIGHT_THEME_CLASS = "hn-theme-light";
  const THEME_STORAGE_KEY = "hn-editorial-theme";

  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/news";
  const isFavoritesComments = currentPath === "/favorites" &&
    new URLSearchParams(window.location.search).get("comments") === "t";

  const sections = [
    { href: "/newest", label: "New" },
    { href: "/front", label: "Past" },
    { href: "/newcomments", label: "Comments" },
    { href: "/ask", label: "Ask" },
    { href: "/show", label: "Show" },
    { href: "/jobs", label: "Jobs" },
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
    "/favorites": "Favorites",
    "/showlim": "Show HN"
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
        --hn-accent: #ff6600;
        --hn-accent-soft: rgba(255, 102, 0, 0.16);
        --hn-line: rgba(159, 177, 171, 0.14);
        --hn-line-strong: rgba(255, 102, 0, 0.2);
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
        --hn-accent-soft: rgba(255, 102, 0, 0.12);
        --hn-line: rgba(28, 36, 40, 0.12);
        --hn-line-strong: rgba(255, 102, 0, 0.24);
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
          radial-gradient(circle at top left, rgba(255, 102, 0, 0.13), transparent 24%),
          radial-gradient(circle at top right, rgba(255, 102, 0, 0.05), transparent 22%),
          linear-gradient(180deg, #0a1418 0%, #081216 42%, #050d11 100%) !important;
      }

      body.${LIGHT_THEME_CLASS} {
        background:
          radial-gradient(circle at top left, rgba(255, 102, 0, 0.14), transparent 24%),
          radial-gradient(circle at top right, rgba(255, 102, 0, 0.06), transparent 22%),
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
        color: #ffffff;
        font: 700 16px/1 var(--hn-sans);
        background:
          linear-gradient(135deg, #ff8533, #ff6600 55%, #cc5200);
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
        color: #ffffff;
        background: linear-gradient(135deg, #ff8533, #ff6600);
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
          radial-gradient(circle at top left, rgba(255, 102, 0, 0.07), transparent 30%),
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
        border: 1px solid rgba(255, 102, 0, 0.25);
        color: #ff9955;
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
        color: #ff9955;
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
        background: rgba(255, 102, 0, 0.45);
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
        color: #ff9955;
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
          radial-gradient(circle at top left, rgba(255, 102, 0, 0.05), transparent 28%),
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
        color: #ff9955;
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
        background: rgba(255, 102, 0, 0.45);
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
          radial-gradient(circle at top left, rgba(255, 102, 0, 0.05), transparent 28%),
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
        color: #ff9955;
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
        background: linear-gradient(135deg, #ff8533, #ff6600);
        color: #ffffff !important;
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

      body.${LIGHT_THEME_CLASS} input:not([type="submit"]),
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
        outline: 2px solid rgba(255, 102, 0, 0.7);
        outline-offset: 2px;
      }

      /* ── Submit / Login page ── */
      body.${SUBMIT_CLASS} {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding-top: 70px;
        padding-bottom: 40px;
        box-sizing: border-box;
        margin: 0;
      }

      /* ── Submit story card (logged-in submit form) ── */
      .hn-story-card {
        background: var(--hn-panel);
        border: 1px solid var(--hn-line);
        border-radius: 24px;
        box-shadow: var(--hn-shadow);
        width: 100%;
        max-width: 520px;
        box-sizing: border-box;
        overflow: hidden;
      }

      .hn-story-card__header {
        padding: 24px 28px 20px;
        border-bottom: 1px solid var(--hn-line);
      }

      .hn-story-card__title {
        font: 700 18px/1.2 var(--hn-serif);
        color: var(--hn-text);
        margin: 0 0 4px;
      }

      .hn-story-card__subtitle {
        font: 400 13px/1.5 var(--hn-sans);
        color: var(--hn-muted);
        margin: 0;
      }

      .hn-story-card__body {
        padding: 24px 28px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .hn-story-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .hn-story-field label {
        font: 600 11px/1 var(--hn-sans);
        letter-spacing: 0.07em;
        text-transform: uppercase;
        color: var(--hn-muted);
      }

      .hn-story-field input[type="text"],
      .hn-story-field input[type="url"] {
        width: 100% !important;
        min-height: 46px;
        padding: 0 16px;
        border-radius: 14px;
        font-size: 15px;
        box-sizing: border-box;
      }

      .hn-story-field textarea {
        width: 100% !important;
        min-height: 120px;
        padding: 12px 16px;
        border-radius: 14px;
        font-size: 15px;
        box-sizing: border-box;
        resize: vertical;
        font-family: var(--hn-sans);
      }

      .hn-story-card__hint {
        padding: 0 28px 20px;
        font: 400 13px/1.6 var(--hn-sans);
        color: var(--hn-muted);
      }

      .hn-story-card__hint a {
        color: var(--hn-accent);
        text-decoration: none;
      }

      .hn-story-card__footer {
        padding: 16px 28px 24px;
        border-top: 1px solid var(--hn-line);
      }

      .hn-story-card__footer input[type="submit"] {
        width: 100%;
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
        background: rgba(255, 102, 0, 0.06);
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
        padding: 0 46px 0 16px;
        border-radius: 14px;
        font-size: 15px;
        box-sizing: border-box;
      }

      .hn-pw-wrap {
        position: relative;
      }

      .hn-pw-wrap input {
        width: 100% !important;
      }

      .hn-pw-toggle {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: var(--hn-muted);
        font-size: 13px;
        line-height: 1;
        user-select: none;
      }

      .hn-pw-toggle:hover {
        color: var(--hn-text);
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

      /* ── Forgot password page ── */
      body.${FORGOT_CLASS} {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        overflow: hidden;
        padding-top: 70px;
        box-sizing: border-box;
        margin: 0;
      }

      .hn-forgot-card {
        background: var(--hn-panel);
        border: 1px solid var(--hn-line);
        border-radius: 24px;
        padding: 36px;
        box-shadow: var(--hn-shadow);
        width: 100%;
        max-width: 420px;
        box-sizing: border-box;
      }

      .hn-forgot-card h2 {
        font: 700 20px/1.2 var(--hn-sans);
        color: var(--hn-text);
        margin: 0 0 24px 0;
      }

      .hn-forgot-card input[type="submit"] {
        width: 100%;
        margin-top: 8px;
      }

      /* ── Show HN limit page ── */
      body.${SHOWLIM_CLASS} {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding-top: 70px;
        box-sizing: border-box;
      }

      .hn-showlim-card {
        background: var(--hn-panel);
        border: 1px solid var(--hn-line);
        border-radius: 28px;
        padding: 52px 48px 44px;
        box-shadow: var(--hn-shadow);
        width: 100%;
        max-width: 520px;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
      }

      .hn-showlim-card::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse 60% 40% at 50% -10%, rgba(255,102,0,0.09) 0%, transparent 70%);
        pointer-events: none;
      }

      .hn-showlim-badge {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        background: var(--hn-accent-soft);
        border: 1px solid rgba(255,102,0,0.25);
        border-radius: 999px;
        padding: 5px 14px 5px 10px;
        margin-bottom: 24px;
      }

      .hn-showlim-badge-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--hn-accent);
        flex-shrink: 0;
        animation: hn-showlim-pulse 2.4s ease-in-out infinite;
      }

      @keyframes hn-showlim-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.75); }
      }

      .hn-showlim-badge-label {
        font: 600 11px/1 var(--hn-sans);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--hn-accent);
      }

      .hn-showlim-title {
        font: 700 28px/1.2 var(--hn-serif);
        color: var(--hn-text);
        margin: 0 0 16px;
        letter-spacing: -0.01em;
      }

      .hn-showlim-body {
        font: 400 16px/1.65 var(--hn-sans);
        color: var(--hn-muted);
        margin: 0 0 36px;
      }

      .hn-showlim-divider {
        height: 1px;
        background: var(--hn-line);
        margin: 0 0 28px;
      }

      .hn-showlim-links-label {
        font: 600 11px/1 var(--hn-sans);
        letter-spacing: 0.09em;
        text-transform: uppercase;
        color: var(--hn-muted);
        margin: 0 0 16px;
      }

      .hn-showlim-links {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .hn-showlim-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 18px;
        background: rgba(255,255,255,0.03);
        border: 1px solid var(--hn-line);
        border-radius: 14px;
        text-decoration: none;
        transition: border-color 160ms ease, background 160ms ease, transform 160ms ease;
      }

      body.${LIGHT_THEME_CLASS} .hn-showlim-link {
        background: rgba(0,0,0,0.025);
      }

      .hn-showlim-link:hover {
        border-color: rgba(255,102,0,0.35);
        background: rgba(255,102,0,0.06);
        transform: translateX(3px);
      }

      .hn-showlim-link-icon {
        width: 32px;
        height: 32px;
        border-radius: 9px;
        background: var(--hn-accent-soft);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 15px;
      }

      .hn-showlim-link-text {
        flex: 1;
        min-width: 0;
      }

      .hn-showlim-link-name {
        font: 600 14px/1.2 var(--hn-sans);
        color: var(--hn-text);
        margin-bottom: 2px;
      }

      .hn-showlim-link-url {
        font: 400 11px/1 var(--hn-mono);
        color: var(--hn-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .hn-showlim-link-arrow {
        color: var(--hn-muted);
        font-size: 16px;
        flex-shrink: 0;
        transition: color 160ms ease, transform 160ms ease;
      }

      .hn-showlim-link:hover .hn-showlim-link-arrow {
        color: var(--hn-accent);
        transform: translateX(2px);
      }

      @media (max-width: 560px) {
        .hn-showlim-card {
          padding: 36px 24px 32px;
          border-radius: 20px;
        }
        .hn-showlim-title { font-size: 22px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .hn-showlim-badge-dot { animation: none; }
        .hn-showlim-link { transition: none; }
        .hn-showlim-link:hover { transform: none; }
      }

      /* ── User profile page ── */
      body.${USER_CLASS} {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding-top: 80px;
        padding-bottom: 40px;
        box-sizing: border-box;
      }

      .hn-user-card {
        background: var(--hn-panel);
        border: 1px solid var(--hn-line);
        border-radius: 28px;
        box-shadow: var(--hn-shadow);
        width: 100%;
        max-width: 480px;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
      }

      .hn-user-card::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse 70% 40% at 50% -5%, rgba(255, 102, 0, 0.08) 0%, transparent 70%);
        pointer-events: none;
      }

      .hn-user-card__header {
        padding: 36px 36px 28px;
        display: flex;
        align-items: center;
        gap: 20px;
        border-bottom: 1px solid var(--hn-line);
      }

      .hn-user-avatar {
        width: 64px;
        height: 64px;
        border-radius: 20px;
        display: grid;
        place-items: center;
        font: 700 28px/1 var(--hn-sans);
        color: #ffffff;
        background: linear-gradient(135deg, #ff8533, #ff6600 55%, #cc5200);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.26), 0 8px 24px rgba(255, 102, 0, 0.28);
        flex-shrink: 0;
      }

      .hn-user-meta {
        min-width: 0;
      }

      .hn-user-name {
        font: 600 26px/1.1 var(--hn-serif);
        color: var(--hn-text);
        letter-spacing: -0.01em;
        margin-bottom: 5px;
        word-break: break-word;
      }

      .hn-user-handle {
        font: 600 11px/1 var(--hn-sans);
        letter-spacing: 0.07em;
        text-transform: uppercase;
        color: var(--hn-muted);
      }

      .hn-user-stats {
        display: flex;
        border-bottom: 1px solid var(--hn-line);
      }

      .hn-user-stat {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        padding: 20px 16px;
        border-right: 1px solid var(--hn-line);
      }

      .hn-user-stat:last-child {
        border-right: none;
      }

      .hn-user-stat__value {
        font: 700 22px/1 var(--hn-sans);
        color: var(--hn-text);
      }

      .hn-user-stat__label {
        font: 600 10px/1 var(--hn-sans);
        letter-spacing: 0.07em;
        text-transform: uppercase;
        color: var(--hn-muted);
      }

      .hn-user-about {
        padding: 22px 32px;
        border-bottom: 1px solid var(--hn-line);
        color: var(--hn-text);
        font: 400 16px/1.7 var(--hn-serif);
      }

      .hn-user-about a {
        color: #ff9955;
        text-decoration: none;
      }

      .hn-user-about a:hover {
        text-decoration: underline;
      }

      .hn-user-links {
        display: flex;
        gap: 8px;
        padding: 20px 28px;
        flex-wrap: wrap;
      }

      .hn-user-link {
        flex: 1;
        text-align: center;
        padding: 10px 16px;
        border-radius: 999px;
        border: 1px solid var(--hn-line);
        background: rgba(255, 255, 255, 0.03);
        color: var(--hn-muted);
        font: 600 11px/1 var(--hn-sans);
        letter-spacing: 0.06em;
        text-transform: uppercase;
        text-decoration: none;
        transition: color 160ms ease, background 160ms ease, border-color 160ms ease, transform 160ms ease;
      }

      .hn-user-link:hover {
        color: var(--hn-text);
        background: rgba(255, 255, 255, 0.06);
        border-color: var(--hn-line-strong);
        transform: translateY(-1px);
      }

      body.${LIGHT_THEME_CLASS} .hn-user-link {
        background: rgba(0, 0, 0, 0.03);
      }

      body.${LIGHT_THEME_CLASS} .hn-user-link:hover {
        background: rgba(0, 0, 0, 0.06);
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
        border-color: rgba(255, 102, 0, 0.5);
        box-shadow: 0 0 0 3px rgba(255, 102, 0, 0.12), var(--hn-shadow);
      }

      #hn-editorial-search-input::placeholder {
        color: var(--hn-muted);
      }

      tr.athing.hn-search-hidden {
        display: none !important;
      }

      /* ── Favorites page: tab nav ── */
      body.${FAVORITES_CLASS} tr#bigbox > td > div:first-child {
        display: flex !important;
        align-items: center;
        justify-content: center;
        gap: 6px;
        max-width: 780px;
        margin: 0 auto 28px !important;
        padding: 5px !important;
        background: var(--hn-panel);
        border: 1px solid var(--hn-line);
        border-radius: 999px;
        box-shadow: var(--hn-shadow);
        text-align: left !important;
      }

      body.${FAVORITES_CLASS} tr#bigbox > td > div:first-child > a {
        flex: 1;
        text-align: center;
        padding: 9px 20px;
        border-radius: 999px;
        font: 600 11px/1 var(--hn-sans);
        letter-spacing: 0.06em;
        text-transform: uppercase;
        text-decoration: none;
        color: var(--hn-muted);
        transition: color 160ms ease, background 160ms ease;
      }

      body.${FAVORITES_CLASS} tr#bigbox > td > div:first-child > a:hover {
        color: var(--hn-text);
        background: rgba(255, 255, 255, 0.04);
      }

      body.${FAVORITES_CLASS} tr#bigbox > td > div:first-child > a[data-active="true"] {
        color: #ffffff;
        background: linear-gradient(135deg, #ff8533, #ff6600);
      }

      body.${FAVORITES_CLASS} tr#bigbox > td > div:first-child > span {
        display: none !important;
      }

      /* ── Favorites comments: layout container ── */
      body.${FAVORITES_COMMENT_CLASS} tr#bigbox > td > table {
        display: block !important;
        width: 100% !important;
        max-width: 780px !important;
        margin: 0 auto !important;
        border-collapse: separate !important;
        border-spacing: 0 16px !important;
      }

      body.${FAVORITES_COMMENT_CLASS} tr#bigbox > td > table > tbody {
        display: block !important;
        width: 100% !important;
      }

      /* ── Favorites comment card ── */
      body.${FAVORITES_COMMENT_CLASS} .athing {
        display: block !important;
        max-width: 780px;
        margin: 0 auto !important;
        padding: 24px 28px !important;
        border: 1px solid var(--hn-line);
        border-radius: 22px;
        background:
          radial-gradient(circle at top left, rgba(255, 102, 0, 0.05), transparent 30%),
          linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent 50%),
          var(--hn-panel);
        box-shadow: var(--hn-shadow);
        transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
      }

      body.${FAVORITES_COMMENT_CLASS} .athing:hover {
        transform: translateY(-3px);
        border-color: var(--hn-line-strong);
        box-shadow: 0 32px 90px rgba(0, 0, 0, 0.38);
      }

      body.${FAVORITES_COMMENT_CLASS} .athing > td {
        display: block !important;
        padding: 0 !important;
      }

      body.${FAVORITES_COMMENT_CLASS} .athing > td.ind,
      body.${FAVORITES_COMMENT_CLASS} .athing > td.votelinks {
        display: none !important;
      }

      body.${FAVORITES_COMMENT_CLASS} .spacer {
        display: none !important;
      }

      /* story context label */
      body.${FAVORITES_COMMENT_CLASS} .onstory {
        display: block;
        margin-bottom: 12px;
        padding: 7px 12px;
        border-radius: 10px;
        background: var(--hn-accent-soft);
        border: 1px solid rgba(255, 102, 0, 0.18);
        font: 600 11px/1.4 var(--hn-sans);
        letter-spacing: 0.04em;
        color: #ff9955;
      }

      body.${FAVORITES_COMMENT_CLASS} .onstory::before {
        content: "saved from  ·  ";
        color: var(--hn-muted);
        text-transform: uppercase;
        font-size: 10px;
        letter-spacing: 0.07em;
      }

      body.${FAVORITES_COMMENT_CLASS} .onstory > a {
        color: #ff9955 !important;
        text-decoration: none;
      }

      body.${FAVORITES_COMMENT_CLASS} .onstory > a:hover {
        color: #ffb077 !important;
      }

      /* comhead: author + time + nav */
      body.${FAVORITES_COMMENT_CLASS} .comhead {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 10px;
        margin-bottom: 14px;
        font: 600 12px/1.5 var(--hn-sans);
        color: var(--hn-muted);
      }

      body.${FAVORITES_COMMENT_CLASS} .comhead a.hnuser {
        color: var(--hn-text) !important;
        font-weight: 700;
        font-size: 13px;
        text-decoration: none;
      }

      body.${FAVORITES_COMMENT_CLASS} .comhead a.hnuser:hover {
        color: #ff9955 !important;
      }

      body.${FAVORITES_COMMENT_CLASS} .comhead .age a,
      body.${FAVORITES_COMMENT_CLASS} .comhead .navs a {
        color: var(--hn-muted);
        text-decoration: none;
      }

      body.${FAVORITES_COMMENT_CLASS} .comhead .age a:hover,
      body.${FAVORITES_COMMENT_CLASS} .comhead .navs a:hover {
        color: #ff9955;
      }

      body.${FAVORITES_COMMENT_CLASS} .comhead .navs {
        display: flex;
        gap: 8px;
        color: var(--hn-muted);
      }

      body.${FAVORITES_COMMENT_CLASS} .comhead .onstory {
        display: none; /* hidden here, shown above as context banner */
      }

      /* divider between comhead and comment text */
      body.${FAVORITES_COMMENT_CLASS} .comment {
        border-top: 1px solid var(--hn-line);
        padding-top: 14px;
      }

      body.${FAVORITES_COMMENT_CLASS} .commtext {
        color: var(--hn-text);
        font: 400 18px/1.85 var(--hn-serif);
      }

      body.${FAVORITES_COMMENT_CLASS} .commtext p:first-child {
        margin-top: 0;
      }

      body.${FAVORITES_COMMENT_CLASS} .commtext a {
        color: #ff9955;
        text-decoration: none;
      }

      body.${FAVORITES_COMMENT_CLASS} .commtext a:hover {
        text-decoration: underline;
      }

      body.${FAVORITES_COMMENT_CLASS} .commtext pre {
        overflow: auto;
        padding: 14px;
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.22);
        font-size: 14px;
      }

      body.${FAVORITES_COMMENT_CLASS} .reply {
        margin-top: 14px;
        font: 700 11px/1 var(--hn-sans);
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--hn-muted);
      }

      body.${FAVORITES_COMMENT_CLASS} .reply a {
        color: var(--hn-muted);
        text-decoration: none;
      }

      body.${FAVORITES_COMMENT_CLASS} .reply a:hover {
        color: #ff9955;
      }

      /* light theme adjustments */
      body.${LIGHT_THEME_CLASS}.${FAVORITES_COMMENT_CLASS} .athing {
        background:
          radial-gradient(circle at top left, rgba(255, 102, 0, 0.04), transparent 28%),
          linear-gradient(180deg, rgba(255, 255, 255, 0.7), rgba(255, 253, 248, 0.96)),
          var(--hn-panel);
        border-color: rgba(28, 36, 40, 0.1);
        box-shadow: 0 14px 38px rgba(113, 91, 52, 0.08);
      }

      body.${LIGHT_THEME_CLASS}.${FAVORITES_COMMENT_CLASS} .commtext {
        color: #1c2428;
      }

      body.${LIGHT_THEME_CLASS}.${FAVORITES_COMMENT_CLASS} .comhead a.hnuser {
        color: #1c2428 !important;
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

  function enhanceFavorites() {
    if (currentPath !== "/favorites") return;
    document.body.classList.add(FAVORITES_CLASS);

    // Style the tab nav (submissions | comments)
    const tabDiv = document.querySelector("tr#bigbox > td > div");
    if (tabDiv) {
      // Mark active tab link
      tabDiv.querySelectorAll("a").forEach(a => {
        const href = a.getAttribute("href") || "";
        const isComments = href.includes("comments=t");
        a.dataset.active = String(isFavoritesComments ? isComments : !isComments);
      });
    }

    if (!isFavoritesComments) return;
    document.body.classList.add(FAVORITES_COMMENT_CLASS);

    // Promote .onstory banner above .comhead in each comment card
    document.querySelectorAll("tr.athing").forEach(row => {
      const defaultTd = row.querySelector("td.default");
      if (!defaultTd) return;
      const onstory = defaultTd.querySelector(".onstory");
      if (!onstory) return;
      // Clone onstory as top-level banner inside the card
      const banner = document.createElement("div");
      banner.className = "onstory";
      banner.innerHTML = onstory.innerHTML;
      defaultTd.insertBefore(banner, defaultTd.firstChild);
    });
  }

  function enhanceListings() {
    if (document.querySelector(".fatitem") || document.querySelector(".comment-tree")) {
      return;
    }

    if (isFavoritesComments) return;

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

  function enhanceForgotPage() {
    if (currentPath !== "/forgot") return;
    document.body.classList.add(FORGOT_CLASS);

    const body = document.body;
    const form = body.querySelector("form");
    const title = body.querySelector("b");
    const topbar = document.getElementById(TOPBAR_ID);
    body.innerHTML = "";
    if (topbar) body.appendChild(topbar);

    const card = document.createElement("div");
    card.className = "hn-forgot-card";

    const h2 = document.createElement("h2");
    h2.textContent = title ? title.textContent : "Reset your password";
    card.appendChild(h2);

    if (form) {
      const newForm = document.createElement("form");
      newForm.action = form.action;
      newForm.method = form.method;

      form.querySelectorAll("input[type=hidden]").forEach(h => newForm.appendChild(h.cloneNode(true)));

      const fieldDiv = document.createElement("div");
      fieldDiv.className = "hn-submit-field";
      const lbl = document.createElement("label");
      lbl.textContent = "Username";
      lbl.setAttribute("for", "forgot_username");
      const inp = form.querySelector("input[type=text]").cloneNode(true);
      inp.id = "forgot_username";
      fieldDiv.appendChild(lbl);
      fieldDiv.appendChild(inp);
      newForm.appendChild(fieldDiv);

      const btn = form.querySelector("input[type=submit]").cloneNode(true);
      newForm.appendChild(btn);
      card.appendChild(newForm);
    }

    body.appendChild(card);
  }

  function enhanceShowlim() {
    if (currentPath !== "/showlim") return;
    document.body.classList.add(SHOWLIM_CLASS);

    const body = document.body;
    const bigbox = body.querySelector("#bigbox td");
    if (!bigbox) return;

    const paragraphs = bigbox.querySelectorAll("td");
    const mainText = paragraphs[0] ? paragraphs[0].textContent.trim() : "";
    const rawLinks = bigbox.querySelectorAll("a[href]");

    const linkMeta = {
      "newsguidelines": { name: "Community Guidelines", icon: "📋" },
      "newswelcome":    { name: "Welcome to HN",        icon: "👋" },
      "showhn":         { name: "About Show HN",        icon: "💡" }
    };

    const topbar = document.getElementById(TOPBAR_ID);
    body.innerHTML = "";
    if (topbar) body.appendChild(topbar);

    const card = document.createElement("div");
    card.className = "hn-showlim-card";

    const badge = document.createElement("div");
    badge.className = "hn-showlim-badge";
    badge.innerHTML = `<span class="hn-showlim-badge-dot"></span><span class="hn-showlim-badge-label">Temporarily Restricted</span>`;
    card.appendChild(badge);

    const title = document.createElement("h1");
    title.className = "hn-showlim-title";
    title.textContent = "Show HN is paused for you";
    card.appendChild(title);

    const bodyText = document.createElement("p");
    bodyText.className = "hn-showlim-body";
    bodyText.textContent = mainText || "We're temporarily restricting Show HNs. Take some time to get to know the community, become a good contributor, and then it will be fine to post an occasional Show HN.";
    card.appendChild(bodyText);

    const divider = document.createElement("div");
    divider.className = "hn-showlim-divider";
    card.appendChild(divider);

    const linksLabel = document.createElement("div");
    linksLabel.className = "hn-showlim-links-label";
    linksLabel.textContent = "Get started";
    card.appendChild(linksLabel);

    const linksList = document.createElement("div");
    linksList.className = "hn-showlim-links";

    rawLinks.forEach(a => {
      const href = a.getAttribute("href");
      const key = Object.keys(linkMeta).find(k => href.includes(k));
      const meta = key ? linkMeta[key] : { name: href.split("/").pop(), icon: "→" };

      const link = document.createElement("a");
      link.className = "hn-showlim-link";
      link.href = href;
      link.innerHTML = `
        <span class="hn-showlim-link-icon">${meta.icon}</span>
        <span class="hn-showlim-link-text">
          <div class="hn-showlim-link-name">${meta.name}</div>
          <div class="hn-showlim-link-url">${href.replace("https://news.ycombinator.com/", "")}</div>
        </span>
        <span class="hn-showlim-link-arrow">›</span>
      `;
      linksList.appendChild(link);
    });

    card.appendChild(linksList);
    body.appendChild(card);
  }

  function enhanceUserPage() {
    if (currentPath !== "/user") return;
    document.body.classList.add(USER_CLASS);

    const body = document.body;
    const bigbox = body.querySelector("#bigbox td");
    if (!bigbox) return;

    let username = "", created = "", karma = "", aboutHTML = "";
    const links = [];

    bigbox.querySelectorAll("tr").forEach(row => {
      const tds = row.querySelectorAll("td");
      if (tds.length < 2) return;
      const label = tds[0].textContent.trim().replace(":", "").toLowerCase();
      const val = tds[1];

      if (label === "user") {
        username = val.querySelector("a.hnuser")?.textContent.trim() || val.textContent.trim();
      } else if (label === "created") {
        created = val.querySelector(".age a")?.textContent.trim() || val.textContent.trim();
      } else if (label === "karma") {
        karma = val.textContent.trim();
      } else if (label === "about") {
        aboutHTML = val.innerHTML.trim();
      } else if (label === "") {
        const a = val.querySelector("a");
        if (a) links.push({ href: a.getAttribute("href"), text: a.textContent.trim() });
      }
    });

    const topbar = document.getElementById(TOPBAR_ID);
    body.innerHTML = "";
    if (topbar) body.appendChild(topbar);

    const card = document.createElement("div");
    card.className = "hn-user-card";

    const header = document.createElement("div");
    header.className = "hn-user-card__header";

    const avatar = document.createElement("div");
    avatar.className = "hn-user-avatar";
    avatar.textContent = (username.charAt(0) || "?").toUpperCase();

    const meta = document.createElement("div");
    meta.className = "hn-user-meta";

    const nameEl = document.createElement("div");
    nameEl.className = "hn-user-name";
    nameEl.textContent = username;

    const handleEl = document.createElement("div");
    handleEl.className = "hn-user-handle";
    handleEl.textContent = "Hacker News Member";

    meta.appendChild(nameEl);
    meta.appendChild(handleEl);
    header.appendChild(avatar);
    header.appendChild(meta);
    card.appendChild(header);

    const stats = document.createElement("div");
    stats.className = "hn-user-stats";

    if (karma) {
      const s = document.createElement("div");
      s.className = "hn-user-stat";
      s.innerHTML = `<span class="hn-user-stat__value">${karma}</span><span class="hn-user-stat__label">Karma</span>`;
      stats.appendChild(s);
    }

    if (created) {
      const s = document.createElement("div");
      s.className = "hn-user-stat";
      s.innerHTML = `<span class="hn-user-stat__value">${created}</span><span class="hn-user-stat__label">Member since</span>`;
      stats.appendChild(s);
    }

    if (stats.childNodes.length) card.appendChild(stats);

    if (aboutHTML) {
      const aboutDiv = document.createElement("div");
      aboutDiv.className = "hn-user-about";
      aboutDiv.innerHTML = aboutHTML;
      card.appendChild(aboutDiv);
    }

    if (links.length) {
      const linksDiv = document.createElement("div");
      linksDiv.className = "hn-user-links";
      links.forEach(({ href, text }) => {
        const a = document.createElement("a");
        a.className = "hn-user-link";
        a.href = href;
        a.textContent = text;
        linksDiv.appendChild(a);
      });
      card.appendChild(linksDiv);
    }

    body.appendChild(card);
  }

  function enhanceSubmitPage() {
    if (currentPath !== "/submit") return;
    document.body.classList.add(SUBMIT_CLASS);

    const body = document.body;

    // Logged-in submit page: single form with fnop=submit-page
    const storyForm = body.querySelector("form input[name='fnop'][value='submit-page']")?.closest("form");
    if (storyForm) {
      const clonedForm = storyForm.cloneNode(true);
      const topbar = document.getElementById(TOPBAR_ID);
      body.innerHTML = "";
      if (topbar) body.appendChild(topbar);

      const card = document.createElement("div");
      card.className = "hn-story-card";

      const header = document.createElement("div");
      header.className = "hn-story-card__header";
      header.innerHTML = `<h2 class="hn-story-card__title">Submit a Story</h2><p class="hn-story-card__subtitle">Share something worth reading with Hacker News</p>`;
      card.appendChild(header);

      const newForm = document.createElement("form");
      newForm.action = clonedForm.action;
      newForm.method = clonedForm.method;
      clonedForm.querySelectorAll("input[type=hidden]").forEach(h => newForm.appendChild(h.cloneNode(true)));

      const bodyDiv = document.createElement("div");
      bodyDiv.className = "hn-story-card__body";

      const fieldDefs = [
        { name: "title", label: "Title", type: "text" },
        { name: "url", label: "URL", type: "url" },
        { name: "text", label: "Text", type: "textarea" }
      ];

      fieldDefs.forEach(({ name, label, type }) => {
        const src = clonedForm.querySelector(`[name="${name}"]`);
        if (!src) return;
        const field = document.createElement("div");
        field.className = "hn-story-field";
        const lbl = document.createElement("label");
        lbl.textContent = label;
        lbl.setAttribute("for", `story_${name}`);
        const inp = src.cloneNode(true);
        inp.id = `story_${name}`;
        field.appendChild(lbl);
        field.appendChild(inp);
        bodyDiv.appendChild(field);
      });

      newForm.appendChild(bodyDiv);

      // Hint text: td with substantial text but no input/textarea/select
      const hintTd = Array.from(clonedForm.querySelectorAll("td")).find(td =>
        td.textContent.trim().length > 30 &&
        !td.querySelector("input") &&
        !td.querySelector("textarea") &&
        !td.querySelector("select")
      );
      if (hintTd) {
        const hint = document.createElement("div");
        hint.className = "hn-story-card__hint";
        hint.innerHTML = hintTd.innerHTML;
        newForm.appendChild(hint);
      }

      const footer = document.createElement("div");
      footer.className = "hn-story-card__footer";
      const submitBtn = clonedForm.querySelector("input[type=submit]").cloneNode(true);
      footer.appendChild(submitBtn);
      newForm.appendChild(footer);

      card.appendChild(newForm);
      body.appendChild(card);
      return;
    }

    // Not logged in: auth (login/signup) forms
    // Clone forms before clearing body — detached elements lose queryable state in some browsers
    const forms = Array.from(body.querySelectorAll("form")).map(f => f.cloneNode(true));
    const forgotLink = body.querySelector("a[href='forgot']")?.cloneNode(true);
    const errorText = Array.from(body.childNodes)
      .filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
      .map(n => n.textContent.trim()).join(" ").trim();

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
          if (inp.type === "password") {
            const wrap = document.createElement("div");
            wrap.className = "hn-pw-wrap";
            wrap.appendChild(inp);
            const toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = "hn-pw-toggle";
            const eyeOpen = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
            const eyeOff = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
            toggle.innerHTML = eyeOpen;
            toggle.setAttribute("aria-label", "Show password");
            toggle.addEventListener("click", () => {
              const isHidden = inp.type === "password";
              inp.type = isHidden ? "text" : "password";
              toggle.innerHTML = isHidden ? eyeOff : eyeOpen;
              toggle.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
            });
            wrap.appendChild(toggle);
            fieldDiv.appendChild(wrap);
          } else {
            fieldDiv.appendChild(inp);
          }
          newForm.appendChild(fieldDiv);
        }
      });

      const submitBtn = form.querySelector("input[type=submit]").cloneNode(true);
      newForm.appendChild(submitBtn);
      panel.appendChild(newForm);
      return panel;
    }

    // Detect which form is signin vs signup by presence of hidden input name="creating"
    const signinForm = forms.find(f => !f.querySelector("input[name='creating']"));
    const signupForm = forms.find(f => f.querySelector("input[name='creating']"));

    const isErrorPage = errorText.length > 0 && !errorText.includes("logged in");

    // Which tab should be active initially
    const defaultTab = signupForm && !signinForm ? "signup" : "signin";

    const card = document.createElement("div");
    card.className = "hn-auth-card";

    // Error banner
    if (isErrorPage) {
      const banner = document.createElement("div");
      banner.style.cssText = "padding:12px 20px;background:rgba(239,68,68,0.1);border-bottom:1px solid rgba(239,68,68,0.25);color:#dc2626;font:500 13px/1.4 var(--hn-sans);border-radius:24px 24px 0 0;text-align:center;";
      banner.textContent = errorText;
      card.appendChild(banner);
    }

    // Tabs
    const tabs = document.createElement("div");
    tabs.className = "hn-auth-tabs";
    ["Sign In", "Sign Up"].forEach((label, i) => {
      const tabId = i === 0 ? "signin" : "signup";
      const btn = document.createElement("button");
      btn.className = "hn-auth-tab";
      btn.textContent = label;
      btn.type = "button";
      btn.dataset.tab = tabId;
      btn.dataset.active = tabId === defaultTab ? "true" : "false";
      btn.addEventListener("click", () => {
        tabs.querySelectorAll(".hn-auth-tab").forEach(t => t.dataset.active = "false");
        card.querySelectorAll(".hn-auth-panel").forEach(p => p.dataset.active = "false");
        btn.dataset.active = "true";
        card.querySelector(`.hn-auth-panel[data-tab="${btn.dataset.tab}"]`).dataset.active = "true";
      });
      tabs.appendChild(btn);
    });
    card.appendChild(tabs);

    // Always build both panels; use a placeholder if a form is missing
    const signinPanel = signinForm
      ? buildPanel(signinForm, "signin")
      : (() => { const p = document.createElement("div"); p.className = "hn-auth-panel"; p.dataset.tab = "signin"; p.dataset.active = defaultTab === "signin" ? "true" : "false"; return p; })();
    signinPanel.dataset.active = defaultTab === "signin" ? "true" : "false";
    card.appendChild(signinPanel);

    const signupPanel = signupForm
      ? buildPanel(signupForm, "signup")
      : (() => { const p = document.createElement("div"); p.className = "hn-auth-panel"; p.dataset.tab = "signup"; p.dataset.active = defaultTab === "signup" ? "true" : "false"; return p; })();
    signupPanel.dataset.active = defaultTab === "signup" ? "true" : "false";
    card.appendChild(signupPanel);

    if (forgotLink) {
      const footer = document.createElement("div");
      footer.className = "hn-auth-footer";
      footer.appendChild(forgotLink.cloneNode(true));
      card.appendChild(footer);
    }

    body.appendChild(card);

    // Force-activate correct tab after DOM insertion
    const targetBtn = tabs.querySelector(`.hn-auth-tab[data-tab="${defaultTab}"]`);
    if (targetBtn) targetBtn.click();
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
    enhanceFavorites();
    enhanceListings();
    ensureSearch();
    enhanceDiscussion();
    enhanceUserPage();
    enhanceSubmitPage();
    enhanceForgotPage();
    enhanceShowlim();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
