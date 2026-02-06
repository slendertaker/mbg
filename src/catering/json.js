/**
 * Catering JSON - Output adapter untuk format JSON
 */

import { writeFileSync, existsSync } from "node:fs";
import { PESAN, format } from "../pesan.js";

/**
 * Class CateringJSON
 */
export class CateringJSON {
    constructor(options = {}) {
        this.options = {
            pretty: true,
            timpa: false,
            ...options,
        };
    }

    /**
     * Tulis data ke file JSON
     * @param {object[]} data
     * @param {string} filePath
     * @returns {{success: boolean, path: string, size: number}}
     */
    tulis(data, filePath) {
        // Cek file exists
        if (!this.options.timpa && existsSync(filePath)) {
            throw new Error(format(PESAN.OUTPUT_EXISTS, { file: filePath }));
        }

        // Format JSON
        const content = this.options.pretty
            ? JSON.stringify(data, null, 2)
            : JSON.stringify(data);

        // Tulis file
        writeFileSync(filePath, content, "utf-8");

        return {
            success: true,
            path: filePath,
            size: Buffer.byteLength(content, "utf-8"),
        };
    }

    /**
     * Konversi data ke string JSON
     * @param {object[]} data
     * @returns {string}
     */
    toString(data) {
        return this.options.pretty
            ? JSON.stringify(data, null, 2)
            : JSON.stringify(data);
    }
}

export default CateringJSON;
