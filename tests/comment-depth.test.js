"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { loadHNEditorial, fakeCommentRow } = require("./load-hn-editorial");

describe("getCommentDepth", () => {
  const { getCommentDepth } = loadHNEditorial();

  it("returns 0 when the indent cell is missing", () => {
    assert.equal(getCommentDepth({ querySelector() { return null; } }), 0);
  });

  it("reads HN indent attributes", () => {
    assert.equal(getCommentDepth(fakeCommentRow({ indent: "0" })), 0);
    assert.equal(getCommentDepth(fakeCommentRow({ indent: "3" })), 3);
  });

  it("falls back to spacer gif width / 40", () => {
    assert.equal(getCommentDepth(fakeCommentRow({ indent: "", width: 80 })), 2);
    assert.equal(getCommentDepth(fakeCommentRow({ width: 120 })), 3);
  });

  it("ignores negative or non-numeric indent attributes", () => {
    assert.equal(getCommentDepth(fakeCommentRow({ indent: "-1", width: 40 })), 1);
    assert.equal(getCommentDepth(fakeCommentRow({ indent: "nope", width: 40 })), 1);
  });
});
