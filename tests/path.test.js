"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { loadHNEditorial } = require("./load-hn-editorial");

describe("readCurrentPath", () => {
  it("normalizes trailing slashes", () => {
    const { readCurrentPath } = loadHNEditorial({
      location: { pathname: "/newest/", search: "" }
    });
    assert.equal(readCurrentPath(), "/newest");
  });

  it("maps the site root to /news", () => {
    const { readCurrentPath } = loadHNEditorial({
      location: { pathname: "/", search: "" }
    });
    assert.equal(readCurrentPath(), "/news");
  });
});

describe("isFavoritesCommentsPage", () => {
  it("is true only for /favorites?comments=t", () => {
    const comments = loadHNEditorial({
      location: { pathname: "/favorites", search: "?comments=t" }
    });
    assert.equal(comments.isFavoritesCommentsPage(), true);

    const submissions = loadHNEditorial({
      location: { pathname: "/favorites", search: "" }
    });
    assert.equal(submissions.isFavoritesCommentsPage(), false);
  });
});
