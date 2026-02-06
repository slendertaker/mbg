/**
 * Semua pesan user-facing dikumpulkan di sini.
 * Tone: formal, birokratis, helpful — tapi ambigu.
 */

export const PESAN = {
    // ─── Startup ─────────────────────────────────────────────
    BANNER: "MBG v{version} — Database Seeder\nMenyajikan Data Berkualitas — Gratis, Massal, dan Bergizi.",

    // ─── Sukses ──────────────────────────────────────────────
    SAJI_SELESAI: "Penyajian selesai.",
    MASAK_SELESAI: "Data berhasil diolah dan disimpan ke {output}.",
    RECALL_SELESAI: "Data batch {batch} berhasil ditarik dari peredaran.",
    GIZI_LULUS:
        "Resep memenuhi standar gizi. Semua field terdefinisi dengan baik.",
    BATCH_TERCATAT:
        "Batch {batch} tercatat. Bukti penyajian tersimpan untuk keperluan audit.",

    // ─── Error: Koneksi ──────────────────────────────────────
    CATERING_TIMEOUT: "Tidak ada respons dari vendor setelah {detik} detik.",
    CATERING_AUTH:
        "Akses ke vendor ditolak. Periksa kredensial yang diberikan.",
    CATERING_UNREACHABLE:
        "Vendor tidak dapat dihubungi. Pastikan layanan catering tersedia.",
    CATERING_UNKNOWN:
        'Vendor "{vendor}" tidak dikenali. Gunakan: postgres, mysql, supabase, mongodb, json, csv, sql.',

    // ─── Error: Resep ────────────────────────────────────────
    RESEP_NOT_FOUND: 'File resep "{file}" tidak ditemukan.',
    RESEP_INVALID_JSON:
        "Format resep tidak valid. Pastikan file sesuai standar .resep.json.",
    RESEP_NO_BAHAN:
        'Resep tidak memiliki field "bahan". Tidak ada yang bisa diolah.',
    RESEP_TIPE_UNKNOWN: 'Tipe bahan "{tipe}" tidak tersedia di gudang.',

    // ─── Error: Input ────────────────────────────────────────
    PORSI_INVALID: "Jumlah porsi harus bilangan positif.",
    PORSI_TERLALU_BESAR:
        "Porsi {porsi} melebihi kapasitas dapur. Maksimum: {max} per batch.",
    OUTPUT_EXISTS: "File {file} sudah ada. Gunakan --timpa untuk menimpa.",

    // ─── Error: Command ──────────────────────────────────────
    COMMAND_UNKNOWN: 'Perintah "{command}" tidak dikenali.',
    RESEP_REQUIRED:
        "File resep diperlukan. Gunakan: mbg {command} -r <file.resep.json>",

    // ─── Warning ─────────────────────────────────────────────
    GIZI_STUNTING:
        "Ditemukan {jumlah} field dengan potensi data kosong (stunting). Periksa resep Anda.",
    HEMAT_AKTIF:
        "Mode hemat aktif. Validasi dilewati untuk efisiensi anggaran.",
    DEVIASI_ANGGARAN:
        "Realisasi anggaran melebihi estimasi awal sebesar {persen}%. Masih dalam batas wajar.",

    // ─── Audit ───────────────────────────────────────────────
    AUDIT_HEADER: "LAPORAN AUDIT — Batch {batch}",
    AUDIT_KESIMPULAN: "Kesimpulan: Tidak ditemukan penyimpangan.",
    AUDIT_CATATAN_DEVIASI:
        "Deviasi anggaran {persen}% tercatat dalam laporan. Dalam batas wajar.",
    AUDIT_CATATAN_STUNTING:
        "{jumlah} porsi mengandung field kosong (stunting data).",
    AUDIT_KOORDINASI: "Biaya koordinasi melebihi komponen pengolahan.",

    // ─── Recall ──────────────────────────────────────────────
    RECALL_BATCH_NOT_FOUND:
        "Batch {batch} tidak ditemukan dalam catatan distribusi.",
    RECALL_CONFIRM:
        "Anda akan menarik {jumlah} records dari {tujuan}. Lanjutkan? (y/n)",

    // ─── Info ────────────────────────────────────────────────
    MENU_HEADER: "Menu tersedia:",
    MENU_EMPTY: "Belum ada resep. Jalankan: mbg tulis-resep",
    BANTUAN_FOOTER: "Dokumentasi lengkap: https://github.com/user/mbg",

    // ─── Misc ────────────────────────────────────────────────
    KERING: "Mode kering aktif. Tidak ada data yang disajikan ke tujuan.",
    PROSES_BAHAN: "Mempersiapkan bahan",
    PROSES_OLAH: "Mengolah data",
    PROSES_SAJI: "Menyajikan ke {tujuan}",
    PROSES_TULIS: "Menulis ke {output}",

    // ─── Help ────────────────────────────────────────────────
    HELP: `MBG — Database Seeder CLI
Menyajikan Data Berkualitas — Gratis, Massal, dan Bergizi.

Penggunaan:
  mbg <perintah> [opsi]

Perintah:
  masak     Olah resep dan hasilkan data ke file
  menu      Tampilkan daftar resep tersedia
  gizi      Validasi file resep
  version   Tampilkan versi dapur

Opsi:
  -r, --resep <file>       File resep (.resep.json)
  -p, --porsi <jumlah>     Jumlah records (default: 100)
  -o, --output <file>      File output
  --format <json|csv|sql>  Format output (default: json)
  --hemat                  Lewati validasi
  --kering                 Dry run
  --timpa                  Timpa file yang sudah ada
  --help                   Tampilkan bantuan ini

Contoh:
  mbg masak -r users.resep.json -p 1000 -o users.json
  mbg menu
  mbg gizi -r users.resep.json`,

    // ─── Easter Eggs ─────────────────────────────────────────
    PORSI_NOL: "Porsi 0 tidak tersedia dalam program ini.",
    JUMAT_SORE: "Selamat akhir pekan. Jangan deploy di Jumat sore.",
};

/**
 * Format pesan dengan placeholder
 * @param {string} template - Template pesan dengan {placeholder}
 * @param {Record<string, string|number>} values - Nilai untuk placeholder
 * @returns {string}
 */
export function format(template, values = {}) {
    return template.replace(/\{(\w+)\}/g, (_, key) => {
        return values[key] !== undefined ? String(values[key]) : `{${key}}`;
    });
}
