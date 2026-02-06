/**
 * Koki - Data generator berdasarkan resep
 */

import * as bahan from "./bahan/index.js";

/**
 * Class Koki untuk generate data
 */
export class Koki {
    constructor() {
        this.counter = {};
    }

    /**
     * Reset counter untuk increment
     */
    reset() {
        this.counter = {};
    }

    /**
     * Generate satu record berdasarkan definisi bahan
     * @param {object} definisiBahan - Definisi bahan dari resep
     * @param {number} index - Index record (untuk increment)
     * @returns {object}
     */
    masakSatu(definisiBahan, index = 0) {
        const record = {};

        for (const [field, config] of Object.entries(definisiBahan)) {
            record[field] = this._generateField(field, config, index);
        }

        return record;
    }

    /**
     * Generate banyak record
     * @param {object} definisiBahan - Definisi bahan dari resep
     * @param {number} porsi - Jumlah record
     * @returns {object[]}
     */
    masak(definisiBahan, porsi) {
        this.reset();
        const hasil = [];

        for (let i = 0; i < porsi; i++) {
            hasil.push(this.masakSatu(definisiBahan, i));
        }

        return hasil;
    }

    /**
     * Generate nilai untuk satu field
     * @param {string} field
     * @param {object} config
     * @param {number} index
     * @returns {*}
     */
    _generateField(field, config, index) {
        const tipe = config.tipe;

        switch (tipe) {
            case "uuid":
                return bahan.uuid();

            case "increment":
                return this._increment(field, config.mulai || 1);

            case "angka":
                return bahan.angka(
                    config.min ?? 0,
                    config.max ?? 100,
                    config.desimal ?? 0,
                );

            case "nama_lengkap":
                return bahan.namaLengkap();

            case "nama_depan":
                return bahan.namaDepan();

            case "nama_belakang":
                return bahan.namaBelakang();

            case "email":
                return bahan.email(config.domain);

            case "telepon":
                return bahan.nomorHp();

            case "alamat":
                return bahan.alamatLengkap();

            case "kota":
                return bahan.kota();

            case "provinsi":
                return bahan.provinsi();

            case "kodepos":
                return bahan.kodepos();

            case "pilihan":
                return bahan.pilihan(config.opsi || []);

            case "boolean":
                return bahan.boolean(config.rasio_benar ?? 0.5);

            case "tanggal":
                return bahan.tanggal(config.dari, config.sampai);

            case "waktu":
                return bahan.waktu(config.dari, config.sampai);

            case "paragraf":
                return bahan.paragraf(config.kalimat ?? 5);

            case "kalimat":
                return bahan.kalimat();

            case "url":
                return bahan.url(config.domain);

            case "warna":
                return bahan.warna();

            case "perusahaan":
                return bahan.namaPerusahaan();

            case "referensi":
                // Untuk v1, referensi hanya menghasilkan UUID
                // Implementasi proper di v1.2
                return bahan.uuid();

            case "regex":
                return this._generateRegex(config.pola);

            default:
                return null;
        }
    }

    /**
     * Generate increment value
     * @param {string} field
     * @param {number} mulai
     * @returns {number}
     */
    _increment(field, mulai) {
        if (this.counter[field] === undefined) {
            this.counter[field] = mulai;
        }
        return this.counter[field]++;
    }

    /**
     * Generate string dari regex pattern
     * Implementasi sederhana untuk pattern umum
     * @param {string} pola
     * @returns {string}
     */
    _generateRegex(pola) {
        // Implementasi sederhana
        // Untuk pattern kompleks, user sebaiknya gunakan tipe lain
        let result = pola;

        // Replace \d dengan angka acak
        result = result.replace(/\\d/g, () =>
            String(Math.floor(Math.random() * 10)),
        );

        // Replace \w dengan karakter
        const chars = "abcdefghijklmnopqrstuvwxyz";
        result = result.replace(
            /\\w/g,
            () => chars[Math.floor(Math.random() * chars.length)],
        );

        // Replace {n} repetition
        result = result.replace(/(.)\{(\d+)\}/g, (_, char, count) => {
            return char.repeat(parseInt(count, 10));
        });

        // Replace [a-z] dengan huruf acak
        result = result.replace(
            /\[a-z\]/g,
            () => chars[Math.floor(Math.random() * chars.length)],
        );

        // Replace [0-9] dengan angka acak
        result = result.replace(/\[0-9\]/g, () =>
            String(Math.floor(Math.random() * 10)),
        );

        // Replace [A-Z] dengan huruf besar acak
        result = result.replace(/\[A-Z\]/g, () =>
            chars[Math.floor(Math.random() * chars.length)].toUpperCase(),
        );

        // Hapus karakter regex yang tidak di-escape
        result = result.replace(/[\^$.*+?()[\]{}|\\]/g, "");

        return result;
    }
}

export default Koki;
