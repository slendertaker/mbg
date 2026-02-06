/**
 * Resep - Parser dan validator file resep (.resep.json)
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { PESAN, format } from "./pesan.js";

/**
 * Tipe bahan yang tersedia
 */
export const TIPE_BAHAN = [
    "uuid",
    "increment",
    "angka",
    "nama_lengkap",
    "nama_depan",
    "nama_belakang",
    "email",
    "telepon",
    "alamat",
    "kota",
    "provinsi",
    "kodepos",
    "pilihan",
    "boolean",
    "tanggal",
    "waktu",
    "paragraf",
    "kalimat",
    "url",
    "warna",
    "perusahaan",
    "referensi",
    "regex",
];

/**
 * Error khusus untuk masalah resep
 */
export class ResepError extends Error {
    constructor(message, kode) {
        super(message);
        this.name = "ResepError";
        this.kode = kode;
    }
}

/**
 * Class Resep untuk parsing dan validasi
 */
export class Resep {
    /**
     * @param {string} filePath - Path ke file resep
     */
    constructor(filePath) {
        this.filePath = resolve(filePath);
        this.data = null;
        this.errors = [];
        this.warnings = [];
    }

    /**
     * Load dan parse file resep
     * @returns {Resep}
     */
    load() {
        // Cek file exists
        if (!existsSync(this.filePath)) {
            throw new ResepError(
                format(PESAN.RESEP_NOT_FOUND, { file: this.filePath }),
                "RESEP_NOT_FOUND",
            );
        }

        // Baca file
        let content;
        try {
            content = readFileSync(this.filePath, "utf-8");
        } catch (err) {
            throw new ResepError(
                format(PESAN.RESEP_NOT_FOUND, { file: this.filePath }),
                "RESEP_NOT_FOUND",
            );
        }

        // Parse JSON
        try {
            this.data = JSON.parse(content);
        } catch (err) {
            throw new ResepError(
                PESAN.RESEP_INVALID_JSON,
                "RESEP_INVALID_JSON",
            );
        }

        return this;
    }

    /**
     * Validasi struktur resep
     * @returns {{valid: boolean, errors: string[], warnings: string[]}}
     */
    validasi() {
        this.errors = [];
        this.warnings = [];

        if (!this.data) {
            this.errors.push("Resep belum di-load");
            return {
                valid: false,
                errors: this.errors,
                warnings: this.warnings,
            };
        }

        // Cek field bahan
        if (!this.data.bahan || typeof this.data.bahan !== "object") {
            this.errors.push(PESAN.RESEP_NO_BAHAN);
            return {
                valid: false,
                errors: this.errors,
                warnings: this.warnings,
            };
        }

        // Validasi setiap field bahan
        const bahan = this.data.bahan;
        let stuntingCount = 0;

        for (const [field, config] of Object.entries(bahan)) {
            if (!config || typeof config !== "object") {
                this.errors.push(`Field "${field}": konfigurasi tidak valid`);
                continue;
            }

            if (!config.tipe) {
                this.errors.push(
                    `Field "${field}": tipe bahan tidak didefinisikan`,
                );
                continue;
            }

            if (!TIPE_BAHAN.includes(config.tipe)) {
                this.errors.push(
                    format(PESAN.RESEP_TIPE_UNKNOWN, { tipe: config.tipe }),
                );
                continue;
            }

            // Validasi spesifik per tipe
            this._validasiTipe(field, config);

            // Deteksi potensi stunting
            if (this._potensiStunting(config)) {
                stuntingCount++;
            }
        }

        // Warning stunting
        if (stuntingCount > 0) {
            this.warnings.push(
                format(PESAN.GIZI_STUNTING, { jumlah: stuntingCount }),
            );
        }

        return {
            valid: this.errors.length === 0,
            errors: this.errors,
            warnings: this.warnings,
        };
    }

    /**
     * Validasi konfigurasi spesifik per tipe
     * @param {string} field
     * @param {object} config
     */
    _validasiTipe(field, config) {
        switch (config.tipe) {
            case "pilihan":
                if (
                    !config.opsi ||
                    !Array.isArray(config.opsi) ||
                    config.opsi.length === 0
                ) {
                    this.errors.push(
                        `Field "${field}": tipe pilihan memerlukan array "opsi"`,
                    );
                }
                break;

            case "angka":
                if (config.min !== undefined && config.max !== undefined) {
                    if (config.min > config.max) {
                        this.errors.push(
                            `Field "${field}": min tidak boleh lebih besar dari max`,
                        );
                    }
                }
                break;

            case "tanggal":
            case "waktu":
                if (config.dari && config.sampai) {
                    const dari = new Date(config.dari);
                    const sampai = new Date(config.sampai);
                    if (dari > sampai) {
                        this.errors.push(
                            `Field "${field}": tanggal "dari" tidak boleh setelah "sampai"`,
                        );
                    }
                }
                break;

            case "referensi":
                if (!config.dari) {
                    this.errors.push(
                        `Field "${field}": tipe referensi memerlukan field "dari"`,
                    );
                }
                break;

            case "regex":
                if (!config.pola) {
                    this.errors.push(
                        `Field "${field}": tipe regex memerlukan field "pola"`,
                    );
                } else {
                    try {
                        new RegExp(config.pola);
                    } catch (e) {
                        this.errors.push(
                            `Field "${field}": pola regex tidak valid`,
                        );
                    }
                }
                break;
        }
    }

    /**
     * Deteksi potensi data kosong (stunting)
     * @param {object} config
     * @returns {boolean}
     */
    _potensiStunting(config) {
        // Pilihan dengan opsi kosong
        if (config.tipe === "pilihan" && config.opsi) {
            if (config.opsi.some((o) => o === "" || o === null)) {
                return true;
            }
        }

        // Boolean dengan rasio ekstrem
        if (config.tipe === "boolean") {
            const rasio = config.rasio_benar;
            if (rasio !== undefined && (rasio < 0.01 || rasio > 0.99)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Dapatkan nama menu
     * @returns {string}
     */
    getNamaMenu() {
        return this.data?.menu || "unknown";
    }

    /**
     * Dapatkan target sekolah/tabel
     * @returns {string}
     */
    getSekolah() {
        return this.data?.sekolah || this.data?.menu || "data";
    }

    /**
     * Dapatkan definisi bahan
     * @returns {object}
     */
    getBahan() {
        return this.data?.bahan || {};
    }

    /**
     * Dapatkan data resep lengkap
     * @returns {object}
     */
    getData() {
        return this.data;
    }
}

export default Resep;
