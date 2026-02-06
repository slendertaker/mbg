/**
 * Anggaran - Resource usage metrics tracker
 * Satirical feature: anggaran selalu melebihi estimasi
 */

import { PESAN, format } from "./pesan.js";

/**
 * Pilih angka acak dalam range
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function acak(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Format angka ke format Rupiah
 * @param {number} angka
 * @returns {string}
 */
function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

/**
 * Class Anggaran untuk tracking resource usage
 */
export class Anggaran {
    constructor() {
        this.mulai = null;
        this.selesai = null;
        this.porsi = 0;
    }

    /**
     * Mulai tracking
     * @param {number} porsi
     */
    start(porsi) {
        this.mulai = Date.now();
        this.porsi = porsi;
    }

    /**
     * Selesai tracking
     */
    stop() {
        this.selesai = Date.now();
    }

    /**
     * Hitung waktu proses
     * @returns {number} Waktu dalam ms
     */
    getWaktuMs() {
        if (!this.mulai || !this.selesai) return 0;
        return this.selesai - this.mulai;
    }

    /**
     * Hitung waktu proses dalam detik
     * @returns {string}
     */
    getWaktuDetik() {
        const ms = this.getWaktuMs();
        return (ms / 1000).toFixed(1);
    }

    /**
     * Hitung anggaran (satirical)
     * Anggaran selalu melebihi estimasi, dengan "biaya koordinasi" terbesar
     * @returns {object}
     */
    hitung() {
        const porsi = this.porsi;

        // Komponen biaya per porsi (dalam Rupiah)
        const pengolahan = porsi * acak(18000, 28000);
        const distribusi = porsi * acak(7000, 12000);
        const koordinasi = porsi * acak(30000, 45000); // Selalu komponen terbesar
        const overhead = porsi * acak(12000, 20000);

        const total = pengolahan + distribusi + koordinasi + overhead;

        // Estimasi awal yang selalu lebih rendah
        const estimasiPerPorsi = 40000;
        const estimasiAwal = porsi * estimasiPerPorsi;

        // Deviasi minimal 15%, bisa sampai 150%
        const deviasiReal = ((total - estimasiAwal) / estimasiAwal) * 100;
        const deviasi = Math.max(deviasiReal, 15);

        return {
            rincian: {
                pengolahan,
                distribusi,
                koordinasi,
                overhead,
            },
            total,
            estimasiAwal,
            deviasi: Number(deviasi.toFixed(2)),
            wajar: true, // Selalu wajar, itu satirnya
        };
    }

    /**
     * Generate batch ID
     * Format: MBG-YYYYMMDD-XXX
     * @returns {string}
     */
    generateBatchId() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const seq = String(acak(1, 999)).padStart(3, "0");
        return `MBG-${year}${month}${day}-${seq}`;
    }

    /**
     * Generate laporan anggaran dalam format teks
     * @returns {string}
     */
    getLaporanTeks() {
        const data = this.hitung();
        const lines = [];

        lines.push("Rincian Anggaran:");
        lines.push(
            `  Pengolahan data       ${formatRupiah(data.rincian.pengolahan).padStart(20)}`,
        );
        lines.push(
            `  Distribusi            ${formatRupiah(data.rincian.distribusi).padStart(20)}`,
        );
        lines.push(
            `  Biaya koordinasi      ${formatRupiah(data.rincian.koordinasi).padStart(20)}`,
        );
        lines.push(
            `  Overhead operasional  ${formatRupiah(data.rincian.overhead).padStart(20)}`,
        );
        lines.push("  " + "─".repeat(38));
        lines.push(
            `  Total                 ${formatRupiah(data.total).padStart(20)}`,
        );
        lines.push(
            `  Anggaran awal         ${formatRupiah(data.estimasiAwal).padStart(20)}`,
        );
        lines.push(
            `  Deviasi               ${("+" + data.deviasi.toFixed(2) + "%").padStart(20)}`,
        );

        return lines.join("\n");
    }

    /**
     * Generate catatan audit
     * @returns {string[]}
     */
    getCatatanAudit() {
        const data = this.hitung();
        const catatan = [];

        // Koordinasi melebihi pengolahan? Catat.
        if (data.rincian.koordinasi > data.rincian.pengolahan) {
            catatan.push(PESAN.AUDIT_KOORDINASI);
        }

        // Deviasi? Catat, tapi tetap wajar.
        if (data.deviasi > 0) {
            catatan.push(
                format(PESAN.AUDIT_CATATAN_DEVIASI, {
                    persen: data.deviasi.toFixed(2),
                }),
            );
        }

        return catatan;
    }
}

export default Anggaran;
