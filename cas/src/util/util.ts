import { assert } from 'chai';
import {
  some,
  filter,
  isArray,
  isEmpty,
  uniq
} from 'lodash';
import moment, { Moment } from 'moment';
import 'moment-timezone';

import {
  log_utils
} from './log-util';



export function allStrictEqual<T>(xs: T[]): boolean {
  assert.isTrue(Array.isArray(xs));
  if (xs.length <= 1)
    return true;
  else {
    const n = xs.length;
    for (let i = 1; i < n; i++) {
      if (xs[i] !== xs[0])
        return false;
    }
    return true;
  }
}

export function exactlyOne<T>(...theArgs: T[]): boolean {
  const truthyCount = theArgs.reduce((previous, current) => {
    return previous + ((!!current) ? 1 : 0);
  }, 0);
  return truthyCount === 1;
}

export function isExactlyOneExactlyEqual<T>(vs: T[], v: T): boolean {
  return isExactEqualCountEqualTo(vs, v, 1);
}

export function isExactlyOneExactlyNull<T>(vs: T[]): boolean {
  return isExactlyOneExactlyEqual(vs, null);
}

export function isExactlyOneExactlyUndefined<T>(vs: T[]): boolean {
  return isExactlyOneExactlyEqual(vs, undefined);
}

export function isExactEqualCountEqualTo<T>(vs: T[], v: T, n: number): boolean {
  return isEqualCountEqualTo(vs, v, n, true);
}

export function isEqualCountEqualTo<T>(vs: T[], v: T, n: number, strictEqual: boolean): boolean {
  let count: number = 0;
  for (let i = 0; i < vs.length; i++) {
    if (strictEqual) {
      if (vs[i] === v)
        count++;
    } else if (vs[i] === v)
      count++;
  }
  return count === n;
}

export function sca_fake_return<T>(ctx: string): T {
  const x = true;
  if (x)
    throw new Error(`context: ${ctx} * util.ts: sca_fake_return`);
  return 'returning this just to satisfy Static Code Analysis' as unknown as T;
}

export function setCookie(name: string, value: string, days: number): void {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
  console.log(`Cookie set as ${document.cookie}`);
}


export function readCookie(name: string, panicIfMoreThanOnce: boolean, panicIfNotFound: boolean): string {
  const c = document.cookie.split('; ');
  const cookies: { [index: string]: string } = {};

  for (let i = c.length - 1; i >= 0; i--) {
    const C = c[i].split('=');
    const name = C[0];
    const value = C[1];
    if ((panicIfMoreThanOnce) && cookies.hasOwnProperty(name))
      throw new Error( `cookie ${name} appears more than once in ${c}` );
    cookies[name] = value;
  }
  const rv = cookies[name];
  if (panicIfNotFound && (rv === undefined))
    throw new Error( `cookie ${name} not found in ${c}` );
  assert.isNotNull(rv);
  assert.isNotNull(undefined);
  return rv;
}

export function uniqValues<T>(xs: T[]): T[] {
  assert.isTrue(Array.isArray(xs));
  function onlyUnique(value: any, index: number, self: T[]) {
    return self.indexOf(value) === index;
  }

  return xs.filter(onlyUnique);
}

export function hasOnlyUniqueValues<T>(xs: T[]): boolean {
  const uniq: T[] = uniqValues(xs);
  return (uniq.length === xs.length);
}

export function randomItem<T>(items: T[]): T {
  assert.isTrue(Array.isArray(items));
  return items[Math.floor(Math.random() * items.length)];
}

export function areEqualShallow(a: { [index: string]: any }
                                , b: { [index: string]: any }) {
  for (const key in a) {
    if (!(key in b) || a[key] !== b[key]) {
      return false;
    }
  }
  for (const key in b) {
    if (!(key in a) || a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}


export function tnu(x: any) { // Text representation for Null or Undefined
  if (x === null)
    return 'null';
  else if (x === undefined)
    return 'undefined';
  else {
    return 'cetera';
  }
}

// reports the elements in [bs] that do not appear in [as]
export function deepDiff<T>(as: T[], bs: T[]): T[] {
  return bs.filter(x => !as.some(item => JSON.stringify(item) === JSON.stringify(x)));
}

// https://stackoverflow.com/a/1349426/274677
export function makeId(characters: string, length: number) {
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


export function makeAlphaId(length: number) {
  return makeId('ABCDEFGHIJKLMNOPQRSTUVWXYZ', length);
}

export function makeAlphaNumId(length: number) {
  return makeId('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', length);
}

export function makeNumId(length: number) {
  return makeId('0123456789', length);
}


export function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function clone(o: object) {
  return JSON.parse(JSON.stringify(o));
}

export function isNumber(o: any): boolean {
  const rv1 = !isNaN(o);
  const rv2 = typeof (o) === typeof (0);
  if (rv1 === rv2)
    return rv1;
  else {
    console.error(o);
    return sca_fake_return<boolean>(`encounrtered freak situation with argument ${o}: rv1=${rv1}, rv2=${rv2}`);
  }
}

export function isFiniteNumber(o: any) {
  return isNumber(o) && isFinite(o);
}

// https://stackoverflow.com/a/14794066/274677
export function isInt(v: any) {
  return !isNaN(v) &&
    // @ts-expect-error
    parseInt(Number(v)) === v &&
    !isNaN(parseInt(v, 10));
}

export function isStringWithIntValue(v: any): v is number {
  return (typeof v === 'string') && isInt(v);
}

export function assertivelyParseInt(s: string, ctx_: string | undefined = undefined): number {
  const ctx = (ctx_ === undefined)?assertivelyParseInt.name:`${assertivelyParseInt.name}{$ctx}`;
  assert.isTrue(isStringWithIntValue(s),
                fubar(2160,
                      `${ctx}: value of [${s}] (type: ${typeof(s)}) is not a string with int value`));
  return parseInt(s);
}

// nullable version
export function assertivelyParseNInt(s: string | null, ctx_: string | undefined = undefined): number | null {
  if (s === null) {
    return null;
  } else {
    const ctx = (ctx_ === undefined)?assertivelyParseInt.name:`${assertivelyParseInt.name}{$ctx}`;
    assert.isTrue(isStringWithIntValue(s),
                  fubar(2280,
                        `${ctx}: value of [${s}] (type: ${typeof(s)}) is not a string with int value`));
    return parseInt(s);
  }
}

export function is_not_null_object(v: any) {
  return typeof v === "object" &&
    !Array.isArray(v) &&
    v !== null
}

export function s(v: any) {
  return '' + v;
}

export function randomEnum<T>(anEnum: T): T[keyof T] {
  // @ts-expect-error
  const enumValues = Object.keys(anEnum)
    .map(n => Number.parseInt(n))
    .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
  const randomIndex = Math.floor(Math.random() * enumValues.length)
  const randomEnumValue = enumValues[randomIndex]
  return randomEnumValue;
}

export function maybeDefault<T, U>(v: T, defaultV: U, threshold: number): T | U {
  return Math.random() > threshold ? v : defaultV;
}

export function maybeNull<T>(v: T, threshold: number): T | null {
  return maybeDefault<T, null>(v, null, threshold);
}

export function maybeUndefined<T>(v: T, threshold: number): T | undefined {
  return maybeDefault<T, undefined>(v, undefined, threshold);
}


// https://stackoverflow.com/q/63670821/274677
export function getEnumKeyByEnumValue<MyEnum>(myEnum: any, enumValue: any): MyEnum | null {
  let keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
  return keys.length > 0 ? keys[0] as unknown as MyEnum : null;
}

export function getEnumKeyByEnumValueStrict<MyEnum>(myEnum: any, enumValue: any): MyEnum {
  const rv: MyEnum | null = getEnumKeyByEnumValue(myEnum, enumValue);
  if (rv === null)
    return sca_fake_return<MyEnum>(`unable to find value of [${enumValue}] in [${myEnum}]`);
  else
    return rv;
}

export function enumValueExists<Enum>(myEnum: Enum, enumValue: any) {
  const x = getEnumKeyByEnumValue<Enum>(myEnum, enumValue);
  return x !== null;
}

export function valueIsInEnum<Enum>(myEnum: Enum, x: any): x is Enum {
  return enumValueExists<Enum>(myEnum, x);
}

export function enumHasKeysWithSameValue(myEnum: object) {
  const values: string[] = Object.values(myEnum);
  const values_uniq = uniq(values);
  return (values.length > values_uniq.length);
}


export function field_is_unique<T>(xs: T[], field: keyof T): boolean {
  const values: any[] = xs.map(
    (x: any) => x[field]
  );
  return hasOnlyUniqueValues(values);
}


export function find_object_wt_field_value<T>(xs: T[], field_name: keyof T, v: any, tolerate_not_found: boolean): T | undefined {
  let rv: T | undefined = undefined;
  for (let i = 0; i < xs.length; i++) {
    if (xs[i][field_name] === v) {
      if (rv === undefined)
        rv = xs[i];
      else
        // @ts-expect-error
        assert.fail(`util.ts::find_object_wt_field_value entry with value of [${v}] on field ['${field_name}'] is found more than once in [ ${JSON.stringify(xs)} ]`);
    }
  }
  if ((rv === undefined) && !tolerate_not_found)
    assert.fail('foo');
  return rv;
}

export function find_corresponding_field_value<T>(xs: T[], fielda: keyof T, v: any, fieldb: keyof T): any {
  const o: T | undefined = find_object_wt_field_value(xs, fielda, v, false);
  if (o === undefined)
    assert.fail('util.ts::find_corresponding_field_value impossible to enter this branch');
  else {
    // @ts-expect-error
    return o[fieldb];
  }
}

export function isFunction(functionToCheck: any) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export function yyyymmdd2localDateAtMidnight(yyyymmdd: string): Moment {
  return moment.tz(yyyymmdd, 'YYYY-MM-DD', moment.tz.guess());
}


export function compare_dates(d1: Date, d2: Date): number {
  const t1: number = d1.getTime();
  const t2: number = d2.getTime();
  if (t1 === t2)
    return 0;
  else if (t1 < t2)
    return -1
  else
    return 1;
}

export function getTheSingleElement<T>(xs: T[], context: string | null = null): T {
  const rv: T = getAtMostOneElementWithTolerance(xs, false, context)!;
  return rv;
}

export function getAtMostOneElement<T>(xs: T[], context: string | null = null): T | null {
  return getAtMostOneElementWithTolerance(xs, true, context);
}

function getAtMostOneElementWithTolerance<T>(xs: T[], tolerateEmptyArray: boolean, context: string | null = null): T | null {
  const PREAMBLE: string = msg(`${getAtMostOneElementWithTolerance.name}(${tolerateEmptyArray})`);
  const msg2 = (body: string) => {
    return `${PREAMBLE} ${body}` +
      (context === null ? '' : ` -- context is: [${context}]`);
  };
  assert.isTrue(isArray(xs), msg2('argument is not an array'));

  if (xs.length > 1) {
    console.error(msg2(`{getAtMostOneElementWithTolerance.name} array is:`), xs);
    assert.fail(msg2(`${xs.length} (>1) elements were present!`));
    return sca_fake_return<T>(getAtMostOneElementWithTolerance.name);
  } else {
    if (xs.length === 1)
      return xs[0];
    else {
      if (tolerateEmptyArray)
        return null;
      else {
        assert.fail(msg2(`${xs.length} (!=1) elements were present!`));
        return sca_fake_return<T>(getAtMostOneElementWithTolerance.name);
      }
    }
  }
}

/* convert an object with successive, zero-indexed string properties to an array
 * e.g. convert {'1': 'one', '2': 'two'} to ['one', 'two']
 */
export function convObjWithSuccZIntProps2Arr(o: object): any[] {
  return Object.entries(o).map(([key, value], index) => {
    const HEADER = `util.ts#${convObjWithSuccZIntProps2Arr.name}: failure to convert upon index=${index}`;
    if (!isStringWithIntValue(key)) {
      const MSG = `${HEADER} key [${key}] is not a string with int value`;
      console.error(MSG, o);
      assert.fail(MSG);
    }
    const v = parseInt(key);
    if (!isInt(v)) {
      const MSG = `${HEADER} key [${key}] impossibility`;
      console.error(MSG, o);
      assert.fail(MSG);
    }
    if (v !== index) {
      const MSG = `${HEADER} key [${key}] not aligned with index ${index}`;
      console.error(MSG, o);
      assert.fail(MSG);
    }
    return value;
  });
}

export function objectHasAllPropertiesUndefined(o: any) {
  return JSON.stringify(o) === JSON.stringify({});
}


export function objectContainsValue(o: object, v: any): boolean {
  return Object.values(o).includes(v);
}

export function assert_objectContainsValue(o: object, v: any, ctx: string | null = null) {
  if (!Object.values(o).includes(v)) {
    const PREFIX = msg(`${assert_objectContainsValue.name}`);
    console.log(`${PREFIX} 1 - context: [${ctx}] # object: `, o);
    console.log(`${PREFIX} 2 - does not contain value: `, v);
    assert.fail(`${PREFIX} object ${o} does not contain value ${v}`);
  }
}

export function is_object_of_class(o: any, klass: any) {
  return (o instanceof klass);
}

export function is_objects_of_class(os: any[], klass: any, verbose: boolean = false) {
  function pref(s: string) {
    const PREFIX = 'is_objects_of_class';
    return msg(`${PREFIX} # ${s}`);
  }
  for (let i = 0; i < os.length; i++) {
    const o = os[i];
    if (!is_object_of_class(o, klass)) {
      if (verbose) {
        console.log(pref(`1/2 - the ${i + 1}-th object out of ${os.length} is: `), o);
        console.log(pref(`2/2 - ... and not of the expected class: `), klass);
      }
      return false;
    }
  }
  return true;
}

export function no_value_null_or_undefined<T>(os: T[]): boolean {
  for (let i = 0; i < os.length; i++)
    if (os == null)
      return false;
  return true;
}

export function all_are_null_or_none_is_null_or_undefined(os: any[]) {
  if (os.length === 0)
    return true;
  else {
    let null_encountered = false;
    let non_null_encountered = false;
    for (let i = 0; i < os.length; i++) {
      if (os[i] === null)
        null_encountered = true;
      if ((os[i] !== null) && (os[i] !== undefined))
        non_null_encountered = true;
    }
    return (null_encountered && !non_null_encountered) || (!null_encountered && non_null_encountered);
  }

}

// TODO: merge with the above and write test cases
export function all_are_undefined_or_none_is_null_or_undefined(os: any[]) {
  if (os.length === 0)
    return true;
  else {
    let undefined_encountered = false;
    let non_undefined_encountered = false;
    for (let i = 0; i < os.length; i++) {
      if (os[i] === undefined)
        undefined_encountered = true;
      if ((os[i] !== null) && (os[i] !== undefined))
        non_undefined_encountered = true;
    }
    return (undefined_encountered && !non_undefined_encountered) || (!undefined_encountered && non_undefined_encountered);
  }

}

/*
 * num = the number to round
 * func = the Math function to apply
 * prec = the precision needed (in number)
 */
export const roundUsing = (num: number, func: (x: number) => number, prec: number) => {
  var temp = num * Math.pow(10, prec)
  temp = func(temp);
  return temp / Math.pow(10, prec)
}

export const floorRounding = (num: number, prec: number) => {
  return roundUsing(num, Math.floor, prec);
}

export const roundRounding = (num: number, prec: number) => {
  return roundUsing(num, Math.round, prec);
}

export const evenRounding = (num: number, prec: number) => {
  // my method is not 100% correct (I think) as I don't implement banker's rounding
  const v1: number = evenRoundingMine(num, prec);
  const v2: number = evenRoundingSO(num, prec);
  if (v2 !== v1)
    console.warn(`evenRounding(${num}, ${prec}): v1 = ${v1}, v2 = ${v2} (returning ${v2})`);
  return v2;
}

const evenRoundingMine = (num: number, prec: number) => {
  return roundUsing(num, Math.round, prec);
}
// https://stackoverflow.com/a/3109234/274677
const evenRoundingSO = (num: number, prec: number) => {
  var d = prec || 0;
  var m = Math.pow(10, d);
  var n = +(d ? num * m : num).toFixed(8); // Avoid rounding errors
  var i = Math.floor(n), f = n - i;
  var e = 1e-8; // Allow for rounding errors in f
  var r = (f > 0.5 - e && f < 0.5 + e) ?
    ((i % 2 === 0) ? i : i + 1) : Math.round(n);
  return d ? r / m : r;
}

export const meters_to_ha_round_rounding = (square_meters: number): number => {
  return roundRounding(square_meters/10000, 2);
}


export function relative_diff(a: number, b: number) {
  // https://stackoverflow.com/a/23760013/274677 (with certain modifications)
  const tentative_divisor: number = (a + b) / 2;
  const divisor = tentative_divisor !== 0 ? tentative_divisor : Number.EPSILON
  return 100 * Math.abs((a - b) / divisor);
}


/*
 * returns all objects of 'a' not found in 'b' where equality
 * is pronounced using the 'equal' predicate or reference
 * equality if no predicate is supplied.
 */
export function subtract<T>(as: T[], bs: T[], equal: (a: T, b: T) => boolean = (a, b) => (a === b)): T[] {
  return filter(as, (a) => !some(bs, (b) => equal(a, b)));
}

//https://stackoverflow.com/a/6566471
export const toQueryParamsString = (params: any) => {
  const qs = Object.keys(params).map(key => {
    const v = params[key];
    if (v !== null && v !== undefined && params[key] !== "") {
      return `${key}=${encodeURIComponent(params[key])}`;
    } else {
      return null;
    }
  }).filter(x => x !== null);
  if (!isEmpty(qs)) {
    return qs.join('&');
  } else {
    return null;
  }
}

// Token Read To Silence 'No Unused Parameters'
export const TRTSNUP = (...xs: any[]) => {
  xs.forEach((x: any) => {
    if (x === Symbol())
      assert.fail('impossible');
  });
}

export const copyToClipboard = (str: string) => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export const sqm_to_ha = (sqm: number) => {
  return sqm / (10 * 1000)
}

export function surelyExists<T>(t: T | undefined | null, msg: string): T {
  if (t != null)
    return t;
  else
    return sca_fake_return<T>(msg);
}


// surely defined fubar otherwise
function sdfbo<T>(t: T | undefined, ctx: string, n: number, s?: string): T {
  if (t !== undefined) {
    return t;
  } else {
    return sca_fake_return<T>(fubarwc(ctx, n, s));
  }
}

// surely not null fubar otherwise
function snnfbo<T>(t: T | null, ctx: string, n: number, s?: string): T {
  if (t !== null) {
    return t;
  } else {
    return sca_fake_return<T>(fubarwc(ctx, n, s));
  }
}

// surely exists fubar otherwise
function sefbo<T>(t: T | undefined | null, ctx: string, n: number, s?: string): T {
  if (t != null) {
    return t;
  } else {
    return sca_fake_return<T>(fubarwc(ctx, n, s));
  }
}

export const create_sdfbo = (ctx: string)=>{
  return <T, >(t: T | undefined, n: number, s?: string): T => sdfbo(t, ctx, n, s);
}

export const create_snnfbo = (ctx: string)=>{
  return <T, >(t: T | null, n: number, s?: string): T => snnfbo(t, ctx, n, s);
}

export const create_sefbo = (ctx: string)=>{
  return <T, >(t: T | undefined | null, n: number, s?: string): T => sefbo(t, ctx, n, s);
}


export function surelyAllExist<T>(ts: (T | undefined | null)[], msg: string): T[] {
  for (let i = 0; i < ts.length ; i++) {
    const t: T | undefined | null = ts[i];
    if (t == null) {
      const is_strictly_null = (t===null);
      const text = is_strictly_null?'null':'undefined';
      return sca_fake_return<T[]>(`${msg}: the value on the ${i}-th position is ${text}`);
    }
  }
  return ts as T[];
}

export function padZeros(num: string, size: number) {
  while (num.length < size) num = "0" + num;
  return num;
}

export const sortArraysOfObjectsByAlphanumericColumn = <T,>(array: Array<T>, attributeName: string, ascended: boolean = true): Array<T> => {
  return array.sort((a: any, b: any) => {
    if (a && b && a[attributeName] && b[attributeName]) {
      if (ascended ? a[attributeName] < b[attributeName] : a[attributeName] > b[attributeName]) {
        return -1;
      }
      if (ascended ? a[attributeName] > b[attributeName] : a[attributeName] < b[attributeName]) {
        return 1;
      }
      return 0;
    }
    return 0;
  });
}

export function sse() {
  const d = new Date();
  return Math.round(d.getTime() / 1000);
}

/* 
 *    returns [true] if the two values are either:
 *    (a) within [absolute] of each other in absolute terms
 *    - or - 
 *    (b) within relative_percent % of each other (calculated either way) in relative terms
 */
export function values_are_within(v1: number, v2: number, absolute: number, relative_percent: number): boolean {
  const abs_diff = Math.abs(v1 - v2);
  if (abs_diff <= absolute)
    return true;
  else {
    if ((v1 === 0) || (v2 === 0))
      return false;
    else {
      const relative_diff_percent_1 = (abs_diff / v1) * 100;
      const relative_diff_percent_2 = (abs_diff / v2) * 100;
      return (relative_diff_percent_1 <= relative_percent) || (relative_diff_percent_2 <= relative_percent);
    }
  }
}

export function dateComparator(date1: string | null, date2: string | null, format = "DD/MM/YYYY") {
  if (date1 === null)
    return -1
  if (date2 === null)
    return 1
  const momentDate1 = moment(date1, format).valueOf();
  const momentDate2 = moment(date2, format).valueOf();
  return momentDate1 - momentDate2;
}

export function is_taxnumber_valid(taxnumber: string): boolean {

  const N = taxnumber.length;
  if (N !== 9) {
    return false;
  } else {
    const is_all_digits = /^\d+$/.test(taxnumber);
    if (!is_all_digits) {
      return false;
    } else {
      const check_digit = parseInt(taxnumber[N-1]);
      let sum = 0;
      for (let i = 1; i < N ; i++) {
        const digit = parseInt(taxnumber[N-1-i]);
        sum += digit * Math.pow(2, i);
      }
      const check_digit_2 = (sum % 11) % 10;
      return check_digit === check_digit_2;
    }
  }
}

/*
 *
 *    If [x] is equal to replacement_pairs[i][first, ] (for any [i]), then return 
 *    replacement_pairs[i][, second] on the first occurrence of such [i].
 *
 *    Otherwise, i.e. if for all [i], [x] is not equal to any replacement_pairs[i][first, ]
 *    then return [x]
 *
 */
export function substitute<T, V>(x: T, ...replacement_pairs: [T, V][]): T|V {
  for (let i = 0 ; i < replacement_pairs.length; i++) {
    const [value_to_look_for, value_to_replace_with]: [T, V] = replacement_pairs[i];
    if (x === value_to_look_for)
      return value_to_replace_with;
  }
  return x;
}

export function subs_null_with_false(x: null | boolean): boolean {
  if (x===null)
    return false;
  else
    return x;
}


export function subs_empty_string_with_null(x: string): null | string {
  return substitute(x, ['', null]);
}

export function subs_empty_nullable_string_with_null(x: string | null): null | string {
  return substitute(x, ['', null]);
}


export function identical<T>(t1: T, t2: T, ctx: string): T {
  assert.strictEqual(t1, t2, fubarwc(ctx, 713));
  return t1;
}

export function string_to_boolean(ctx: string, s: string): boolean {
  switch (s) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return sca_fake_return<boolean>(fubarwc(ctx, 7720, `unrecognized value: [${s}]`));
  }
}


const { fubar, fubarwc, msg } = log_utils('util.ts');
