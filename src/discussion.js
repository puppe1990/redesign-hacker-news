var HNEditorial = HNEditorial || {};

// HN encodes thread depth on td.ind[indent], with a 40px spacer gif as fallback
// for older markup that only sets img width.
HNEditorial.getCommentDepth = function getCommentDepth(row) {
  const ind = row.querySelector("td.ind");

  if (!ind) {
    return 0;
  }

  const attr = ind.getAttribute("indent");

  if (attr != null && attr !== "") {
    const depth = Number(attr);
    if (Number.isFinite(depth) && depth >= 0) {
      return depth;
    }
  }

  const width = Number(ind.querySelector("img")?.getAttribute("width"));

  if (Number.isFinite(width) && width > 0) {
    return Math.max(0, Math.round(width / 40));
  }

  return 0;
};

HNEditorial.enhanceDiscussion = function enhanceDiscussion() {
  const fatItem = document.querySelector(".fatitem");
  const commentTree = document.querySelector(".comment-tree");

  if (!fatItem && !commentTree) {
    return;
  }

  document.body.classList.add(HNEditorial.DISCUSSION_CLASS);

  if (!commentTree) {
    return;
  }

  commentTree.querySelectorAll("tr.comtr").forEach((row) => {
    const depth = HNEditorial.getCommentDepth(row);
    row.dataset.hnDepth = String(depth);
    row.style.setProperty("--hn-depth", String(depth));
  });
};
