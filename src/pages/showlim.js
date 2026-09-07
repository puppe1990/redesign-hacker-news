var HNEditorial = HNEditorial || {};

HNEditorial.SHOWLIM_LINK_META = {
  newsguidelines: { name: "Community Guidelines", icon: "📋" },
  newswelcome: { name: "Welcome to HN", icon: "👋" },
  showhn: { name: "About Show HN", icon: "💡" }
};

HNEditorial.buildShowlimLink = function buildShowlimLink(anchor) {
  const href = anchor.getAttribute("href");
  const key = Object.keys(HNEditorial.SHOWLIM_LINK_META).find((item) => href.includes(item));
  const meta = key ? HNEditorial.SHOWLIM_LINK_META[key] : { name: href.split("/").pop(), icon: "→" };
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
  return link;
};

HNEditorial.enhanceShowlim = function enhanceShowlim() {
  if (HNEditorial.readCurrentPath() !== "/showlim") {
    return;
  }

  document.body.classList.add(HNEditorial.SHOWLIM_CLASS);

  const bigbox = document.body.querySelector("#bigbox td");
  if (!bigbox) {
    return;
  }

  const paragraphs = bigbox.querySelectorAll("td");
  const mainText = paragraphs[0] ? paragraphs[0].textContent.trim() : "";
  const rawLinks = bigbox.querySelectorAll("a[href]");
  const body = HNEditorial.replacePageBodyKeepingTopbar();

  const card = document.createElement("div");
  card.className = "hn-showlim-card";
  card.innerHTML = `
    <div class="hn-showlim-badge">
      <span class="hn-showlim-badge-dot"></span>
      <span class="hn-showlim-badge-label">Temporarily Restricted</span>
    </div>
  `;

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
  rawLinks.forEach((anchor) => linksList.appendChild(HNEditorial.buildShowlimLink(anchor)));
  card.appendChild(linksList);
  body.appendChild(card);
};
