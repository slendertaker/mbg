/**
 * Gizi - Validator untuk output data
 */

import { PESAN, format } from "./pesan.js";

/**
 * Class Gizi untuk validasi data output
 */
export class Gizi {
    constructor() {
        this.laporan = {
            total: 0,
            valid: 0,
            stunting: 0,
            fieldKosong: {},
        };
    }

    /**
     * Reset laporan
     */
    reset() {
        this.laporan = {
            total: 0,
            valid: 0,
            stunting: 0,
            fieldKosong: {},
        };
    }

    /**
     * Validasi satu record
     * @param {object} record
     * @param {object} definisiBahan
     * @returns {{valid: boolean, masalah: string[]}}
     */
    periksaSatu(record, definisiBahan) {
        const masalah = [];

        for (const [field, config] of Object.entries(definisiBahan)) {
            const nilai = record[field];

            // Cek field kosong
            if (nilai === null || nilai === undefined || nilai === "") {
                masalah.push(`Field "${field}" kosong`);
                this._catatKosong(field);
                continue;
            }

            // Validasi tipe
            const tipeValid = this._validasiTipe(nilai, config);
            if (!tipeValid) {
                masalah.push(
                    `Field "${field}" tidak sesuai tipe ${config.tipe}`,
                );
            }

            // Validasi constraint
            const constraintValid = this._validasiConstraint(nilai, config);
            if (!constraintValid.valid) {
                masalah.push(`Field "${field}": ${constraintValid.pesan}`);
            }
        }

        return {
            valid: masalah.length === 0,
            masalah,
        };
    }

    /**
     * Validasi batch record
     * @param {object[]} records
     * @param {object} definisiBahan
     * @returns {{lulus: boolean, laporan: object}}
     */
    periksa(records, definisiBahan) {
        this.reset();
        this.laporan.total = records.length;

        for (const record of records) {
            const hasil = this.periksaSatu(record, definisiBahan);
            if (hasil.valid) {
                this.laporan.valid++;
            } else {
                this.laporan.stunting++;
            }
        }

        return {
            lulus: this.laporan.stunting === 0,
            laporan: { ...this.laporan },
        };
    }

    /**
     * Catat field kosong
     * @param {string} field
     */
    _catatKosong(field) {
        if (!this.laporan.fieldKosong[field]) {
            this.laporan.fieldKosong[field] = 0;
        }
        this.laporan.fieldKosong[field]++;
    }

    /**
     * Validasi tipe nilai
     * @param {*} nilai
     * @param {object} config
     * @returns {boolean}
     */
    _validasiTipe(nilai, config) {
        switch (config.tipe) {
            case "uuid":
                return (
                    typeof nilai === "string" &&
                    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
                        nilai,
                    )
                );

            case "increment":
            case "angka":
                return typeof nilai === "number" && !isNaN(nilai);

            case "boolean":
                return typeof nilai === "boolean";

            case "tanggal":
                return (
                    typeof nilai === "string" &&
                    /^\d{4}-\d{2}-\d{2}$/.test(nilai)
                );

            case "waktu":
                return typeof nilai === "string" && !isNaN(Date.parse(nilai));

            case "email":
                return (
                    typeof nilai === "string" &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nilai)
                );

            case "telepon":
                return (
                    typeof nilai === "string" &&
                    /^(\+62|0)\d{9,12}$/.test(nilai)
                );

            default:
                return typeof nilai === "string" || typeof nilai === "number";
        }
    }

    /**
     * Validasi constraint
     * @param {*} nilai
     * @param {object} config
     * @returns {{valid: boolean, pesan?: string}}
     */
    _validasiConstraint(nilai, config) {
        switch (config.tipe) {
            case "angka":
                if (config.min !== undefined && nilai < config.min) {
                    return {
                        valid: false,
                        pesan: `nilai ${nilai} kurang dari min ${config.min}`,
                    };
                }
                if (config.max !== undefined && nilai > config.max) {
                    return {
                        valid: false,
                        pesan: `nilai ${nilai} lebih dari max ${config.max}`,
                    };
                }
                break;

            case "pilihan":
                if (config.opsi && !config.opsi.includes(nilai)) {
                    return {
                        valid: false,
                        pesan: `nilai "${nilai}" tidak ada di opsi`,
                    };
                }
                break;

            case "tanggal":
                if (config.dari || config.sampai) {
                    const tanggal = new Date(nilai);
                    if (config.dari && tanggal < new Date(config.dari)) {
                        return {
                            valid: false,
                            pesan: `tanggal sebelum ${config.dari}`,
                        };
                    }
                    if (config.sampai && tanggal > new Date(config.sampai)) {
                        return {
                            valid: false,
                            pesan: `tanggal setelah ${config.sampai}`,
                        };
                    }
                }
                break;
        }

        return { valid: true };
    }

    /**
     * Generate laporan gizi dalam format teks
     * @returns {string}
     */
    getLaporanTeks() {
        const lines = [];
        lines.push("LAPORAN GIZI");
        lines.push("─".repeat(40));
        lines.push(`Total porsi     : ${this.laporan.total}`);
        lines.push(`Porsi valid     : ${this.laporan.valid}`);
        lines.push(`Porsi stunting  : ${this.laporan.stunting}`);

        if (Object.keys(this.laporan.fieldKosong).length > 0) {
            lines.push("");
            lines.push("Field kosong:");
            for (const [field, count] of Object.entries(
                this.laporan.fieldKosong,
            )) {
                lines.push(`  ${field}: ${count} record`);
            }
        }

        const tingkatGizi =
            this.laporan.total > 0
                ? ((this.laporan.valid / this.laporan.total) * 100).toFixed(2)
                : 0;

        lines.push("");
        lines.push(`Tingkat gizi    : ${tingkatGizi}%`);

        if (this.laporan.stunting === 0) {
            lines.push("");
            lines.push(PESAN.GIZI_LULUS);
        }

        return lines.join("\n");
    }
}

export default Gizi;
