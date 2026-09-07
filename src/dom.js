var HNEditorial = HNEditorial || {};

// Submit/user/forgot/showlim rebuild the page from the HN table. Clearing
// body.innerHTML would drop the injected topbar unless we re-attach it.
HNEditorial.replacePageBodyKeepingTopbar = function replacePageBodyKeepingTopbar() {
  const body = document.body;
  const topbar = document.getElementById(HNEditorial.TOPBAR_ID);
  body.innerHTML = "";

  if (topbar) {
    body.appendChild(topbar);
  }

  return body;
};

HNEditorial.cloneHiddenInputs = function cloneHiddenInputs(fromForm, toForm) {
  fromForm.querySelectorAll("input[type=hidden]").forEach((input) => {
    toForm.appendChild(input.cloneNode(true));
  });
};
