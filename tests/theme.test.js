"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { loadHNEditorial, createMemoryStorage } = require("./load-hn-editorial");

describe("getPreferredTheme", () => {
  it("uses stored light or dark", () => {
    const light = loadHNEditorial({
      localStorage: createMemoryStorage({ "hn-editorial-theme": "light" })
    });
    assert.equal(light.getPreferredTheme(), "light");

    const dark = loadHNEditorial({
      localStorage: createMemoryStorage({ "hn-editorial-theme": "dark" })
    });
    assert.equal(dark.getPreferredTheme(), "dark");
  });

  it("follows prefers-color-scheme when nothing is stored", () => {
    const prefersLight = loadHNEditorial({
      matchMedia: () => ({ matches: true })
    });
    assert.equal(prefersLight.getPreferredTheme(), "light");

    const prefersDark = loadHNEditorial({
      matchMedia: () => ({ matches: false })
    });
    assert.equal(prefersDark.getPreferredTheme(), "dark");
  });

  it("ignores unknown stored values", () => {
    const { getPreferredTheme } = loadHNEditorial({
      localStorage: createMemoryStorage({ "hn-editorial-theme": "sepia" }),
      matchMedia: () => ({ matches: false })
    });
    assert.equal(getPreferredTheme(), "dark");
  });
});
