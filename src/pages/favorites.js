var HNEditorial = HNEditorial || {};

HNEditorial.enhanceFavorites = function enhanceFavorites() {
  if (HNEditorial.readCurrentPath() !== "/favorites") {
    return;
  }

  document.body.classList.add(HNEditorial.FAVORITES_CLASS);

  const tabDiv = document.querySelector("tr#bigbox > td > div");
  const isComments = HNEditorial.isFavoritesCommentsPage();

  if (tabDiv) {
    tabDiv.querySelectorAll("a").forEach((anchor) => {
      const href = anchor.getAttribute("href") || "";
      anchor.dataset.active = String(isComments ? href.includes("comments=t") : !href.includes("comments=t"));
    });
  }

  if (!isComments) {
    return;
  }

  document.body.classList.add(HNEditorial.FAVORITES_COMMENT_CLASS);

  document.querySelectorAll("tr.athing").forEach((row) => {
    const defaultTd = row.querySelector("td.default");
    const onstory = defaultTd?.querySelector(".onstory");

    if (!defaultTd || !onstory) {
      return;
    }

    const banner = document.createElement("div");
    banner.className = "onstory";
    banner.innerHTML = onstory.innerHTML;
    defaultTd.insertBefore(banner, defaultTd.firstChild);
  });
};
