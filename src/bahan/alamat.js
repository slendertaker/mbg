/**
 * Data alamat Indonesia
 */

const JALAN = [
    "Jl. Sudirman",
    "Jl. Thamrin",
    "Jl. Gatot Subroto",
    "Jl. Ahmad Yani",
    "Jl. Diponegoro",
    "Jl. Imam Bonjol",
    "Jl. Veteran",
    "Jl. Merdeka",
    "Jl. Pahlawan",
    "Jl. Kartini",
    "Jl. Hayam Wuruk",
    "Jl. Gajah Mada",
    "Jl. Pemuda",
    "Jl. Asia Afrika",
    "Jl. Cendana",
    "Jl. Melati",
    "Jl. Mawar",
    "Jl. Kenanga",
    "Jl. Raya Bogor",
    "Jl. Margonda",
    "Jl. Kebon Jeruk",
    "Jl. Panglima Polim",
    "Jl. Fatmawati",
    "Jl. Tendean",
    "Jl. Casablanca",
    "Jl. Rasuna Said",
    "Jl. Kuningan",
    "Jl. Senopati",
    "Jl. Kemang",
    "Jl. Ampera",
    "Jl. Antasari",
    "Jl. Pramuka",
    "Jl. Salemba",
    "Jl. Kramat",
    "Jl. Cikini",
    "Jl. Menteng",
    "Jl. Tebet",
    "Jl. Kalibata",
    "Jl. Dewi Sartika",
    "Jl. Otto Iskandardinata",
];

const KOTA = [
    {
        nama: "Jakarta Pusat",
        provinsi: "DKI Jakarta",
        kodepos: ["10110", "10120", "10130", "10140", "10150"],
    },
    {
        nama: "Jakarta Selatan",
        provinsi: "DKI Jakarta",
        kodepos: ["12110", "12120", "12130", "12140", "12150"],
    },
    {
        nama: "Jakarta Barat",
        provinsi: "DKI Jakarta",
        kodepos: ["11110", "11120", "11130", "11140", "11150"],
    },
    {
        nama: "Jakarta Timur",
        provinsi: "DKI Jakarta",
        kodepos: ["13110", "13120", "13130", "13140", "13150"],
    },
    {
        nama: "Jakarta Utara",
        provinsi: "DKI Jakarta",
        kodepos: ["14110", "14120", "14130", "14140", "14150"],
    },
    {
        nama: "Bandung",
        provinsi: "Jawa Barat",
        kodepos: ["40111", "40112", "40113", "40114", "40115"],
    },
    {
        nama: "Surabaya",
        provinsi: "Jawa Timur",
        kodepos: ["60111", "60112", "60113", "60114", "60115"],
    },
    {
        nama: "Medan",
        provinsi: "Sumatera Utara",
        kodepos: ["20111", "20112", "20113", "20114", "20115"],
    },
    {
        nama: "Depok",
        provinsi: "Jawa Barat",
        kodepos: ["16411", "16412", "16413", "16414", "16415"],
    },
    {
        nama: "Semarang",
        provinsi: "Jawa Tengah",
        kodepos: ["50111", "50112", "50113", "50114", "50115"],
    },
    {
        nama: "Makassar",
        provinsi: "Sulawesi Selatan",
        kodepos: ["90111", "90112", "90113", "90114"],
    },
    {
        nama: "Yogyakarta",
        provinsi: "DI Yogyakarta",
        kodepos: ["55111", "55112", "55113", "55114"],
    },
    {
        nama: "Tangerang",
        provinsi: "Banten",
        kodepos: ["15111", "15112", "15113", "15114", "15115"],
    },
    {
        nama: "Tangerang Selatan",
        provinsi: "Banten",
        kodepos: ["15310", "15311", "15312", "15313"],
    },
    {
        nama: "Bekasi",
        provinsi: "Jawa Barat",
        kodepos: ["17111", "17112", "17113", "17114", "17115"],
    },
    {
        nama: "Malang",
        provinsi: "Jawa Timur",
        kodepos: ["65111", "65112", "65113", "65114"],
    },
    {
        nama: "Bogor",
        provinsi: "Jawa Barat",
        kodepos: ["16111", "16112", "16113", "16114"],
    },
    {
        nama: "Palembang",
        provinsi: "Sumatera Selatan",
        kodepos: ["30111", "30112", "30113", "30114"],
    },
    {
        nama: "Denpasar",
        provinsi: "Bali",
        kodepos: ["80111", "80112", "80113", "80114"],
    },
    {
        nama: "Balikpapan",
        provinsi: "Kalimantan Timur",
        kodepos: ["76111", "76112", "76113"],
    },
    {
        nama: "Banjarmasin",
        provinsi: "Kalimantan Selatan",
        kodepos: ["70111", "70112", "70113"],
    },
    {
        nama: "Pontianak",
        provinsi: "Kalimantan Barat",
        kodepos: ["78111", "78112", "78113"],
    },
    {
        nama: "Manado",
        provinsi: "Sulawesi Utara",
        kodepos: ["95111", "95112", "95113"],
    },
    {
        nama: "Padang",
        provinsi: "Sumatera Barat",
        kodepos: ["25111", "25112", "25113"],
    },
    {
        nama: "Pekanbaru",
        provinsi: "Riau",
        kodepos: ["28111", "28112", "28113"],
    },
    {
        nama: "Batam",
        provinsi: "Kepulauan Riau",
        kodepos: ["29432", "29433", "29434"],
    },
    {
        nama: "Solo",
        provinsi: "Jawa Tengah",
        kodepos: ["57111", "57112", "57113"],
    },
    {
        nama: "Cirebon",
        provinsi: "Jawa Barat",
        kodepos: ["45111", "45112", "45113"],
    },
];

const PROVINSI = [
    "Aceh",
    "Sumatera Utara",
    "Sumatera Barat",
    "Riau",
    "Jambi",
    "Sumatera Selatan",
    "Bengkulu",
    "Lampung",
    "Kepulauan Bangka Belitung",
    "Kepulauan Riau",
    "DKI Jakarta",
    "Jawa Barat",
    "Jawa Tengah",
    "DI Yogyakarta",
    "Jawa Timur",
    "Banten",
    "Bali",
    "Nusa Tenggara Barat",
    "Nusa Tenggara Timur",
    "Kalimantan Barat",
    "Kalimantan Tengah",
    "Kalimantan Selatan",
    "Kalimantan Timur",
    "Kalimantan Utara",
    "Sulawesi Utara",
    "Sulawesi Tengah",
    "Sulawesi Selatan",
    "Sulawesi Tenggara",
    "Gorontalo",
    "Sulawesi Barat",
    "Maluku",
    "Maluku Utara",
    "Papua Barat",
    "Papua",
    "Papua Selatan",
    "Papua Tengah",
    "Papua Pegunungan",
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
 * Pad angka dengan leading zero
 * @param {number} num
 * @param {number} length
 * @returns {string}
 */
function padZero(num, length) {
    return String(num).padStart(length, "0");
}

/**
 * Generate nama jalan dengan nomor
 * @returns {string}
 */
export function jalan() {
    const namaJalan = pilihAcak(JALAN);
    const nomor = angkaAcak(1, 200);
    return `${namaJalan} No. ${nomor}`;
}

/**
 * Generate RT/RW
 * @returns {string}
 */
export function rtRw() {
    const rt = padZero(angkaAcak(1, 20), 3);
    const rw = padZero(angkaAcak(1, 15), 3);
    return `RT ${rt}/RW ${rw}`;
}

/**
 * Generate data kota (dengan provinsi dan kodepos)
 * @returns {{nama: string, provinsi: string, kodepos: string}}
 */
export function kotaLengkap() {
    const data = pilihAcak(KOTA);
    return {
        nama: data.nama,
        provinsi: data.provinsi,
        kodepos: pilihAcak(data.kodepos),
    };
}

/**
 * Generate nama kota saja
 * @returns {string}
 */
export function kota() {
    return pilihAcak(KOTA).nama;
}

/**
 * Generate provinsi
 * @returns {string}
 */
export function provinsi() {
    return pilihAcak(PROVINSI);
}

/**
 * Generate kode pos
 * @returns {string}
 */
export function kodepos() {
    const data = pilihAcak(KOTA);
    return pilihAcak(data.kodepos);
}

/**
 * Generate alamat lengkap
 * Format: "Jl. Sudirman No. 45, RT 003/RW 012, Jakarta Pusat 10110"
 * @returns {string}
 */
export function alamatLengkap() {
    const dataKota = kotaLengkap();
    return `${jalan()}, ${rtRw()}, ${dataKota.nama} ${dataKota.kodepos}`;
}

export default {
    jalan,
    rtRw,
    kota,
    kotaLengkap,
    provinsi,
    kodepos,
    alamatLengkap,
    JALAN,
    KOTA,
    PROVINSI,
};
