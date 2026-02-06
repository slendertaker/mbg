/**
 * Data umum: email, lorem, URL, dll.
 */

import nama from "./nama.js";

const DOMAIN_EMAIL = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "email.com",
    "mail.com",
    "ymail.com",
    "protonmail.com",
];

const DOMAIN_LOKAL = [
    "gmail.com",
    "yahoo.co.id",
    "email.co.id",
    "outlook.co.id",
];

const KATA_LOREM = [
    "lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
    "enim",
    "ad",
    "minim",
    "veniam",
    "quis",
    "nostrud",
    "exercitation",
    "ullamco",
    "laboris",
    "nisi",
    "aliquip",
    "ex",
    "ea",
    "commodo",
    "consequat",
    "duis",
    "aute",
    "irure",
    "in",
    "reprehenderit",
    "voluptate",
    "velit",
    "esse",
    "cillum",
    "fugiat",
    "nulla",
    "pariatur",
    "excepteur",
    "sint",
    "occaecat",
    "cupidatat",
    "non",
    "proident",
    "sunt",
    "culpa",
    "qui",
    "officia",
    "deserunt",
    "mollit",
    "anim",
    "id",
    "est",
    "laborum",
];

const WARNA = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#A133FF",
    "#33FFF5",
    "#FFD433",
    "#FF8C33",
    "#8CFF33",
    "#338CFF",
    "#FF338C",
    "#33FF8C",
    "#C70039",
    "#900C3F",
    "#581845",
    "#FFC300",
    "#DAF7A6",
    "#FF5733",
    "#1ABC9C",
    "#2ECC71",
    "#3498DB",
    "#9B59B6",
    "#E74C3C",
    "#F39C12",
    "#16A085",
    "#27AE60",
    "#2980B9",
    "#8E44AD",
    "#C0392B",
    "#D35400",
];

/**
 * Pilih elemen acak dari array
 * @param {Array} arr
 * @returns {*}
 */
function pilihAcak(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate angka acak dalam range
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function angkaAcak(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Normalize string untuk email (lowercase, hapus spasi)
 * @param {string} str
 * @returns {string}
 */
function normalizeEmail(str) {
    return str
        .toLowerCase()
        .replace(/\s+/g, ".")
        .replace(/[^a-z0-9.]/g, "");
}

/**
 * Generate email dari nama
 * @param {string} [domain] - Domain email (opsional)
 * @returns {string}
 */
export function email(domain) {
    const namaDepan = nama.namaDepan();
    const namaBelakang = nama.namaBelakang();
    const domainEmail = domain || pilihAcak(DOMAIN_EMAIL);

    const formats = [
        () =>
            `${normalizeEmail(namaDepan)}.${normalizeEmail(namaBelakang)}@${domainEmail}`,
        () =>
            `${normalizeEmail(namaDepan)}${normalizeEmail(namaBelakang)}@${domainEmail}`,
        () =>
            `${normalizeEmail(namaDepan)}.${normalizeEmail(namaBelakang)}${angkaAcak(1, 99)}@${domainEmail}`,
        () =>
            `${normalizeEmail(namaDepan)}${angkaAcak(100, 999)}@${domainEmail}`,
    ];

    return pilihAcak(formats)();
}

/**
 * Generate UUID v4
 * @returns {string}
 */
export function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Generate kata-kata lorem
 * @param {number} jumlah - Jumlah kata
 * @returns {string}
 */
export function lorem(jumlah = 10) {
    const words = [];
    for (let i = 0; i < jumlah; i++) {
        words.push(pilihAcak(KATA_LOREM));
    }
    return words.join(" ");
}

/**
 * Generate kalimat
 * @returns {string}
 */
export function kalimat() {
    const jumlahKata = angkaAcak(5, 15);
    const teks = lorem(jumlahKata);
    return teks.charAt(0).toUpperCase() + teks.slice(1) + ".";
}

/**
 * Generate paragraf
 * @param {number} jumlahKalimat - Jumlah kalimat
 * @returns {string}
 */
export function paragraf(jumlahKalimat = 5) {
    const kalimatList = [];
    for (let i = 0; i < jumlahKalimat; i++) {
        kalimatList.push(kalimat());
    }
    return kalimatList.join(" ");
}

/**
 * Generate URL
 * @param {string} [domain] - Domain (opsional)
 * @returns {string}
 */
export function url(domain) {
    const baseDomain = domain || `${lorem(1)}.com`;
    const path = lorem(angkaAcak(1, 3)).replace(/\s+/g, "/");
    return `https://${baseDomain}/${path}`;
}

/**
 * Generate warna hex
 * @returns {string}
 */
export function warna() {
    return pilihAcak(WARNA);
}

/**
 * Generate warna hex acak
 * @returns {string}
 */
export function warnaAcak() {
    const hex = Math.floor(Math.random() * 16777215).toString(16);
    return "#" + hex.padStart(6, "0").toUpperCase();
}

/**
 * Generate boolean dengan rasio tertentu
 * @param {number} rasioBenar - Rasio nilai true (0-1)
 * @returns {boolean}
 */
export function boolean(rasioBenar = 0.5) {
    return Math.random() < rasioBenar;
}

/**
 * Generate angka dalam range
 * @param {number} min
 * @param {number} max
 * @param {number} [desimal] - Jumlah desimal
 * @returns {number}
 */
export function angka(min = 0, max = 100, desimal = 0) {
    if (desimal === 0) {
        return angkaAcak(min, max);
    }
    const value = Math.random() * (max - min) + min;
    return Number(value.toFixed(desimal));
}

/**
 * Generate tanggal acak
 * @param {string} dari - Tanggal awal (YYYY-MM-DD)
 * @param {string} sampai - Tanggal akhir (YYYY-MM-DD)
 * @returns {string} - Format YYYY-MM-DD
 */
export function tanggal(dari = "2020-01-01", sampai = "2025-12-31") {
    const start = new Date(dari).getTime();
    const end = new Date(sampai).getTime();
    const randomTime = angkaAcak(start, end);
    const date = new Date(randomTime);
    return date.toISOString().split("T")[0];
}

/**
 * Generate waktu/datetime acak
 * @param {string} dari - Waktu awal (ISO string)
 * @param {string} sampai - Waktu akhir (ISO string)
 * @returns {string} - Format ISO
 */
export function waktu(
    dari = "2020-01-01T00:00:00Z",
    sampai = "2025-12-31T23:59:59Z",
) {
    const start = new Date(dari).getTime();
    const end = new Date(sampai).getTime();
    const randomTime = angkaAcak(start, end);
    return new Date(randomTime).toISOString();
}

/**
 * Pilih dari opsi
 * @param {Array} opsi - Array opsi
 * @returns {*}
 */
export function pilihan(opsi) {
    return pilihAcak(opsi);
}

export default {
    email,
    uuid,
    lorem,
    kalimat,
    paragraf,
    url,
    warna,
    warnaAcak,
    boolean,
    angka,
    tanggal,
    waktu,
    pilihan,
    DOMAIN_EMAIL,
    KATA_LOREM,
    WARNA,
};
