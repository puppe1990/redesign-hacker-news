var HNEditorial = HNEditorial || {};

HNEditorial.appendListingSourceChip = function appendListingSourceChip(source, metaTags) {
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
};

HNEditorial.appendListingMetaNodes = function appendListingMetaNodes(subtext, metaMain) {
  const fragment = document.createDocumentFragment();

  while (subtext.firstChild) {
    fragment.appendChild(subtext.firstChild);
  }

  Array.from(fragment.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (!text || text === "|") {
        return;
      }
      const span = document.createElement("span");
      span.textContent = text;
      metaMain.appendChild(span);
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
};

HNEditorial.buildListingMeta = function buildListingMeta(item, source) {
  const subtext = item.nextElementSibling?.querySelector(".subtext");
  const contentCell = item.querySelector("td:last-child");

  if (!subtext || !contentCell || contentCell.querySelector(".hn-editorial-meta")) {
    return;
  }

  const meta = document.createElement("div");
  meta.className = "hn-editorial-meta";
  const metaMain = document.createElement("div");
  metaMain.className = "hn-editorial-meta-main";
  const metaTags = document.createElement("div");
  metaTags.className = "hn-editorial-meta-tags";

  HNEditorial.appendListingMetaNodes(subtext, metaMain);

  if (source) {
    HNEditorial.appendListingSourceChip(source, metaTags);
  }

  const typeBadge = document.createElement("span");
  typeBadge.className = "hn-editorial-badge";
  typeBadge.textContent = source ? "External" : "HN Native";
  metaTags.appendChild(typeBadge);

  meta.appendChild(metaMain);
  if (metaTags.childNodes.length) {
    meta.appendChild(metaTags);
  }
  contentCell.appendChild(meta);
};

HNEditorial.decorateListingItem = function decorateListingItem(item) {
  const titleline = item.querySelector(".titleline");
  const source = item.querySelector(".sitestr");
  const sitebit = titleline?.querySelector(".sitebit");
  const titleLink = titleline?.querySelector("a");
  const staleBadge = titleline?.querySelector(".hn-editorial-badge");

  if (staleBadge) {
    staleBadge.remove();
  }

  if (source && titleLink) {
    titleLink.target = "_blank";
    titleLink.rel = "noopener noreferrer";
    const sourceLink = source.closest("a") || source.parentElement;
    if (sourceLink?.tagName === "A") {
      sourceLink.target = "_blank";
      sourceLink.rel = "noopener noreferrer";
    }
  }

  if (sitebit) {
    sitebit.remove();
  }

  HNEditorial.buildListingMeta(item, source);
};

HNEditorial.enhanceListings = function enhanceListings() {
  if (document.querySelector(".fatitem") || document.querySelector(".comment-tree")) {
    return;
  }

  if (HNEditorial.isFavoritesCommentsPage()) {
    return;
  }

  const items = Array.from(document.querySelectorAll("tr.athing"));

  if (!items.length) {
    return;
  }

  document.body.classList.add(HNEditorial.LISTING_CLASS);
  items.forEach(HNEditorial.decorateListingItem);
};

HNEditorial.ensureSearch = function ensureSearch() {
  if (!document.body.classList.contains(HNEditorial.LISTING_CLASS)) {
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

  wrapper.querySelector("input").addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();
    document.querySelectorAll("tr.athing").forEach((item) => {
      const title = item.querySelector(".titleline > a")?.textContent?.toLowerCase() || "";
      item.classList.toggle("hn-search-hidden", Boolean(query) && !title.includes(query));
    });
  });
};
