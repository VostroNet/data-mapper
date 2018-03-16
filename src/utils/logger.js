import debug from "debug";
import pack from "package";

const pkg = pack(module);

export default function logger(prefix = "", suffix = "") {
  const id = `[${(process || {}).pid || ""}]`;
  return {
    error: debug(`${id}${pkg.name}::${prefix}error${suffix}`),
    err: debug(`${id}${pkg.name}::${prefix}error${suffix}`),
    log: debug(`${id}${pkg.name}::${prefix}log${suffix}`),
    info: debug(`${id}${pkg.name}::${prefix}info${suffix}`),
    debug: debug(`${id}${pkg.name}::${prefix}debug${suffix}`),
    warn: debug(`${id}${pkg.name}::${prefix}debug${suffix}`),
    sql: debug(`${id}${pkg.name}::${prefix}sql${suffix}`),
  };
}
