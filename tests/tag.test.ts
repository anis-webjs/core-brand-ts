import {describe, it, expect} from "vitest";
import {isTagged, tag} from "../src";

describe("tag", () => {
  it("should be able to tag an object", () => {
    const value = { __tag: 'tag', data: 'data' };

    const tagged = tag('tag', value);

    expect(tagged).toEqual(value);
    expect(isTagged('tag', value)).toBe(true);
  });
});
