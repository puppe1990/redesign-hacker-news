var HNEditorial = HNEditorial || {};

HNEditorial.clampTypeScale = function clampTypeScale(value) {
  const scale = Number(value);

  if (!Number.isFinite(scale)) {
    return HNEditorial.TYPE_SCALE_DEFAULT;
  }

  return Math.min(
    HNEditorial.TYPE_SCALE_MAX,
    Math.max(HNEditorial.TYPE_SCALE_MIN, Math.round(scale * 20) / 20)
  );
};

HNEditorial.getPreferredTypeface = function getPreferredTypeface() {
  const stored = window.localStorage.getItem(HNEditorial.TYPEFACE_STORAGE_KEY);
  return HNEditorial.TYPEFACES.some((face) => face.id === stored) ? stored : "editorial";
};

HNEditorial.getPreferredTypeScale = function getPreferredTypeScale() {
  return HNEditorial.clampTypeScale(
    window.localStorage.getItem(HNEditorial.TYPE_SCALE_STORAGE_KEY) || HNEditorial.TYPE_SCALE_DEFAULT
  );
};

HNEditorial.applyTypeSettings = function applyTypeSettings(typefaceId, scale) {
  const face = HNEditorial.TYPEFACES.find((item) => item.id === typefaceId) || HNEditorial.TYPEFACES[0];
  const nextScale = HNEditorial.clampTypeScale(scale);
  document.documentElement.style.setProperty("--hn-reading", face.family);
  document.documentElement.style.setProperty("--hn-type-scale", String(nextScale));
};

HNEditorial.persistTypeSettings = function persistTypeSettings(typefaceId, scale) {
  window.localStorage.setItem(HNEditorial.TYPEFACE_STORAGE_KEY, typefaceId);
  window.localStorage.setItem(
    HNEditorial.TYPE_SCALE_STORAGE_KEY,
    String(HNEditorial.clampTypeScale(scale))
  );
};

HNEditorial.initializeTypeSettings = function initializeTypeSettings() {
  HNEditorial.applyTypeSettings(HNEditorial.getPreferredTypeface(), HNEditorial.getPreferredTypeScale());
};

HNEditorial.syncTypeModal = function syncTypeModal() {
  const modal = document.getElementById(HNEditorial.TYPE_MODAL_ID);

  if (!modal) {
    return;
  }

  const typefaceId = HNEditorial.getPreferredTypeface();
  const scale = HNEditorial.getPreferredTypeScale();
  const percent = Math.round(scale * 100);

  modal.querySelectorAll(".hn-type-face").forEach((button) => {
    button.dataset.active = String(button.dataset.typeface === typefaceId);
  });

  const slider = modal.querySelector("#hn-editorial-type-scale");
  const valueLabel = modal.querySelector(".hn-type-size-value");
  const preview = modal.querySelector(".hn-type-preview");

  if (slider) {
    slider.value = String(percent);
  }

  if (valueLabel) {
    valueLabel.textContent = `${percent}%`;
  }

  if (preview) {
    const face = HNEditorial.TYPEFACES.find((item) => item.id === typefaceId) || HNEditorial.TYPEFACES[0];
    preview.style.fontFamily = face.family;
  }
};

HNEditorial.isTypeModalOpen = function isTypeModalOpen() {
  const modal = document.getElementById(HNEditorial.TYPE_MODAL_ID);
  return Boolean(modal) && !modal.hidden;
};

HNEditorial.closeTypeModal = function closeTypeModal() {
  const modal = document.getElementById(HNEditorial.TYPE_MODAL_ID);
  const toggle = document.getElementById("hn-editorial-type-toggle");

  if (!modal || modal.hidden) {
    return;
  }

  modal.hidden = true;
  document.body.classList.remove("hn-type-modal-open");

  if (toggle) {
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  }
};

HNEditorial.openTypeModal = function openTypeModal() {
  const modal = document.getElementById(HNEditorial.TYPE_MODAL_ID);
  const toggle = document.getElementById("hn-editorial-type-toggle");

  if (!modal) {
    return;
  }

  HNEditorial.syncTypeModal();
  modal.hidden = false;
  document.body.classList.add("hn-type-modal-open");

  if (toggle) {
    toggle.setAttribute("aria-expanded", "true");
  }

  modal.querySelector(".hn-type-modal__close")?.focus();
};

HNEditorial.setTypeface = function setTypeface(typefaceId) {
  const scale = HNEditorial.getPreferredTypeScale();
  HNEditorial.persistTypeSettings(typefaceId, scale);
  HNEditorial.applyTypeSettings(typefaceId, scale);
  HNEditorial.syncTypeModal();
};

HNEditorial.setTypeScale = function setTypeScale(scale) {
  const typefaceId = HNEditorial.getPreferredTypeface();
  HNEditorial.persistTypeSettings(typefaceId, scale);
  HNEditorial.applyTypeSettings(typefaceId, scale);
  HNEditorial.syncTypeModal();
};

HNEditorial.createTypeModalElement = function createTypeModalElement() {
  const modal = document.createElement("div");
  modal.id = HNEditorial.TYPE_MODAL_ID;
  modal.hidden = true;
  modal.innerHTML = `
    <div class="hn-type-modal__backdrop" data-type-dismiss="true"></div>
    <div class="hn-type-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="hn-type-modal-title">
      <div class="hn-type-modal__header">
        <h2 class="hn-type-modal__title" id="hn-type-modal-title">Typography</h2>
        <button class="hn-type-modal__close" type="button" aria-label="Close typography settings">&times;</button>
      </div>
      <div class="hn-type-preview">The Orange Site is a place for curiosity.</div>
      <div class="hn-type-section">
        <div class="hn-type-label">Typeface</div>
        <div class="hn-type-faces"></div>
      </div>
      <div class="hn-type-section">
        <div class="hn-type-label">
          <span>Size</span>
          <span class="hn-type-size-value">100%</span>
        </div>
        <input id="hn-editorial-type-scale" class="hn-type-scale" type="range" min="70" max="130" step="5" value="100" aria-label="Reading size" />
        <div class="hn-type-size-ticks">
          <span>Small</span>
          <span>Default</span>
          <span>Large</span>
        </div>
      </div>
    </div>
  `;

  const faces = modal.querySelector(".hn-type-faces");
  HNEditorial.TYPEFACES.forEach((face) => {
    const button = document.createElement("button");
    button.className = "hn-type-face";
    button.type = "button";
    button.dataset.typeface = face.id;
    button.style.fontFamily = face.family;

    const sample = document.createElement("span");
    sample.className = "hn-type-face__sample";
    sample.textContent = "Aa";

    const label = document.createElement("span");
    label.className = "hn-type-face__label";
    label.textContent = face.label;

    button.appendChild(sample);
    button.appendChild(label);
    faces.appendChild(button);
  });

  return modal;
};

HNEditorial.bindTypeToggle = function bindTypeToggle() {
  const toggle = document.getElementById("hn-editorial-type-toggle");

  if (!toggle || toggle.dataset.bound === "true") {
    return;
  }

  toggle.dataset.bound = "true";
  toggle.addEventListener("click", () => {
    if (HNEditorial.isTypeModalOpen()) {
      HNEditorial.closeTypeModal();
    } else {
      HNEditorial.openTypeModal();
    }
  });
};

HNEditorial.bindTypeModalEvents = function bindTypeModalEvents(modal) {
  if (modal.dataset.bound === "true") {
    return;
  }

  modal.dataset.bound = "true";

  modal.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (target.closest("[data-type-dismiss]") || target.closest(".hn-type-modal__close")) {
      HNEditorial.closeTypeModal();
      return;
    }

    const faceButton = target.closest(".hn-type-face");
    if (faceButton?.dataset.typeface) {
      HNEditorial.setTypeface(faceButton.dataset.typeface);
    }
  });

  const slider = modal.querySelector("#hn-editorial-type-scale");
  if (slider) {
    slider.addEventListener("input", () => {
      HNEditorial.setTypeScale(Number(slider.value) / 100);
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && HNEditorial.isTypeModalOpen()) {
      event.preventDefault();
      HNEditorial.closeTypeModal();
    }
  });
};

HNEditorial.ensureTypeModal = function ensureTypeModal() {
  let modal = document.getElementById(HNEditorial.TYPE_MODAL_ID);

  if (!modal) {
    modal = HNEditorial.createTypeModalElement();
    document.body.appendChild(modal);
  }

  HNEditorial.bindTypeToggle();
  HNEditorial.bindTypeModalEvents(modal);
  HNEditorial.syncTypeModal();
};
