var HNEditorial = HNEditorial || {};

HNEditorial.ensureTopbar = function ensureTopbar() {
  if (document.getElementById(HNEditorial.TOPBAR_ID)) {
    return;
  }

  const currentPath = HNEditorial.readCurrentPath();
  const sectionLabel = HNEditorial.PAGE_LABELS[currentPath] ||
    document.title.replace(" | Hacker News", "") ||
    "Hacker News";

  const navMarkup = HNEditorial.SECTIONS
    .map(({ href, label }) => {
      const isActive = currentPath === href || (href === "/news" && currentPath === "/");
      return `<a href="https://news.ycombinator.com${href}" data-active="${String(isActive)}">${label}</a>`;
    })
    .join("");

  const topbar = document.createElement("div");
  topbar.id = HNEditorial.TOPBAR_ID;
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
        <button id="hn-editorial-type-toggle" class="hn-editorial-type-toggle" type="button" aria-haspopup="dialog" aria-controls="${HNEditorial.TYPE_MODAL_ID}" aria-expanded="false" aria-label="Typography settings">Aa</button>
        <button id="hn-editorial-theme-toggle" class="hn-editorial-theme-toggle" type="button">Light</button>
      </div>
    </div>
  `;

  document.body.appendChild(topbar);
  HNEditorial.setupThemeToggle();
};
