"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { loadHNEditorial, createMemoryStorage } = require("./load-hn-editorial");

describe("clampTypeScale", () => {
  const { clampTypeScale, TYPE_SCALE_DEFAULT } = loadHNEditorial();

  it("returns the default for non-numeric input", () => {
    assert.equal(clampTypeScale("nope"), TYPE_SCALE_DEFAULT);
    assert.equal(clampTypeScale(undefined), TYPE_SCALE_DEFAULT);
  });

  it("clamps below the minimum", () => {
    assert.equal(clampTypeScale(0.2), 0.7);
  });

  it("clamps above the maximum", () => {
    assert.equal(clampTypeScale(2), 1.3);
  });

  it("rounds to 0.05 steps", () => {
    assert.equal(clampTypeScale(1.12), 1.1);
    assert.equal(clampTypeScale(1.13), 1.15);
  });
});

describe("getPreferredTypeface", () => {
  it("falls back to editorial when storage is empty", () => {
    const { getPreferredTypeface } = loadHNEditorial();
    assert.equal(getPreferredTypeface(), "editorial");
  });

  it("returns a stored known typeface", () => {
    const { getPreferredTypeface } = loadHNEditorial({
      localStorage: createMemoryStorage({ "hn-editorial-typeface": "georgia" })
    });
    assert.equal(getPreferredTypeface(), "georgia");
  });

  it("ignores unknown stored ids", () => {
    const { getPreferredTypeface } = loadHNEditorial({
      localStorage: createMemoryStorage({ "hn-editorial-typeface": "comic-sans" })
    });
    assert.equal(getPreferredTypeface(), "editorial");
  });
});
