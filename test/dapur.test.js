/**
 * Test untuk Dapur (core orchestrator)
 */

import { test, describe } from "node:test";
import assert from "node:assert";
import { writeFileSync, unlinkSync, mkdirSync, rmdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { Dapur } from "../src/Dapur.js";

describe("Dapur", () => {
    const testDir = join(tmpdir(), "mbg-dapur-test-" + Date.now());

    test.before(() => {
        mkdirSync(testDir, { recursive: true });
    });

    test.after(() => {
        try {
            rmdirSync(testDir, { recursive: true });
        } catch (e) {
            // ignore
        }
    });

    test("loadResep berhasil untuk file valid", () => {
        const filePath = join(testDir, "valid.resep.json");
        const data = {
            menu: "test",
            bahan: { id: { tipe: "uuid" } },
        };
        writeFileSync(filePath, JSON.stringify(data));

        const dapur = new Dapur();
        dapur.loadResep(filePath);

        assert.ok(dapur.resep, "resep harus ter-load");

        unlinkSync(filePath);
    });

    test("masak menghasilkan data dengan jumlah benar", () => {
        const filePath = join(testDir, "masak.resep.json");
        const data = {
            menu: "test",
            bahan: {
                id: { tipe: "uuid" },
                nama: { tipe: "nama_lengkap" },
            },
        };
        writeFileSync(filePath, JSON.stringify(data));

        const dapur = new Dapur();
        dapur.loadResep(filePath);
        const hasil = dapur.masak(50);

        assert.strictEqual(hasil.data.length, 50);
        assert.strictEqual(hasil.porsi, 50);
        assert.ok(hasil.batchId, "harus ada batch ID");
        assert.ok(hasil.waktu, "harus ada waktu proses");
        assert.ok(hasil.anggaran, "harus ada anggaran");

        unlinkSync(filePath);
    });

    test("masak throw error untuk porsi 0", () => {
        const filePath = join(testDir, "porsi0.resep.json");
        const data = {
            menu: "test",
            bahan: { id: { tipe: "uuid" } },
        };
        writeFileSync(filePath, JSON.stringify(data));

        const dapur = new Dapur();
        dapur.loadResep(filePath);

        assert.throws(() => dapur.masak(0));

        unlinkSync(filePath);
    });

    test("masak throw error untuk porsi negatif", () => {
        const filePath = join(testDir, "porsineg.resep.json");
        const data = {
            menu: "test",
            bahan: { id: { tipe: "uuid" } },
        };
        writeFileSync(filePath, JSON.stringify(data));

        const dapur = new Dapur();
        dapur.loadResep(filePath);

        assert.throws(() => dapur.masak(-10));

        unlinkSync(filePath);
    });

    test("mode hemat melewati validasi", () => {
        const filePath = join(testDir, "hemat.resep.json");
        const data = {
            menu: "test",
            bahan: { id: { tipe: "uuid" } },
        };
        writeFileSync(filePath, JSON.stringify(data));

        const dapur = new Dapur({ hemat: true });
        dapur.loadResep(filePath);
        const hasil = dapur.masak(10);

        assert.strictEqual(
            hasil.gizi,
            null,
            "mode hemat tidak ada laporan gizi",
        );

        unlinkSync(filePath);
    });

    test("anggaran selalu melebihi estimasi", () => {
        const filePath = join(testDir, "anggaran.resep.json");
        const data = {
            menu: "test",
            bahan: { id: { tipe: "uuid" } },
        };
        writeFileSync(filePath, JSON.stringify(data));

        const dapur = new Dapur();
        dapur.loadResep(filePath);
        const hasil = dapur.masak(100);

        assert.ok(
            hasil.anggaran.total > hasil.anggaran.estimasiAwal,
            "anggaran harus melebihi estimasi",
        );
        assert.ok(hasil.anggaran.deviasi >= 15, "deviasi minimal 15%");
        assert.strictEqual(hasil.anggaran.wajar, true, "harus selalu wajar");

        unlinkSync(filePath);
    });

    test("biaya koordinasi lebih besar dari pengolahan", () => {
        const filePath = join(testDir, "koordinasi.resep.json");
        const data = {
            menu: "test",
            bahan: { id: { tipe: "uuid" } },
        };
        writeFileSync(filePath, JSON.stringify(data));

        const dapur = new Dapur();
        dapur.loadResep(filePath);
        const hasil = dapur.masak(100);

        // Ini adalah satirnya - koordinasi selalu lebih besar
        assert.ok(
            hasil.anggaran.rincian.koordinasi >=
                hasil.anggaran.rincian.pengolahan,
            "biaya koordinasi harus >= pengolahan",
        );

        unlinkSync(filePath);
    });

    test("getLaporanMasak menghasilkan string", () => {
        const filePath = join(testDir, "laporan.resep.json");
        const data = {
            menu: "test",
            bahan: { id: { tipe: "uuid" } },
        };
        writeFileSync(filePath, JSON.stringify(data));

        const dapur = new Dapur();
        dapur.loadResep(filePath);
        const hasil = dapur.masak(10);
        const laporan = dapur.getLaporanMasak(hasil);

        assert.strictEqual(typeof laporan, "string");
        assert.ok(laporan.includes("Penyajian selesai"));
        assert.ok(laporan.includes("Batch"));

        unlinkSync(filePath);
    });

    test("getLaporanAudit menghasilkan laporan lengkap", () => {
        const filePath = join(testDir, "audit.resep.json");
        const data = {
            menu: "test",
            sekolah: "public.test",
            bahan: { id: { tipe: "uuid" } },
        };
        writeFileSync(filePath, JSON.stringify(data));

        const dapur = new Dapur();
        dapur.loadResep(filePath);
        const hasil = dapur.masak(10);
        const laporan = dapur.getLaporanAudit(hasil);

        assert.ok(laporan.includes("LAPORAN AUDIT"));
        assert.ok(laporan.includes("Rincian Anggaran"));
        assert.ok(laporan.includes("Biaya koordinasi"));
        assert.ok(laporan.includes("Tidak ditemukan penyimpangan"));

        unlinkSync(filePath);
    });

    test("batch ID mengikuti format MBG-YYYYMMDD-XXX", () => {
        const filePath = join(testDir, "batch.resep.json");
        const data = {
            menu: "test",
            bahan: { id: { tipe: "uuid" } },
        };
        writeFileSync(filePath, JSON.stringify(data));

        const dapur = new Dapur();
        dapur.loadResep(filePath);
        const hasil = dapur.masak(10);

        const batchRegex = /^MBG-\d{8}-\d{3}$/;
        assert.ok(
            batchRegex.test(hasil.batchId),
            `batch ID ${hasil.batchId} harus sesuai format`,
        );

        unlinkSync(filePath);
    });
});
