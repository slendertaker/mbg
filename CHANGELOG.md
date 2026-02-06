# Changelog

Semua perubahan penting pada proyek ini didokumentasikan di file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/id-ID/1.0.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/lang/id/).

## [1.0.0] - 2025-02-07

### Ditambahkan

- CLI entrypoint dengan parsing argumen manual (zero dependencies)
- Perintah `masak` untuk generate data ke file (JSON, CSV, SQL)
- Perintah `menu` untuk menampilkan daftar resep tersedia
- Perintah `gizi` untuk validasi file resep
- Perintah `version` untuk menampilkan versi
- Parser resep `.resep.json`
- Generator data Indonesia:
  - Nama lengkap (Jawa, Batak, Sunda, Minang, dll.)
  - Alamat lengkap dengan RT/RW, kota, provinsi, kode pos
  - Nomor telepon dengan prefix operator Indonesia
  - Nama perusahaan (PT, CV, UD)
  - Email
- Tipe bahan: uuid, increment, angka, nama_lengkap, nama_depan, nama_belakang, email, telepon, alamat, kota, provinsi, kodepos, pilihan, boolean, tanggal, waktu, paragraf, kalimat, url, warna, perusahaan
- Output adapters: JSON, CSV, SQL dump
- Validasi resep dan data (Gizi)
- Tracking anggaran dengan laporan satiris
- Resep bawaan: users, products, orders, companies
- Programmatic API
- Test suite dengan node:test

### Catatan Teknis

- Zero external dependencies
- ESM modules
- Node.js >= 18.0.0
