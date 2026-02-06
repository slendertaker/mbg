/**
 * Data nomor telepon Indonesia
 */

const PREFIX_HP = [
    // Telkomsel
    "0811",
    "0812",
    "0813",
    "0821",
    "0822",
    "0823",
    "0852",
    "0853",
    // Indosat
    "0814",
    "0815",
    "0816",
    "0855",
    "0856",
    "0857",
    "0858",
    // XL
    "0817",
    "0818",
    "0819",
    "0859",
    "0877",
    "0878",
    // Tri
    "0895",
    "0896",
    "0897",
    "0898",
    "0899",
    // Smartfren
    "0881",
    "0882",
    "0883",
    "0884",
    "0885",
    "0886",
    "0887",
    "0888",
    "0889",
    // Axis
    "0838",
    "0831",
    "0832",
    "0833",
];

const KODE_AREA = [
    { kode: "021", kota: "Jakarta" },
    { kode: "022", kota: "Bandung" },
    { kode: "024", kota: "Semarang" },
    { kode: "031", kota: "Surabaya" },
    { kode: "061", kota: "Medan" },
    { kode: "0411", kota: "Makassar" },
    { kode: "0274", kota: "Yogyakarta" },
    { kode: "0251", kota: "Bogor" },
    { kode: "0341", kota: "Malang" },
    { kode: "0361", kota: "Denpasar" },
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
 * Generate digit acak sejumlah n
 * @param {number} n
 * @returns {string}
 */
function digitAcak(n) {
    let result = "";
    for (let i = 0; i < n; i++) {
        result += angkaAcak(0, 9);
    }
    return result;
}

/**
 * Generate nomor HP Indonesia (format lokal: 08xxxxxxxxxx)
 * @returns {string}
 */
export function nomorHp() {
    const prefix = pilihAcak(PREFIX_HP);
    const suffix = digitAcak(8);
    return `${prefix}${suffix}`;
}

/**
 * Generate nomor HP Indonesia (format internasional: +628xxxxxxxxxx)
 * @returns {string}
 */
export function nomorHpInternasional() {
    const hp = nomorHp();
    return "+62" + hp.substring(1);
}

/**
 * Generate nomor telepon rumah/kantor
 * @returns {string}
 */
export function nomorTelepon() {
    const area = pilihAcak(KODE_AREA);
    const suffix = digitAcak(7);
    return `(${area.kode}) ${suffix}`;
}

export default {
    nomorHp,
    nomorHpInternasional,
    nomorTelepon,
    PREFIX_HP,
    KODE_AREA,
};
