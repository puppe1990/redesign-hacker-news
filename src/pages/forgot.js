var HNEditorial = HNEditorial || {};

HNEditorial.enhanceForgotPage = function enhanceForgotPage() {
  if (HNEditorial.readCurrentPath() !== "/forgot") {
    return;
  }

  document.body.classList.add(HNEditorial.FORGOT_CLASS);

  const form = document.body.querySelector("form");
  const title = document.body.querySelector("b");
  const body = HNEditorial.replacePageBodyKeepingTopbar();

  const card = document.createElement("div");
  card.className = "hn-forgot-card";

  const heading = document.createElement("h2");
  heading.textContent = title ? title.textContent : "Reset your password";
  card.appendChild(heading);

  if (!form) {
    body.appendChild(card);
    return;
  }

  const newForm = document.createElement("form");
  newForm.action = form.action;
  newForm.method = form.method;
  HNEditorial.cloneHiddenInputs(form, newForm);

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
  newForm.appendChild(form.querySelector("input[type=submit]").cloneNode(true));
  card.appendChild(newForm);
  body.appendChild(card);
};
