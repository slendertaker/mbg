/**
 * Catering CSV - Output adapter untuk format CSV
 */

import { writeFileSync, existsSync } from "node:fs";
import { PESAN, format } from "../pesan.js";

/**
 * Class CateringCSV
 */
export class CateringCSV {
    constructor(options = {}) {
        this.options = {
            delimiter: ",",
            header: true,
            timpa: false,
            ...options,
        };
    }

    /**
     * Escape nilai untuk CSV
     * @param {*} value
     * @returns {string}
     */
    _escape(value) {
        if (value === null || value === undefined) {
            return "";
        }

        const str = String(value);

        // Perlu quote jika mengandung delimiter, newline, atau quote
        if (
            str.includes(this.options.delimiter) ||
            str.includes("\n") ||
            str.includes('"')
        ) {
            return '"' + str.replace(/"/g, '""') + '"';
        }

        return str;
    }

    /**
     * Konversi data ke string CSV
     * @param {object[]} data
     * @returns {string}
     */
    toString(data) {
        if (!data || data.length === 0) {
            return "";
        }

        const lines = [];
        const delimiter = this.options.delimiter;

        // Header
        const headers = Object.keys(data[0]);
        if (this.options.header) {
            lines.push(headers.join(delimiter));
        }

        // Rows
        for (const row of data) {
            const values = headers.map((h) => this._escape(row[h]));
            lines.push(values.join(delimiter));
        }

        return lines.join("\n");
    }

    /**
     * Tulis data ke file CSV
     * @param {object[]} data
     * @param {string} filePath
     * @returns {{success: boolean, path: string, size: number}}
     */
    tulis(data, filePath) {
        // Cek file exists
        if (!this.options.timpa && existsSync(filePath)) {
            throw new Error(format(PESAN.OUTPUT_EXISTS, { file: filePath }));
        }

        const content = this.toString(data);
        writeFileSync(filePath, content, "utf-8");

        return {
            success: true,
            path: filePath,
            size: Buffer.byteLength(content, "utf-8"),
        };
    }
}

export default CateringCSV;
