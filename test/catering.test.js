/**
 * Test untuk Catering adapters (JSON, CSV, SQL)
 */

import { test, describe } from "node:test";
import assert from "node:assert";
import {
    writeFileSync,
    readFileSync,
    unlinkSync,
    mkdirSync,
    rmdirSync,
    existsSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { CateringJSON } from "../src/catering/json.js";
import { CateringCSV } from "../src/catering/csv.js";
import { CateringSQL } from "../src/catering/sql.js";
import { getCatering } from "../src/catering/index.js";

describe("CateringJSON", () => {
    const testDir = join(tmpdir(), "mbg-catering-test-" + Date.now());

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

    test("toString menghasilkan JSON valid", () => {
        const catering = new CateringJSON();
        const data = [{ id: 1, nama: "Test" }];

        const result = catering.toString(data);
        const parsed = JSON.parse(result);

        assert.deepStrictEqual(parsed, data);
    });

    test("toString dengan pretty=false menghasilkan compact JSON", () => {
        const catering = new CateringJSON({ pretty: false });
        const data = [{ id: 1 }];

        const result = catering.toString(data);

        assert.ok(!result.includes("\n"), "tidak boleh ada newline");
    });

    test("tulis membuat file", () => {
        const catering = new CateringJSON({ timpa: true });
        const data = [{ id: 1, nama: "Test" }];
        const filePath = join(testDir, "output.json");

        const result = catering.tulis(data, filePath);

        assert.strictEqual(result.success, true);
        assert.ok(existsSync(filePath));

        const content = readFileSync(filePath, "utf-8");
        assert.deepStrictEqual(JSON.parse(content), data);

        unlinkSync(filePath);
    });

    test("tulis throw error jika file exists dan tidak timpa", () => {
        const catering = new CateringJSON({ timpa: false });
        const filePath = join(testDir, "exists.json");
        writeFileSync(filePath, "[]");

        assert.throws(() => catering.tulis([{ id: 1 }], filePath));

        unlinkSync(filePath);
    });
});

describe("CateringCSV", () => {
    test("toString menghasilkan CSV dengan header", () => {
        const catering = new CateringCSV();
        const data = [
            { id: 1, nama: "Alice" },
            { id: 2, nama: "Bob" },
        ];

        const result = catering.toString(data);
        const lines = result.split("\n");

        assert.strictEqual(lines[0], "id,nama");
        assert.strictEqual(lines[1], "1,Alice");
        assert.strictEqual(lines[2], "2,Bob");
    });

    test("toString tanpa header", () => {
        const catering = new CateringCSV({ header: false });
        const data = [{ id: 1, nama: "Test" }];

        const result = catering.toString(data);

        assert.ok(!result.includes("id,nama"));
    });

    test("escape nilai dengan koma", () => {
        const catering = new CateringCSV();
        const data = [{ nama: "Doe, John" }];

        const result = catering.toString(data);

        assert.ok(result.includes('"Doe, John"'));
    });

    test("escape nilai dengan quote", () => {
        const catering = new CateringCSV();
        const data = [{ nama: 'Say "Hello"' }];

        const result = catering.toString(data);

        assert.ok(result.includes('"Say ""Hello"""'));
    });

    test("handle null dan undefined", () => {
        const catering = new CateringCSV();
        const data = [{ a: null, b: undefined }];

        const result = catering.toString(data);
        const lines = result.split("\n");

        assert.strictEqual(lines[1], ",");
    });
});

describe("CateringSQL", () => {
    test("toString menghasilkan INSERT statement", () => {
        const catering = new CateringSQL();
        const data = [{ id: 1, nama: "Test" }];

        const result = catering.toString(data, "users");

        assert.ok(result.includes("INSERT INTO users"));
        assert.ok(result.includes("(id, nama)"));
        assert.ok(result.includes("(1, 'Test')"));
    });

    test("escape single quote", () => {
        const catering = new CateringSQL();
        const data = [{ nama: "O'Brien" }];

        const result = catering.toString(data, "users");

        assert.ok(result.includes("'O''Brien'"));
    });

    test("handle null", () => {
        const catering = new CateringSQL();
        const data = [{ id: 1, nama: null }];

        const result = catering.toString(data, "users");

        assert.ok(result.includes("NULL"));
    });

    test("handle boolean", () => {
        const catering = new CateringSQL();
        const data = [{ aktif: true, nonaktif: false }];

        const result = catering.toString(data, "users");

        assert.ok(result.includes("TRUE"));
        assert.ok(result.includes("FALSE"));
    });

    test("batch insert dengan batchSize", () => {
        const catering = new CateringSQL({ batchSize: 2 });
        const data = [{ id: 1 }, { id: 2 }, { id: 3 }];

        const result = catering.toString(data, "users");
        const insertCount = (result.match(/INSERT INTO/g) || []).length;

        assert.strictEqual(insertCount, 2, "harus ada 2 INSERT statement");
    });

    test("comment header", () => {
        const catering = new CateringSQL();
        const data = [{ id: 1 }];

        const result = catering.toString(data, "my_table");

        assert.ok(result.includes("-- Generated by MBG"));
        assert.ok(result.includes("-- Table: my_table"));
        assert.ok(result.includes("-- Records: 1"));
    });
});

describe("getCatering", () => {
    test("mengembalikan CateringJSON untuk format json", () => {
        const catering = getCatering("json");
        assert.ok(catering instanceof CateringJSON);
    });

    test("mengembalikan CateringCSV untuk format csv", () => {
        const catering = getCatering("csv");
        assert.ok(catering instanceof CateringCSV);
    });

    test("mengembalikan CateringSQL untuk format sql", () => {
        const catering = getCatering("sql");
        assert.ok(catering instanceof CateringSQL);
    });

    test("throw error untuk format tidak dikenal", () => {
        assert.throws(() => getCatering("xml"));
    });

    test("case insensitive", () => {
        assert.ok(getCatering("JSON") instanceof CateringJSON);
        assert.ok(getCatering("CSV") instanceof CateringCSV);
        assert.ok(getCatering("SQL") instanceof CateringSQL);
    });
});
