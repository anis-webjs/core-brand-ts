import {describe, it, expect} from "vitest";

import {match, tag, TaggedBrand} from "../src";

type Success<T> = TaggedBrand<'Success', { type: 'success'; data: T }>;
type Failure<E> = TaggedBrand<'Failure', { type: 'failure'; error: E }>;
type Result<T, E> = Success<T> | Failure<E>;

describe('match', () => {
  it('should be able to match a value', () => {
    const value: Result<string, string> = tag('Success', { type: 'success', data: 'data' });

    const matched = match<Result<string, string>>(value)
      .case('Success', ({ data }) => data)
      .case('Failure', ({ error }) => error)
      .get();

    expect(matched).toEqual(value.data);
  });

  it('should be able to match a value with a default case', () => {
    const value: Result<string, string> = tag('Failure', { type: 'failure', error: 'error' });

    const matched = match<Result<string, string>>(value)
      .case('Success', ({ data }) => data)
      .default((result) => result)
      .get();

    expect(matched).toEqual(value);
  });
});
