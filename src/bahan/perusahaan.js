/**
 * Data nama perusahaan Indonesia
 */

const BADAN_HUKUM = ["PT", "CV", "UD", "PT", "PT"]; // PT lebih sering muncul

const KATA_1 = [
    "Maju",
    "Sinar",
    "Bumi",
    "Karya",
    "Cipta",
    "Mega",
    "Prima",
    "Global",
    "Indo",
    "Nusa",
    "Cahaya",
    "Gemilang",
    "Surya",
    "Inti",
    "Multi",
    "Eka",
    "Tri",
    "Bina",
    "Graha",
    "Duta",
    "Anugerah",
    "Berkah",
    "Sentral",
    "Mitra",
    "Jaya",
    "Agung",
    "Lestari",
    "Mandala",
    "Citra",
    "Permata",
];

const KATA_2 = [
    "Jaya",
    "Abadi",
    "Sentosa",
    "Mandiri",
    "Utama",
    "Perkasa",
    "Makmur",
    "Cemerlang",
    "Berkah",
    "Sejahtera",
    "Pratama",
    "Persada",
    "Gemilang",
    "Lestari",
    "Sakti",
    "Mulia",
    "Indah",
    "Bahagia",
    "Sukses",
    "Tama",
];

const AKHIRAN = [
    "",
    "",
    "",
    "Nusantara",
    "Indonesia",
    "Mandiri",
    "Sejahtera",
    "Tbk",
    "Group",
];

const BIDANG = [
    "Konstruksi",
    "Teknologi",
    "Konsultan",
    "Trading",
    "Logistik",
    "Properti",
    "Manufaktur",
    "Agrikultur",
    "Pertambangan",
    "Energi",
    "Farmasi",
    "Tekstil",
    "Otomotif",
    "Elektronik",
    "Pangan",
    "Kimia",
    "Plastik",
    "Furnitur",
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
 * Generate nama perusahaan
 * Format: "PT Sinar Abadi Nusantara", "CV Maju Makmur", "PT Indo Perkasa Tbk"
 * @returns {string}
 */
export function namaPerusahaan() {
    const badan = pilihAcak(BADAN_HUKUM);
    const kata1 = pilihAcak(KATA_1);
    const kata2 = pilihAcak(KATA_2);
    const akhiran = pilihAcak(AKHIRAN);

    const parts = [badan, kata1, kata2];
    if (akhiran) {
        parts.push(akhiran);
    }

    return parts.join(" ");
}

/**
 * Generate bidang usaha
 * @returns {string}
 */
export function bidangUsaha() {
    return pilihAcak(BIDANG);
}

export default {
    namaPerusahaan,
    bidangUsaha,
    BADAN_HUKUM,
    KATA_1,
    KATA_2,
    AKHIRAN,
    BIDANG,
};
