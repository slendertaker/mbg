/**
 * Dapur - Core engine orchestrator
 * Mengoordinasikan semua komponen: Resep, Koki, Gizi, Anggaran, Catering
 */

import { Resep, ResepError } from "./Resep.js";
import { Koki } from "./Koki.js";
import { Gizi } from "./Gizi.js";
import { Anggaran } from "./Anggaran.js";
import { PESAN, format } from "./pesan.js";

/**
 * Class Dapur - orchestrator utama
 */
export class Dapur {
    constructor(options = {}) {
        this.options = {
            hemat: false,
            kering: false,
            verbose: false,
            ...options,
        };

        this.resep = null;
        this.koki = new Koki();
        this.gizi = new Gizi();
        this.anggaran = new Anggaran();

        this.hasil = null;
        this.batchId = null;
    }

    /**
     * Load resep dari file
     * @param {string} filePath
     * @returns {Dapur}
     */
    loadResep(filePath) {
        this.resep = new Resep(filePath);
        this.resep.load();
        return this;
    }

    /**
     * Validasi resep
     * @returns {{valid: boolean, errors: string[], warnings: string[]}}
     */
    validasiResep() {
        if (!this.resep) {
            throw new Error("Resep belum di-load");
        }
        return this.resep.validasi();
    }

    /**
     * Masak data (generate tanpa output ke target)
     * @param {number} porsi
     * @returns {{data: object[], batchId: string, waktu: string, anggaran: object}}
     */
    masak(porsi) {
        if (!this.resep) {
            throw new Error("Resep belum di-load");
        }

        // Validasi porsi
        if (!Number.isInteger(porsi) || porsi < 0) {
            throw new Error(PESAN.PORSI_INVALID);
        }

        if (porsi === 0) {
            throw new Error(PESAN.PORSI_NOL);
        }

        // Validasi resep (kecuali mode hemat)
        if (!this.options.hemat) {
            const validasi = this.resep.validasi();
            if (!validasi.valid) {
                throw new ResepError(
                    validasi.errors.join("\n"),
                    "RESEP_INVALID",
                );
            }
        }

        // Generate batch ID
        this.batchId = this.anggaran.generateBatchId();

        // Mulai tracking
        this.anggaran.start(porsi);

        // Generate data
        const definisiBahan = this.resep.getBahan();
        this.hasil = this.koki.masak(definisiBahan, porsi);

        // Stop tracking
        this.anggaran.stop();

        // Validasi output (kecuali mode hemat)
        let laporanGizi = null;
        if (!this.options.hemat) {
            const hasilGizi = this.gizi.periksa(this.hasil, definisiBahan);
            laporanGizi = hasilGizi.laporan;
        }

        return {
            data: this.hasil,
            batchId: this.batchId,
            waktu: this.anggaran.getWaktuDetik(),
            anggaran: this.anggaran.hitung(),
            gizi: laporanGizi,
            menu: this.resep.getNamaMenu(),
            sekolah: this.resep.getSekolah(),
            porsi: porsi,
        };
    }

    /**
     * Generate laporan proses
     * @param {object} hasilMasak
     * @returns {string}
     */
    getLaporanMasak(hasilMasak) {
        const lines = [];

        lines.push("");
        lines.push(`Resep      : ${this.resep?.filePath || "unknown"}`);
        lines.push(`Menu       : ${hasilMasak.menu}`);
        lines.push(
            `Porsi      : ${hasilMasak.porsi.toLocaleString("id-ID")} records`,
        );
        lines.push("");
        lines.push("Penyajian selesai.");
        lines.push(
            `  Porsi tersaji    : ${hasilMasak.data.length.toLocaleString("id-ID")} / ${hasilMasak.porsi.toLocaleString("id-ID")}`,
        );
        lines.push(`  Waktu proses     : ${hasilMasak.waktu} detik`);
        lines.push(`  Batch            : ${hasilMasak.batchId}`);

        // Anggaran
        const anggaran = hasilMasak.anggaran;
        const formatRupiah = (n) => "Rp " + n.toLocaleString("id-ID");
        lines.push(
            `  Anggaran terpakai: ${formatRupiah(anggaran.total)} (estimasi awal: ${formatRupiah(anggaran.estimasiAwal)})`,
        );

        // Deviasi warning (tapi tetap wajar)
        if (anggaran.deviasi > 0) {
            lines.push("");
            lines.push(
                format(PESAN.DEVIASI_ANGGARAN, {
                    persen: anggaran.deviasi.toFixed(2),
                }),
            );
        }

        return lines.join("\n");
    }

    /**
     * Generate laporan audit lengkap
     * @param {object} hasilMasak
     * @returns {string}
     */
    getLaporanAudit(hasilMasak) {
        const lines = [];
        const anggaran = hasilMasak.anggaran;
        const gizi = hasilMasak.gizi;
        const now = new Date();

        const formatRupiah = (n) => "Rp " + n.toLocaleString("id-ID");
        const formatTanggal = () => {
            const pad = (n) => String(n).padStart(2, "0");
            return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} WIB`;
        };

        lines.push(format(PESAN.AUDIT_HEADER, { batch: hasilMasak.batchId }));
        lines.push("");
        lines.push(`  Tanggal          : ${formatTanggal()}`);
        lines.push(`  Resep            : ${this.resep?.filePath || "unknown"}`);
        lines.push(`  Tujuan           : ${hasilMasak.sekolah}`);
        lines.push(
            `  Porsi dialokasi  : ${hasilMasak.porsi.toLocaleString("id-ID")}`,
        );
        lines.push(
            `  Porsi tersaji    : ${hasilMasak.data.length.toLocaleString("id-ID")}`,
        );

        if (gizi && gizi.stunting > 0) {
            lines.push(
                `  Porsi bermasalah : ${gizi.stunting} (data tidak lengkap)`,
            );
        }

        lines.push("");
        lines.push("  Rincian Anggaran:");
        lines.push(
            `    Pengolahan data       ${formatRupiah(anggaran.rincian.pengolahan).padStart(20)}`,
        );
        lines.push(
            `    Distribusi            ${formatRupiah(anggaran.rincian.distribusi).padStart(20)}`,
        );
        lines.push(
            `    Biaya koordinasi      ${formatRupiah(anggaran.rincian.koordinasi).padStart(20)}`,
        );
        lines.push(
            `    Overhead operasional  ${formatRupiah(anggaran.rincian.overhead).padStart(20)}`,
        );
        lines.push("    " + "─".repeat(38));
        lines.push(
            `    Total                 ${formatRupiah(anggaran.total).padStart(20)}`,
        );
        lines.push(
            `    Anggaran awal         ${formatRupiah(anggaran.estimasiAwal).padStart(20)}`,
        );
        lines.push(
            `    Deviasi               ${("+" + anggaran.deviasi.toFixed(2) + "%").padStart(20)}`,
        );

        // Catatan
        lines.push("");
        lines.push("  Catatan:");

        if (gizi && gizi.stunting > 0) {
            lines.push(
                `    - ${format(PESAN.AUDIT_CATATAN_STUNTING, { jumlah: gizi.stunting })}`,
            );
        }

        if (anggaran.rincian.koordinasi > anggaran.rincian.pengolahan) {
            lines.push(`    - ${PESAN.AUDIT_KOORDINASI}`);
        }

        lines.push(`    - Deviasi anggaran dalam batas "wajar"`);

        lines.push("");
        lines.push(`  ${PESAN.AUDIT_KESIMPULAN}`);

        return lines.join("\n");
    }
}

export default Dapur;
