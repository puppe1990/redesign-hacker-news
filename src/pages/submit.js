var HNEditorial = HNEditorial || {};

HNEditorial.attachPasswordVisibilityToggle = function attachPasswordVisibilityToggle(input) {
  const wrap = document.createElement("div");
  wrap.className = "hn-pw-wrap";
  wrap.appendChild(input);
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "hn-pw-toggle";
  toggle.textContent = "Show";
  toggle.addEventListener("click", () => {
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    toggle.textContent = show ? "Hide" : "Show";
  });
  wrap.appendChild(toggle);
  return wrap;
};

HNEditorial.buildAuthPanel = function buildAuthPanel(form, tabId) {
  const panel = document.createElement("div");
  panel.className = "hn-auth-panel";
  panel.dataset.active = tabId === "signin" ? "true" : "false";
  panel.dataset.tab = tabId;

  const newForm = document.createElement("form");
  newForm.action = form.action;
  newForm.method = form.method;
  HNEditorial.cloneHiddenInputs(form, newForm);

  Array.from(form.querySelectorAll("tr")).forEach((row) => {
    const tds = row.querySelectorAll("td");
    if (tds.length !== 2) {
      return;
    }

    const fieldDiv = document.createElement("div");
    fieldDiv.className = "hn-submit-field";
    const lbl = document.createElement("label");
    lbl.textContent = tds[0].textContent.replace(":", "").trim();
    const inp = tds[1].querySelector("input").cloneNode(true);
    const uid = `${tabId}_${inp.name}`;
    inp.id = uid;
    lbl.setAttribute("for", uid);
    fieldDiv.appendChild(lbl);
    fieldDiv.appendChild(inp.type === "password" ? HNEditorial.attachPasswordVisibilityToggle(inp) : inp);
    newForm.appendChild(fieldDiv);
  });

  newForm.appendChild(form.querySelector("input[type=submit]").cloneNode(true));
  panel.appendChild(newForm);
  return panel;
};

HNEditorial.mountLoggedInStoryForm = function mountLoggedInStoryForm(storyForm) {
  const clonedForm = storyForm.cloneNode(true);
  const body = HNEditorial.replacePageBodyKeepingTopbar();
  const card = document.createElement("div");
  card.className = "hn-story-card";
  card.innerHTML = `<div class="hn-story-card__header"><h2 class="hn-story-card__title">Submit a Story</h2><p class="hn-story-card__subtitle">Share something worth reading with Hacker News</p></div>`;

  const newForm = document.createElement("form");
  newForm.action = clonedForm.action;
  newForm.method = clonedForm.method;
  HNEditorial.cloneHiddenInputs(clonedForm, newForm);

  const bodyDiv = document.createElement("div");
  bodyDiv.className = "hn-story-card__body";
  [
    { name: "title", label: "Title" },
    { name: "url", label: "URL" },
    { name: "text", label: "Text" }
  ].forEach(({ name, label }) => {
    const src = clonedForm.querySelector(`[name="${name}"]`);
    if (!src) {
      return;
    }
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

  const hintTd = Array.from(clonedForm.querySelectorAll("td")).find((td) =>
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
  footer.appendChild(clonedForm.querySelector("input[type=submit]").cloneNode(true));
  newForm.appendChild(footer);
  card.appendChild(newForm);
  body.appendChild(card);
};

HNEditorial.mountAuthCard = function mountAuthCard() {
  // Clone before innerHTML wipe — detached live forms lose queryable fields in some browsers.
  const forms = Array.from(document.body.querySelectorAll("form")).map((form) => form.cloneNode(true));
  const forgotLink = document.body.querySelector("a[href='forgot']")?.cloneNode(true);
  const errorText = Array.from(document.body.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
    .map((node) => node.textContent.trim())
    .join(" ")
    .trim();

  const body = HNEditorial.replacePageBodyKeepingTopbar();
  const signinForm = forms.find((form) => !form.querySelector("input[name='creating']"));
  const signupForm = forms.find((form) => form.querySelector("input[name='creating']"));
  const defaultTab = signupForm && !signinForm ? "signup" : "signin";
  const card = document.createElement("div");
  card.className = "hn-auth-card";

  if (errorText.length > 0 && !errorText.includes("logged in")) {
    const banner = document.createElement("div");
    banner.style.cssText = "padding:12px 20px;background:rgba(239,68,68,0.1);border-bottom:1px solid rgba(239,68,68,0.25);color:#dc2626;font:500 13px/1.4 var(--hn-sans);border-radius:24px 24px 0 0;text-align:center;";
    banner.textContent = errorText;
    card.appendChild(banner);
  }

  const tabs = document.createElement("div");
  tabs.className = "hn-auth-tabs";
  ["Sign In", "Sign Up"].forEach((label, index) => {
    const tabId = index === 0 ? "signin" : "signup";
    const btn = document.createElement("button");
    btn.className = "hn-auth-tab";
    btn.textContent = label;
    btn.type = "button";
    btn.dataset.tab = tabId;
    btn.dataset.active = String(tabId === defaultTab);
    btn.addEventListener("click", () => {
      tabs.querySelectorAll(".hn-auth-tab").forEach((tab) => {
        tab.dataset.active = "false";
      });
      card.querySelectorAll(".hn-auth-panel").forEach((panel) => {
        panel.dataset.active = "false";
      });
      btn.dataset.active = "true";
      const panel = card.querySelector(`.hn-auth-panel[data-tab="${btn.dataset.tab}"]`);
      if (panel) {
        panel.dataset.active = "true";
      }
    });
    tabs.appendChild(btn);
  });
  card.appendChild(tabs);

  if (signinForm) {
    const panel = HNEditorial.buildAuthPanel(signinForm, "signin");
    panel.dataset.active = String(defaultTab === "signin");
    card.appendChild(panel);
  }

  if (signupForm) {
    const panel = HNEditorial.buildAuthPanel(signupForm, "signup");
    panel.dataset.active = String(defaultTab === "signup");
    card.appendChild(panel);
  }

  if (forgotLink) {
    const footer = document.createElement("div");
    footer.className = "hn-auth-footer";
    footer.appendChild(forgotLink.cloneNode(true));
    card.appendChild(footer);
  }

  body.appendChild(card);
  tabs.querySelector(`.hn-auth-tab[data-tab="${defaultTab}"]`)?.click();
};

HNEditorial.enhanceSubmitPage = function enhanceSubmitPage() {
  if (HNEditorial.readCurrentPath() !== "/submit") {
    return;
  }

  document.body.classList.add(HNEditorial.SUBMIT_CLASS);

  const storyForm = document.body.querySelector("form input[name='fnop'][value='submit-page']")?.closest("form");
  if (storyForm) {
    HNEditorial.mountLoggedInStoryForm(storyForm);
    return;
  }

  HNEditorial.mountAuthCard();
};
