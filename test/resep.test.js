/**
 * Test untuk Resep (recipe parser & validator)
 */

import { test, describe } from "node:test";
import assert from "node:assert";
import { writeFileSync, unlinkSync, mkdirSync, rmdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { Resep, ResepError, TIPE_BAHAN } from "../src/Resep.js";

describe("Resep", () => {
    const testDir = join(tmpdir(), "mbg-test-" + Date.now());

    // Setup test directory
    test.before(() => {
        mkdirSync(testDir, { recursive: true });
    });

    // Cleanup
    test.after(() => {
        try {
            rmdirSync(testDir, { recursive: true });
        } catch (e) {
            // ignore
        }
    });

    test("load berhasil untuk file valid", () => {
        const filePath = join(testDir, "valid.resep.json");
        const data = {
            menu: "test",
            sekolah: "public.test",
            bahan: {
                id: { tipe: "uuid" },
            },
        };
        writeFileSync(filePath, JSON.stringify(data));

        const resep = new Resep(filePath);
        resep.load();

        assert.deepStrictEqual(resep.getData(), data);

        unlinkSync(filePath);
    });

    test("load throw error untuk file tidak ada", () => {
        const resep = new Resep("/tidak/ada/file.resep.json");

        assert.throws(() => resep.load(), ResepError);
    });

    test("load throw error untuk JSON invalid", () => {
        const filePath = join(testDir, "invalid.resep.json");
        writeFileSync(filePath, "bukan json {{{");

        const resep = new Resep(filePath);

        assert.throws(() => resep.load(), ResepError);

        unlinkSync(filePath);
    });

    test("validasi gagal jika tidak ada bahan", () => {
        const filePath = join(testDir, "nobahan.resep.json");
        writeFileSync(filePath, JSON.stringify({ menu: "test" }));

        const resep = new Resep(filePath);
        resep.load();
        const hasil = resep.validasi();

        assert.strictEqual(hasil.valid, false);
        assert.ok(hasil.errors.length > 0);

        unlinkSync(filePath);
    });

    test("validasi gagal untuk tipe tidak dikenal", () => {
        const filePath = join(testDir, "unknown.resep.json");
        const data = {
            menu: "test",
            bahan: {
                field: { tipe: "tipe_tidak_ada" },
            },
        };
        writeFileSync(filePath, JSON.stringify(data));

        const resep = new Resep(filePath);
        resep.load();
        const hasil = resep.validasi();

        assert.strictEqual(hasil.valid, false);
        assert.ok(hasil.errors.some((e) => e.includes("tidak tersedia")));

        unlinkSync(filePath);
    });

    test("validasi berhasil untuk resep lengkap", () => {
        const filePath = join(testDir, "complete.resep.json");
        const data = {
            menu: "users",
            sekolah: "public.users",
            bahan: {
                id: { tipe: "uuid" },
                nama: { tipe: "nama_lengkap" },
                email: { tipe: "email" },
                peran: { tipe: "pilihan", opsi: ["admin", "user"] },
            },
        };
        writeFileSync(filePath, JSON.stringify(data));

        const resep = new Resep(filePath);
        resep.load();
        const hasil = resep.validasi();

        assert.strictEqual(hasil.valid, true);
        assert.strictEqual(hasil.errors.length, 0);

        unlinkSync(filePath);
    });

    test("validasi warning untuk potensi stunting", () => {
        const filePath = join(testDir, "stunting.resep.json");
        const data = {
            menu: "test",
            bahan: {
                status: { tipe: "pilihan", opsi: ["aktif", ""] }, // opsi kosong
            },
        };
        writeFileSync(filePath, JSON.stringify(data));

        const resep = new Resep(filePath);
        resep.load();
        const hasil = resep.validasi();

        assert.ok(hasil.warnings.length > 0, "harus ada warning stunting");

        unlinkSync(filePath);
    });

    test("validasi gagal untuk pilihan tanpa opsi", () => {
        const filePath = join(testDir, "no-opsi.resep.json");
        const data = {
            menu: "test",
            bahan: {
                status: { tipe: "pilihan" }, // tidak ada opsi
            },
        };
        writeFileSync(filePath, JSON.stringify(data));

        const resep = new Resep(filePath);
        resep.load();
        const hasil = resep.validasi();

        assert.strictEqual(hasil.valid, false);

        unlinkSync(filePath);
    });

    test("validasi gagal untuk min > max", () => {
        const filePath = join(testDir, "minmax.resep.json");
        const data = {
            menu: "test",
            bahan: {
                nilai: { tipe: "angka", min: 100, max: 10 },
            },
        };
        writeFileSync(filePath, JSON.stringify(data));

        const resep = new Resep(filePath);
        resep.load();
        const hasil = resep.validasi();

        assert.strictEqual(hasil.valid, false);

        unlinkSync(filePath);
    });

    test("getNamaMenu mengembalikan nama menu", () => {
        const filePath = join(testDir, "menu.resep.json");
        const data = {
            menu: "my_menu",
            bahan: { id: { tipe: "uuid" } },
        };
        writeFileSync(filePath, JSON.stringify(data));

        const resep = new Resep(filePath);
        resep.load();

        assert.strictEqual(resep.getNamaMenu(), "my_menu");

        unlinkSync(filePath);
    });

    test("getSekolah mengembalikan target tabel", () => {
        const filePath = join(testDir, "sekolah.resep.json");
        const data = {
            menu: "test",
            sekolah: "schema.table_name",
            bahan: { id: { tipe: "uuid" } },
        };
        writeFileSync(filePath, JSON.stringify(data));

        const resep = new Resep(filePath);
        resep.load();

        assert.strictEqual(resep.getSekolah(), "schema.table_name");

        unlinkSync(filePath);
    });

    test("TIPE_BAHAN berisi semua tipe yang didukung", () => {
        const tipeWajib = [
            "uuid",
            "increment",
            "angka",
            "nama_lengkap",
            "email",
            "telepon",
            "alamat",
            "pilihan",
            "boolean",
            "tanggal",
        ];

        for (const tipe of tipeWajib) {
            assert.ok(
                TIPE_BAHAN.includes(tipe),
                `${tipe} harus ada di TIPE_BAHAN`,
            );
        }
    });
});
