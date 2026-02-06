/**
 * Test untuk Gizi (data validator)
 */

import { test, describe } from "node:test";
import assert from "node:assert";
import { Gizi } from "../src/Gizi.js";

describe("Gizi", () => {
    test("periksaSatu valid untuk data lengkap", () => {
        const gizi = new Gizi();
        const record = {
            id: "550e8400-e29b-41d4-a716-446655440000",
            nama: "Test User",
        };
        const definisi = {
            id: { tipe: "uuid" },
            nama: { tipe: "nama_lengkap" },
        };

        const hasil = gizi.periksaSatu(record, definisi);

        assert.strictEqual(hasil.valid, true);
        assert.strictEqual(hasil.masalah.length, 0);
    });

    test("periksaSatu mendeteksi field kosong", () => {
        const gizi = new Gizi();
        const record = {
            id: "550e8400-e29b-41d4-a716-446655440000",
            nama: "",
        };
        const definisi = {
            id: { tipe: "uuid" },
            nama: { tipe: "nama_lengkap" },
        };

        const hasil = gizi.periksaSatu(record, definisi);

        assert.strictEqual(hasil.valid, false);
        assert.ok(hasil.masalah.some((m) => m.includes("kosong")));
    });

    test("periksaSatu mendeteksi field null", () => {
        const gizi = new Gizi();
        const record = {
            id: null,
        };
        const definisi = {
            id: { tipe: "uuid" },
        };

        const hasil = gizi.periksaSatu(record, definisi);

        assert.strictEqual(hasil.valid, false);
    });

    test("periksaSatu validasi uuid format", () => {
        const gizi = new Gizi();
        const definisi = { id: { tipe: "uuid" } };

        // Valid UUID
        const valid = gizi.periksaSatu(
            { id: "550e8400-e29b-41d4-a716-446655440000" },
            definisi,
        );
        assert.strictEqual(valid.valid, true);

        // Invalid UUID
        const invalid = gizi.periksaSatu({ id: "bukan-uuid" }, definisi);
        assert.strictEqual(invalid.valid, false);
    });

    test("periksaSatu validasi angka range", () => {
        const gizi = new Gizi();
        const definisi = {
            nilai: { tipe: "angka", min: 10, max: 20 },
        };

        // Dalam range
        const valid = gizi.periksaSatu({ nilai: 15 }, definisi);
        assert.strictEqual(valid.valid, true);

        // Di bawah min
        const tooLow = gizi.periksaSatu({ nilai: 5 }, definisi);
        assert.strictEqual(tooLow.valid, false);

        // Di atas max
        const tooHigh = gizi.periksaSatu({ nilai: 25 }, definisi);
        assert.strictEqual(tooHigh.valid, false);
    });

    test("periksaSatu validasi pilihan", () => {
        const gizi = new Gizi();
        const definisi = {
            status: { tipe: "pilihan", opsi: ["aktif", "nonaktif"] },
        };

        // Valid
        const valid = gizi.periksaSatu({ status: "aktif" }, definisi);
        assert.strictEqual(valid.valid, true);

        // Invalid
        const invalid = gizi.periksaSatu({ status: "unknown" }, definisi);
        assert.strictEqual(invalid.valid, false);
    });

    test("periksaSatu validasi email format", () => {
        const gizi = new Gizi();
        const definisi = { email: { tipe: "email" } };

        // Valid
        const valid = gizi.periksaSatu({ email: "test@example.com" }, definisi);
        assert.strictEqual(valid.valid, true);

        // Invalid
        const invalid = gizi.periksaSatu({ email: "bukan-email" }, definisi);
        assert.strictEqual(invalid.valid, false);
    });

    test("periksaSatu validasi tanggal format", () => {
        const gizi = new Gizi();
        const definisi = { tanggal: { tipe: "tanggal" } };

        // Valid
        const valid = gizi.periksaSatu({ tanggal: "2024-01-15" }, definisi);
        assert.strictEqual(valid.valid, true);

        // Invalid
        const invalid = gizi.periksaSatu({ tanggal: "15-01-2024" }, definisi);
        assert.strictEqual(invalid.valid, false);
    });

    test("periksa batch menghasilkan laporan lengkap", () => {
        const gizi = new Gizi();
        const records = [
            { id: "550e8400-e29b-41d4-a716-446655440000", nama: "User 1" },
            { id: "550e8400-e29b-41d4-a716-446655440001", nama: "User 2" },
            { id: "550e8400-e29b-41d4-a716-446655440002", nama: "" }, // stunting
        ];
        const definisi = {
            id: { tipe: "uuid" },
            nama: { tipe: "nama_lengkap" },
        };

        const hasil = gizi.periksa(records, definisi);

        assert.strictEqual(hasil.laporan.total, 3);
        assert.strictEqual(hasil.laporan.valid, 2);
        assert.strictEqual(hasil.laporan.stunting, 1);
        assert.strictEqual(hasil.lulus, false);
    });

    test("periksa lulus jika semua valid", () => {
        const gizi = new Gizi();
        const records = [
            { id: "550e8400-e29b-41d4-a716-446655440000" },
            { id: "550e8400-e29b-41d4-a716-446655440001" },
        ];
        const definisi = {
            id: { tipe: "uuid" },
        };

        const hasil = gizi.periksa(records, definisi);

        assert.strictEqual(hasil.lulus, true);
        assert.strictEqual(hasil.laporan.stunting, 0);
    });

    test("getLaporanTeks menghasilkan string", () => {
        const gizi = new Gizi();
        const records = [{ id: "550e8400-e29b-41d4-a716-446655440000" }];
        const definisi = { id: { tipe: "uuid" } };

        gizi.periksa(records, definisi);
        const laporan = gizi.getLaporanTeks();

        assert.strictEqual(typeof laporan, "string");
        assert.ok(laporan.includes("LAPORAN GIZI"));
        assert.ok(laporan.includes("Total porsi"));
    });

    test("reset membersihkan laporan", () => {
        const gizi = new Gizi();
        const records = [{ id: "550e8400-e29b-41d4-a716-446655440000" }];
        const definisi = { id: { tipe: "uuid" } };

        gizi.periksa(records, definisi);
        gizi.reset();

        assert.strictEqual(gizi.laporan.total, 0);
        assert.strictEqual(gizi.laporan.valid, 0);
    });
});
