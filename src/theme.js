var HNEditorial = HNEditorial || {};

HNEditorial.getPreferredTheme = function getPreferredTheme() {
  const storedTheme = window.localStorage.getItem(HNEditorial.THEME_STORAGE_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

HNEditorial.applyTheme = function applyTheme(theme) {
  document.body.classList.toggle(HNEditorial.LIGHT_THEME_CLASS, theme === "light");
  document.documentElement.style.colorScheme = theme;
};

HNEditorial.syncThemeToggle = function syncThemeToggle(theme) {
  const toggle = document.getElementById("hn-editorial-theme-toggle");

  if (!toggle) {
    return;
  }

  toggle.textContent = theme === "light" ? "Dark" : "Light";
  toggle.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
  toggle.setAttribute("data-theme", theme);
};

HNEditorial.setupThemeToggle = function setupThemeToggle() {
  const toggle = document.getElementById("hn-editorial-theme-toggle");

  if (!toggle || toggle.dataset.bound === "true") {
    HNEditorial.syncThemeToggle(HNEditorial.getPreferredTheme());
    return;
  }

  toggle.dataset.bound = "true";
  HNEditorial.syncThemeToggle(HNEditorial.getPreferredTheme());

  toggle.addEventListener("click", () => {
    const currentTheme = document.body.classList.contains(HNEditorial.LIGHT_THEME_CLASS) ? "light" : "dark";
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    window.localStorage.setItem(HNEditorial.THEME_STORAGE_KEY, nextTheme);
    HNEditorial.applyTheme(nextTheme);
    HNEditorial.syncThemeToggle(nextTheme);
  });
};
