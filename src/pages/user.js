var HNEditorial = HNEditorial || {};

HNEditorial.readUserProfileFields = function readUserProfileFields(bigbox) {
  const profile = { username: "", created: "", karma: "", aboutHTML: "", links: [] };

  bigbox.querySelectorAll("tr").forEach((row) => {
    const tds = row.querySelectorAll("td");
    if (tds.length < 2) {
      return;
    }

    const label = tds[0].textContent.trim().replace(":", "").toLowerCase();
    const val = tds[1];

    if (label === "user") {
      profile.username = val.querySelector("a.hnuser")?.textContent.trim() || val.textContent.trim();
    } else if (label === "created") {
      profile.created = val.querySelector(".age a")?.textContent.trim() || val.textContent.trim();
    } else if (label === "karma") {
      profile.karma = val.textContent.trim();
    } else if (label === "about") {
      profile.aboutHTML = val.innerHTML.trim();
    } else if (label === "") {
      const anchor = val.querySelector("a");
      if (anchor) {
        profile.links.push({ href: anchor.getAttribute("href"), text: anchor.textContent.trim() });
      }
    }
  });

  return profile;
};

HNEditorial.buildUserStat = function buildUserStat(value, label) {
  const stat = document.createElement("div");
  stat.className = "hn-user-stat";
  const valueEl = document.createElement("span");
  valueEl.className = "hn-user-stat__value";
  valueEl.textContent = value;
  const labelEl = document.createElement("span");
  labelEl.className = "hn-user-stat__label";
  labelEl.textContent = label;
  stat.appendChild(valueEl);
  stat.appendChild(labelEl);
  return stat;
};

HNEditorial.enhanceUserPage = function enhanceUserPage() {
  if (HNEditorial.readCurrentPath() !== "/user") {
    return;
  }

  document.body.classList.add(HNEditorial.USER_CLASS);

  const bigbox = document.body.querySelector("#bigbox td");
  if (!bigbox) {
    return;
  }

  const profile = HNEditorial.readUserProfileFields(bigbox);
  const body = HNEditorial.replacePageBodyKeepingTopbar();
  const card = document.createElement("div");
  card.className = "hn-user-card";

  const header = document.createElement("div");
  header.className = "hn-user-card__header";
  const avatar = document.createElement("div");
  avatar.className = "hn-user-avatar";
  avatar.textContent = (profile.username.charAt(0) || "?").toUpperCase();
  const meta = document.createElement("div");
  meta.className = "hn-user-meta";
  const nameEl = document.createElement("div");
  nameEl.className = "hn-user-name";
  nameEl.textContent = profile.username;
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
  if (profile.karma) {
    stats.appendChild(HNEditorial.buildUserStat(profile.karma, "Karma"));
  }
  if (profile.created) {
    stats.appendChild(HNEditorial.buildUserStat(profile.created, "Member since"));
  }
  if (stats.childNodes.length) {
    card.appendChild(stats);
  }

  if (profile.aboutHTML) {
    const aboutDiv = document.createElement("div");
    aboutDiv.className = "hn-user-about";
    aboutDiv.innerHTML = profile.aboutHTML;
    card.appendChild(aboutDiv);
  }

  if (profile.links.length) {
    const linksDiv = document.createElement("div");
    linksDiv.className = "hn-user-links";
    profile.links.forEach(({ href, text }) => {
      const anchor = document.createElement("a");
      anchor.className = "hn-user-link";
      anchor.href = href;
      anchor.textContent = text;
      linksDiv.appendChild(anchor);
    });
    card.appendChild(linksDiv);
  }

  body.appendChild(card);
};
