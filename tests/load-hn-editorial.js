"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SRC = path.join(__dirname, "..", "src");

const SCRIPT_FILES = [
  "constants.js",
  "theme.js",
  "type-settings.js",
  "dom.js",
  "topbar.js",
  "listings.js",
  "discussion.js",
  "pages/favorites.js",
  "pages/forgot.js",
  "pages/showlim.js",
  "pages/user.js",
  "pages/submit.js",
  "boot.js"
];

function createMemoryStorage(initial = {}) {
  const store = { ...initial };
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    }
  };
}

function fakeCommentRow({ indent = null, width = null } = {}) {
  return {
    querySelector(selector) {
      if (selector !== "td.ind") {
        return null;
      }

      return {
        getAttribute(name) {
          return name === "indent" ? indent : null;
        },
        querySelector() {
          if (width == null) {
            return null;
          }
          return {
            getAttribute() {
              return String(width);
            }
          };
        }
      };
    }
  };
}

function loadHNEditorial(stubs = {}) {
  const localStorage = stubs.localStorage || createMemoryStorage();
  const window = {
    localStorage,
    matchMedia: stubs.matchMedia || (() => ({ matches: false })),
    location: stubs.location || { pathname: "/news", search: "" },
    addEventListener() {}
  };
  const classList = {
    add() {},
    toggle() {},
    contains() {
      return false;
    },
    remove() {}
  };
  const document = stubs.document || {
    body: { classList, querySelector() { return null; }, querySelectorAll() { return []; } },
    head: {},
    documentElement: { style: { setProperty() {}, colorScheme: "" } },
    readyState: "loading",
    addEventListener() {},
    getElementById() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    createElement() {
      return { classList, dataset: {}, style: {}, appendChild() {}, setAttribute() {} };
    }
  };

  const sandbox = {
    console,
    window,
    document,
    Node: { TEXT_NODE: 3, ELEMENT_NODE: 1 },
    URLSearchParams,
    Element: function Element() {}
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  SCRIPT_FILES.forEach((file) => {
    const full = path.join(SRC, file);
    vm.runInContext(fs.readFileSync(full, "utf8"), sandbox, { filename: full });
  });

  return sandbox.HNEditorial;
}

module.exports = { loadHNEditorial, createMemoryStorage, fakeCommentRow };
