/**
 * Data nama orang Indonesia
 */

const NAMA_DEPAN = [
    "Ahmad",
    "Budi",
    "Cahya",
    "Dewi",
    "Eko",
    "Fajar",
    "Galih",
    "Hendra",
    "Indah",
    "Joko",
    "Kartika",
    "Lina",
    "Muhammad",
    "Nita",
    "Omar",
    "Putri",
    "Rizky",
    "Siti",
    "Taufik",
    "Umi",
    "Vina",
    "Wati",
    "Yudi",
    "Zahra",
    "Agus",
    "Bambang",
    "Dian",
    "Fitri",
    "Gunawan",
    "Hesti",
    "Irfan",
    "Juli",
    "Kurniawan",
    "Lestari",
    "Mega",
    "Nurul",
    "Oki",
    "Pramudya",
    "Ratna",
    "Sri",
    "Tri",
    "Udin",
    "Wahyu",
    "Yanto",
    "Andi",
    "Bayu",
    "Citra",
    "Doni",
    "Erna",
    "Fauzi",
    "Gita",
    "Hadi",
    "Intan",
    "Jaya",
    "Kiki",
    "Lukman",
    "Maya",
    "Nando",
    "Oki",
    "Putu",
    "Qori",
    "Rani",
    "Surya",
    "Tina",
    "Ujang",
    "Vera",
    "Wawan",
    "Xena",
    "Yuli",
    "Zaki",
    "Adit",
    "Bima",
    "Candra",
    "Dedi",
    "Ela",
    "Ferdi",
    "Gilang",
    "Hana",
    "Ivan",
    "Jeni",
];

const NAMA_BELAKANG = [
    // Umum
    "Pratama",
    "Saputra",
    "Wijaya",
    "Kusuma",
    "Hidayat",
    "Ramadhan",
    "Putra",
    "Sari",
    "Wulandari",
    "Permana",
    "Nugraha",
    "Utami",
    "Setiawan",
    "Rahayu",
    "Susanto",
    "Handoko",
    "Santoso",
    "Prasetyo",
    "Yulianto",
    "Firmansyah",
    // Batak
    "Siregar",
    "Nasution",
    "Harahap",
    "Siagian",
    "Simanjuntak",
    "Pardede",
    "Manurung",
    "Hutabarat",
    "Panjaitan",
    "Sihombing",
    "Situmorang",
    "Sinaga",
    "Napitupulu",
    "Simatupang",
    "Tampubolon",
    "Silalahi",
    "Simbolon",
    // Jawa
    "Suryono",
    "Widodo",
    "Hartono",
    "Prabowo",
    "Sulistyo",
    "Wibowo",
    "Sudirman",
    "Sugiarto",
    "Sutrisno",
    "Suharto",
    "Supriyadi",
    "Wahyudi",
    // Sunda
    "Hermawan",
    "Kurniawan",
    "Suherman",
    "Gunawan",
    "Suryadi",
    "Mulyana",
    "Sopyan",
    "Saefudin",
    "Suparman",
    "Suryana",
    // Minang
    "Lubis",
    "Daulay",
    "Batubara",
    "Rangkuti",
    "Tanjung",
    "Hasibuan",
    // Lainnya
    "Dharma",
    "Putra",
    "Atmaja",
    "Negara",
    "Mahendra",
    "Adinata",
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
 * Generate nama depan
 * @returns {string}
 */
export function namaDepan() {
    return pilihAcak(NAMA_DEPAN);
}

/**
 * Generate nama belakang
 * @returns {string}
 */
export function namaBelakang() {
    return pilihAcak(NAMA_BELAKANG);
}

/**
 * Generate nama lengkap
 * @returns {string}
 */
export function namaLengkap() {
    return `${namaDepan()} ${namaBelakang()}`;
}

export default {
    namaDepan,
    namaBelakang,
    namaLengkap,
    NAMA_DEPAN,
    NAMA_BELAKANG,
};
