declare const __brand__: unique symbol;

type BrandKey<T> = { readonly [__brand__]: T };
type TagKey<T> = { readonly __tag: T };

type Brand<B, T> = T & BrandKey<B>;
type TaggedBrand<B, T> = Brand<B, T & TagKey<B>>;

type ExtractBrandTag<T> = T extends { __tag: infer B extends string } ? B : never;
type UnionTags<T> =
  T extends TaggedBrand<string, any> ? ExtractBrandTag<T> : never;

type TCaseCallback<T extends object, TCaseBrand extends string, TCaseResult> =
  (value: TaggedBrand<TCaseBrand, T>) => TCaseResult;

type TCase<T extends object, TBrands extends string, TResult> =
  <TCaseBrand extends TBrands, TCaseResult>(
    brand: TCaseBrand,
    fn: TCaseCallback<T, TCaseBrand, TCaseResult>,
  ) => MatchBrand<T, Exclude<TBrands, TCaseBrand>, TResult | TCaseResult>;

type TDefaultCase<T extends object, TResult> =
  <TDefaultResult>(fn: (value: T) => TDefaultResult) => MatchBrand<T, never, TResult | TDefaultResult>;

type MatchBrand<T extends object, TBrands extends string, TResult> = {
  case: TCase<T, TBrands, TResult>;
  default: TDefaultCase<T, TResult>;
  get: <T extends TResult>(
    ...b: [TBrands] extends [never] ? never[] : [never]
  ) => T;
};

const brand = <B extends string, T>(value: T): Brand<B, T> => value as Brand<B, T>;

const tag = <TBrand extends string, T extends object>(tag: TBrand, value: T) =>
  ({ ...value, __tag: tag }) as TaggedBrand<TBrand, T>;

const isTagged = <B extends string, T extends object>(
  kind: B,
  value: T & { __tag?: unknown },
): value is TaggedBrand<B, T> => value.__tag === kind;

const match = <T extends object>(value: T) => {
  const self = <T extends object, TBrands extends string, TResult>(
    value: T,
    result?: TResult,
  ): MatchBrand<T, TBrands, TResult> => ({
    case: <TCaseBrand extends TBrands, TCaseResult>(
      brand: TCaseBrand,
      fn: TCaseCallback<T, TCaseBrand, TCaseResult>,
    ): MatchBrand<T, TBrands, TResult> => {
      if (isTagged(brand, value)) {
        return self<T, Exclude<TBrands, TCaseBrand>, TResult | TCaseResult>(value, fn(value));
      }

      return self<T, Exclude<TBrands, TCaseBrand>, TResult | TCaseResult>(value, result);
    },
    default: <TDefaultResult>(fn: (value: T) => TDefaultResult) =>
      self<T, never, TResult | TDefaultResult>(value, fn(value)),
    get: <T extends TResult>() =>
      result as [TBrands] extends [never] ? T : never,
  });

  return self<T, UnionTags<T>, never>(value);
};

export { Brand, TaggedBrand, brand, tag, isTagged, match };
