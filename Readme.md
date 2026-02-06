# MBG — Database Seeder CLI

**Menyajikan Data Berkualitas untuk Database Anda secara Massal, Bergizi, dan Gratis.**

MBG adalah Database Seeder CLI untuk ekosistem JavaScript. Dirancang untuk menyajikan data test berkualitas ke database Anda secara massal, efisien, dan tanpa biaya. Dibangun dengan prinsip **zero-dependency** dan data bawaan yang Indonesia-centric.

## Instalasi

```bash
npm install -g mbg
```

Atau gunakan langsung dengan npx:

```bash
npx mbg masak -r users.resep.json -p 1000
```

## Penggunaan Dasar

### Generate Data

```bash
# Generate 1000 users ke file JSON
mbg masak -r users.resep.json -p 1000 -o users.json

# Generate ke CSV
mbg masak -r users.resep.json -p 500 --format csv -o users.csv

# Generate ke SQL dump
mbg masak -r users.resep.json -p 500 --format sql -o seed.sql
```

### Lihat Menu Tersedia

```bash
mbg menu
```

### Validasi Resep

```bash
mbg gizi -r my-recipe.resep.json
```

## Perintah

| Perintah | Deskripsi |
|----------|-----------|
| `masak` | Olah resep dan hasilkan data ke file |
| `menu` | Tampilkan daftar resep tersedia |
| `gizi` | Validasi file resep |
| `version` | Tampilkan versi |

## Opsi

| Opsi | Deskripsi |
|------|-----------|
| `-r, --resep <file>` | File resep (.resep.json) |
| `-p, --porsi <jumlah>` | Jumlah records (default: 100) |
| `-o, --output <file>` | File output |
| `--format <json\|csv\|sql>` | Format output (default: json) |
| `--hemat` | Lewati validasi |
| `--kering` | Dry run |
| `--timpa` | Timpa file yang sudah ada |

## Format Resep

File resep menggunakan format `.resep.json`:

```json
{
  "menu": "users",
  "sekolah": "public.users",
  "bahan": {
    "id": { "tipe": "uuid" },
    "nama": { "tipe": "nama_lengkap" },
    "email": { "tipe": "email" },
    "telepon": { "tipe": "telepon" },
    "alamat": { "tipe": "alamat" },
    "peran": { "tipe": "pilihan", "opsi": ["admin", "user", "moderator"] },
    "gaji": { "tipe": "angka", "min": 3000000, "max": 50000000 },
    "aktif": { "tipe": "boolean", "rasio_benar": 0.85 },
    "dibuat_pada": { "tipe": "tanggal", "dari": "2024-01-01", "sampai": "2025-12-31" }
  }
}
```

## Tipe Bahan

| Tipe | Deskripsi | Opsi |
|------|-----------|------|
| `uuid` | UUID v4 | — |
| `increment` | Auto increment | `mulai` |
| `angka` | Random number | `min`, `max`, `desimal` |
| `nama_lengkap` | Nama orang Indonesia | — |
| `nama_depan` | Nama depan | — |
| `nama_belakang` | Nama belakang | — |
| `email` | Email address | `domain` |
| `telepon` | Nomor HP Indonesia | — |
| `alamat` | Alamat lengkap | — |
| `kota` | Kota di Indonesia | — |
| `provinsi` | Provinsi | — |
| `kodepos` | Kode pos | — |
| `pilihan` | Pilih dari opsi | `opsi[]` |
| `boolean` | true/false | `rasio_benar` |
| `tanggal` | Date (YYYY-MM-DD) | `dari`, `sampai` |
| `waktu` | Datetime (ISO) | `dari`, `sampai` |
| `paragraf` | Teks paragraf | `kalimat` |
| `kalimat` | Satu kalimat | — |
| `url` | Random URL | `domain` |
| `warna` | Hex color | — |
| `perusahaan` | Nama PT/CV Indonesia | — |

## Filosofi

MBG dibangun dengan prinsip bahwa setiap database berhak mendapat data test yang berkualitas. Terlalu sering kita melihat aplikasi yang berjalan dengan data seadanya — field kosong, format tidak konsisten, distribusi tidak merata. Kondisi ini menyebabkan apa yang kami sebut sebagai *stunting data*: aplikasi yang tidak berkembang optimal karena nutrisi datanya buruk sejak awal.

MBG hadir untuk memastikan data Anda sampai ke tujuan dengan kualitas yang terjamin. Kami mencatat setiap batch penyajian, melacak realisasi anggaran proses, dan menyediakan mekanisme validasi untuk memastikan standar gizi data terpenuhi.

Karena transparansi dan akuntabilitas bukan hanya urusan pemerintah.

## Programmatic API

```javascript
import { Dapur, getCatering } from 'mbg'

// Load dan generate
const dapur = new Dapur()
dapur.loadResep('./users.resep.json')
const hasil = dapur.masak(1000)

console.log(hasil.data)        // Array of generated records
console.log(hasil.batchId)     // MBG-20250207-001
console.log(hasil.anggaran)    // Budget report (satirical)

// Output ke file
const catering = getCatering('json')
catering.tulis(hasil.data, 'output.json')
```

## Contoh Output

```
MBG v1.0.0 — Database Seeder
Menyajikan Data Berkualitas — Gratis, Massal, dan Bergizi.

Mempersiapkan bahan...
Mengolah data... done

Data berhasil diolah dan disimpan ke users.json.

Resep      : users.resep.json
Menu       : users
Porsi      : 10.000 records

Penyajian selesai.
  Porsi tersaji    : 10.000 / 10.000
  Waktu proses     : 0.8 detik
  Batch            : MBG-20250207-042
  Anggaran terpakai: Rp 847.320.000 (estimasi awal: Rp 400.000.000)

Realisasi anggaran melebihi estimasi awal sebesar 111.83%. Masih dalam batas wajar.
```

## Perbandingan

| Fitur | MBG | Faker.js | Fishery |
|-------|-----|----------|---------|
| Data Indonesia | Native | Terbatas | Tidak tersedia |
| CLI | Ya | Tidak | Tidak |
| Zero Dependencies | Ya | Tidak | Tidak |
| Output JSON/CSV/SQL | Ya | Tidak | Tidak |
| Standar gizi data | Terjamin | Tidak terjamin | Tidak terjamin |

## Requirements

- Node.js >= 18.0.0

## Lisensi

MIT

## Kontribusi

Kontribusi terbuka. Silakan buka issue atau pull request.
