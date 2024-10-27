import {describe, it, expect} from "vitest";
import {brand} from "../src";

describe('brand', () => {
  it('should be able to tag an object', () => {
    const value = 'data';

    const branded = brand(value);

    expect(branded).toEqual(value);
  });
});
