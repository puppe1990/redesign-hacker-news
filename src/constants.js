var HNEditorial = HNEditorial || {};

HNEditorial.INIT_FLAG = "hnEditorialRedesignMounted";
HNEditorial.TOPBAR_ID = "hn-editorial-topbar";
HNEditorial.PAGE_CLASS = "hn-editorial-page";
HNEditorial.LISTING_CLASS = "hn-editorial-listing";
HNEditorial.DISCUSSION_CLASS = "hn-editorial-discussion";
HNEditorial.SUBMIT_CLASS = "hn-editorial-submit";
HNEditorial.FORGOT_CLASS = "hn-editorial-forgot";
HNEditorial.FAVORITES_CLASS = "hn-editorial-favorites";
HNEditorial.FAVORITES_COMMENT_CLASS = "hn-editorial-fav-comments";
HNEditorial.SHOWLIM_CLASS = "hn-editorial-showlim";
HNEditorial.USER_CLASS = "hn-editorial-user";
HNEditorial.LIGHT_THEME_CLASS = "hn-theme-light";
HNEditorial.THEME_STORAGE_KEY = "hn-editorial-theme";
HNEditorial.TYPEFACE_STORAGE_KEY = "hn-editorial-typeface";
HNEditorial.TYPE_SCALE_STORAGE_KEY = "hn-editorial-type-scale";
HNEditorial.TYPE_MODAL_ID = "hn-editorial-type-modal";
HNEditorial.TYPE_SCALE_MIN = 0.7;
HNEditorial.TYPE_SCALE_MAX = 1.3;
HNEditorial.TYPE_SCALE_DEFAULT = 1;

HNEditorial.TYPEFACES = [
  { id: "editorial", label: "Editorial", family: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' },
  { id: "georgia", label: "Georgia", family: 'Georgia, "Times New Roman", Times, serif' },
  { id: "palatino", label: "Palatino", family: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif' },
  { id: "times", label: "Times", family: '"Times New Roman", Times, serif' },
  { id: "sans", label: "Sans", family: '"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif' },
  { id: "helvetica", label: "Helvetica", family: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
  { id: "system", label: "System", family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  { id: "mono", label: "Mono", family: 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace' }
];

HNEditorial.SECTIONS = [
  { href: "/newest", label: "New" },
  { href: "/front", label: "Past" },
  { href: "/newcomments", label: "Comments" },
  { href: "/ask", label: "Ask" },
  { href: "/show", label: "Show" },
  { href: "/jobs", label: "Jobs" },
  { href: "/submit", label: "Submit" }
];

HNEditorial.PAGE_LABELS = {
  "/news": "Front Page",
  "/newest": "Newest",
  "/show": "Show HN",
  "/ask": "Ask HN",
  "/jobs": "Jobs",
  "/best": "Best",
  "/item": "Discussion",
  "/user": "Profile",
  "/submitted": "Submitted",
  "/threads": "Threads",
  "/favorites": "Favorites",
  "/showlim": "Show HN"
};

HNEditorial.readCurrentPath = function readCurrentPath() {
  return window.location.pathname.replace(/\/+$/, "") || "/news";
};

HNEditorial.isFavoritesCommentsPage = function isFavoritesCommentsPage() {
  return HNEditorial.readCurrentPath() === "/favorites" &&
    new URLSearchParams(window.location.search).get("comments") === "t";
};
