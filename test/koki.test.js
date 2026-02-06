/**
 * Test untuk Koki (data generator)
 */

import { test, describe } from "node:test";
import assert from "node:assert";
import { Koki } from "../src/Koki.js";

describe("Koki", () => {
    test("masakSatu menghasilkan object dengan semua field", () => {
        const koki = new Koki();
        const definisi = {
            id: { tipe: "uuid" },
            nama: { tipe: "nama_lengkap" },
        };

        const hasil = koki.masakSatu(definisi);

        assert.ok(hasil.id, "harus ada field id");
        assert.ok(hasil.nama, "harus ada field nama");
        assert.strictEqual(typeof hasil.id, "string");
        assert.strictEqual(typeof hasil.nama, "string");
    });

    test("masak menghasilkan array dengan jumlah porsi yang benar", () => {
        const koki = new Koki();
        const definisi = {
            id: { tipe: "uuid" },
        };

        const hasil = koki.masak(definisi, 10);

        assert.strictEqual(hasil.length, 10);
    });

    test("tipe uuid menghasilkan format yang valid", () => {
        const koki = new Koki();
        const definisi = { id: { tipe: "uuid" } };

        const hasil = koki.masakSatu(definisi);
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        assert.ok(uuidRegex.test(hasil.id), "uuid harus valid");
    });

    test("tipe increment menghasilkan nilai berurutan", () => {
        const koki = new Koki();
        const definisi = {
            nomor: { tipe: "increment", mulai: 100 },
        };

        const hasil = koki.masak(definisi, 5);

        assert.strictEqual(hasil[0].nomor, 100);
        assert.strictEqual(hasil[1].nomor, 101);
        assert.strictEqual(hasil[2].nomor, 102);
        assert.strictEqual(hasil[3].nomor, 103);
        assert.strictEqual(hasil[4].nomor, 104);
    });

    test("tipe angka menghasilkan nilai dalam range", () => {
        const koki = new Koki();
        const definisi = {
            nilai: { tipe: "angka", min: 10, max: 20 },
        };

        const hasil = koki.masak(definisi, 100);

        for (const record of hasil) {
            assert.ok(record.nilai >= 10, `nilai ${record.nilai} harus >= 10`);
            assert.ok(record.nilai <= 20, `nilai ${record.nilai} harus <= 20`);
        }
    });

    test("tipe pilihan menghasilkan nilai dari opsi", () => {
        const koki = new Koki();
        const opsi = ["a", "b", "c"];
        const definisi = {
            pilihan: { tipe: "pilihan", opsi },
        };

        const hasil = koki.masak(definisi, 50);

        for (const record of hasil) {
            assert.ok(
                opsi.includes(record.pilihan),
                `${record.pilihan} harus ada di opsi`,
            );
        }
    });

    test("tipe boolean menghasilkan true/false", () => {
        const koki = new Koki();
        const definisi = {
            aktif: { tipe: "boolean", rasio_benar: 0.5 },
        };

        const hasil = koki.masak(definisi, 100);

        for (const record of hasil) {
            assert.strictEqual(typeof record.aktif, "boolean");
        }
    });

    test("tipe nama_lengkap menghasilkan string dengan spasi", () => {
        const koki = new Koki();
        const definisi = {
            nama: { tipe: "nama_lengkap" },
        };

        const hasil = koki.masakSatu(definisi);

        assert.ok(hasil.nama.includes(" "), "nama lengkap harus ada spasi");
    });

    test("tipe email menghasilkan format email valid", () => {
        const koki = new Koki();
        const definisi = {
            email: { tipe: "email" },
        };

        const hasil = koki.masakSatu(definisi);

        assert.ok(hasil.email.includes("@"), "email harus ada @");
        assert.ok(hasil.email.includes("."), "email harus ada .");
    });

    test("tipe telepon menghasilkan nomor Indonesia", () => {
        const koki = new Koki();
        const definisi = {
            telepon: { tipe: "telepon" },
        };

        const hasil = koki.masakSatu(definisi);

        assert.ok(
            hasil.telepon.startsWith("0"),
            "telepon harus mulai dengan 0",
        );
        assert.ok(hasil.telepon.length >= 10, "telepon minimal 10 digit");
    });

    test("tipe tanggal menghasilkan format YYYY-MM-DD", () => {
        const koki = new Koki();
        const definisi = {
            tanggal: {
                tipe: "tanggal",
                dari: "2024-01-01",
                sampai: "2024-12-31",
            },
        };

        const hasil = koki.masakSatu(definisi);
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        assert.ok(
            dateRegex.test(hasil.tanggal),
            "tanggal harus format YYYY-MM-DD",
        );
    });

    test("tipe perusahaan menghasilkan nama PT/CV", () => {
        const koki = new Koki();
        const definisi = {
            perusahaan: { tipe: "perusahaan" },
        };

        const hasil = koki.masakSatu(definisi);

        assert.ok(
            hasil.perusahaan.startsWith("PT") ||
                hasil.perusahaan.startsWith("CV") ||
                hasil.perusahaan.startsWith("UD"),
            "perusahaan harus mulai dengan PT/CV/UD",
        );
    });

    test("reset membersihkan counter", () => {
        const koki = new Koki();
        const definisi = {
            nomor: { tipe: "increment", mulai: 1 },
        };

        koki.masak(definisi, 5);
        koki.reset();
        const hasil = koki.masak(definisi, 3);

        assert.strictEqual(
            hasil[0].nomor,
            1,
            "setelah reset harus mulai dari awal",
        );
    });
});
