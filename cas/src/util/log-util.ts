import {constants} from '../constants';


export function log(...args: unknown[]) {
  if (!constants.SILENT)
    console.log(...args);
}

export function debug(...args: unknown[]) {
  if (!constants.SILENT)
    console.debug(...args);
}

export function info(...args: unknown[]) {
  if (!constants.SILENT)
    console.info(...args);
}

export function warn(...args: unknown[]) {
  if (!constants.SILENT)
    console.warn(...args);
}

export function error(...args: unknown[]) {
  if (!constants.SILENT)
    console.error(...args);
}

export function log_utils(FNAME: string) {

  function fubar(n: number, s?: string) {
    const suffix = (s===undefined)?'':` ~*~ {${s}}`;
    return msg(`ERRENC: #${n}${suffix}`); // ERRor ENCountered ("fubar" would have made for bad publicity)
  }

  // fubar with context
  function fubarwc(context: string, n: number, s?: string) {
    const suffix = (s===undefined)?'':` ~*~ {${s}}`;
    return msg(`${context} :: ERRENC: #${n}${suffix}`);
  }  

  function fname() {
    return FNAME;
  }

  function msg(m: string) {
    return `${fname()} | ${m}`;
  }

  return {fubar, fubarwc, fname, msg};

}
