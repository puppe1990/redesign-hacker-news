var HNEditorial = HNEditorial || {};

HNEditorial.boot = function boot() {
  if (!document.body || !document.head) {
    return;
  }

  document.body.classList.add(HNEditorial.PAGE_CLASS);
  HNEditorial.initializeTheme();
  HNEditorial.initializeTypeSettings();
  HNEditorial.ensureTopbar();
  HNEditorial.setupThemeToggle();
  HNEditorial.enhanceFavorites();
  HNEditorial.enhanceListings();
  HNEditorial.ensureSearch();
  HNEditorial.enhanceDiscussion();
  HNEditorial.enhanceUserPage();
  HNEditorial.enhanceSubmitPage();
  HNEditorial.enhanceForgotPage();
  HNEditorial.enhanceShowlim();
  HNEditorial.ensureTypeModal();
};

HNEditorial.mountWhenReady = function mountWhenReady() {
  if (window[HNEditorial.INIT_FLAG]) {
    return;
  }

  window[HNEditorial.INIT_FLAG] = true;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", HNEditorial.boot, { once: true });
    return;
  }

  HNEditorial.boot();
};

HNEditorial.mountWhenReady();
