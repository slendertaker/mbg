/**
 * Barrel export untuk semua bahan
 */

export { default as nama } from "./nama.js";
export { default as alamat } from "./alamat.js";
export { default as perusahaan } from "./perusahaan.js";
export { default as telepon } from "./telepon.js";
export { default as umum } from "./umum.js";

// Re-export fungsi utama untuk akses langsung
export { namaLengkap, namaDepan, namaBelakang } from "./nama.js";
export { alamatLengkap, kota, provinsi, kodepos, jalan } from "./alamat.js";
export { namaPerusahaan, bidangUsaha } from "./perusahaan.js";
export { nomorHp, nomorHpInternasional, nomorTelepon } from "./telepon.js";
export {
    email,
    uuid,
    lorem,
    kalimat,
    paragraf,
    url,
    warna,
    boolean,
    angka,
    tanggal,
    waktu,
    pilihan,
} from "./umum.js";
