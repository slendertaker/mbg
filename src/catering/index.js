/**
 * Barrel export untuk catering adapters
 */

import { CateringJSON } from "./json.js";
import { CateringCSV } from "./csv.js";
import { CateringSQL } from "./sql.js";

export { CateringJSON } from "./json.js";
export { CateringCSV } from "./csv.js";
export { CateringSQL } from "./sql.js";

/**
 * Get catering adapter by format
 * @param {string} format - json, csv, sql
 * @param {object} options
 * @returns {object}
 */
export function getCatering(format, options = {}) {
    switch (format.toLowerCase()) {
        case "json":
            return new CateringJSON(options);
        case "csv":
            return new CateringCSV(options);
        case "sql":
            return new CateringSQL(options);
        default:
            throw new Error(`Format "${format}" tidak dikenali`);
    }
}
