#!/usr/bin/env node

/**
 * MBG CLI - Database Seeder
 * Menyajikan Data Berkualitas — Gratis, Massal, dan Bergizi.
 */

import { resolve, basename, dirname } from "node:path";
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { Dapur } from "../src/Dapur.js";
import { Resep } from "../src/Resep.js";
import { getCatering } from "../src/catering/index.js";
import { PESAN, format } from "../src/pesan.js";
import { VERSION } from "../src/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Argument Parser ───────────────────────────────────────────────────────

/**
 * Parse command line arguments (zero deps)
 * @param {string[]} args
 * @returns {{command: string, flags: object, positionals: string[]}}
 */
function parseArgs(args) {
    const result = {
        command: null,
        flags: {},
        positionals: [],
    };

    let i = 0;
    while (i < args.length) {
        const arg = args[i];

        if (arg.startsWith("--")) {
            const key = arg.slice(2);
            const nextArg = args[i + 1];

            // Boolean flags
            if (!nextArg || nextArg.startsWith("-")) {
                result.flags[key] = true;
            } else {
                result.flags[key] = nextArg;
                i++;
            }
        } else if (arg.startsWith("-") && arg.length === 2) {
            const key = arg.slice(1);
            const nextArg = args[i + 1];

            if (!nextArg || nextArg.startsWith("-")) {
                result.flags[key] = true;
            } else {
                result.flags[key] = nextArg;
                i++;
            }
        } else if (!result.command) {
            result.command = arg;
        } else {
            result.positionals.push(arg);
        }

        i++;
    }

    // Normalize flag aliases
    if (result.flags.r) result.flags.resep = result.flags.r;
    if (result.flags.p) result.flags.porsi = result.flags.p;
    if (result.flags.o) result.flags.output = result.flags.o;
    if (result.flags.c) result.flags.catering = result.flags.c;
    if (result.flags.h) result.flags.help = result.flags.h;
    if (result.flags.v) result.flags.version = result.flags.v;

    return result;
}

// ─── Output Helpers ────────────────────────────────────────────────────────

/**
 * Print to stdout
 * @param {string} message
 */
function print(message = "") {
    console.log(message);
}

/**
 * Print error to stderr
 * @param {string} message
 */
function printError(message) {
    console.error(message);
}

/**
 * Print banner
 */
function printBanner() {
    print(format(PESAN.BANNER, { version: VERSION }));
}

// ─── Commands ──────────────────────────────────────────────────────────────

/**
 * Command: masak
 * Generate data ke file
 */
async function cmdMasak(flags) {
    const resepPath = flags.resep;
    if (!resepPath) {
        printError(format(PESAN.RESEP_REQUIRED, { command: "masak" }));
        process.exit(1);
    }

    const porsi = parseInt(flags.porsi, 10) || 100;
    const formatOutput = flags.format || "json";
    const outputPath = flags.output || `output.${formatOutput}`;

    // Options
    const options = {
        hemat: !!flags.hemat,
        kering: !!flags.kering,
        verbose: !!flags.verbose,
    };

    if (options.hemat) {
        print(PESAN.HEMAT_AKTIF);
    }

    try {
        // Load dan masak
        const dapur = new Dapur(options);
        dapur.loadResep(resepPath);

        print("");
        print(format(PESAN.PROSES_BAHAN) + "...");
        const hasil = dapur.masak(porsi);

        print(format(PESAN.PROSES_OLAH) + "... done");

        // Output
        if (!options.kering) {
            const catering = getCatering(formatOutput, {
                timpa: !!flags.timpa,
            });
            const sekolah = hasil.sekolah;

            print(format(PESAN.PROSES_TULIS, { output: outputPath }) + "...");

            if (formatOutput === "sql") {
                catering.tulis(hasil.data, outputPath, sekolah);
            } else {
                catering.tulis(hasil.data, outputPath);
            }

            print("");
            print(format(PESAN.MASAK_SELESAI, { output: outputPath }));
        } else {
            print("");
            print(PESAN.KERING);
        }

        // Laporan
        print(dapur.getLaporanMasak(hasil));
    } catch (err) {
        printError("");
        printError(`Error: ${err.message}`);
        process.exit(1);
    }
}

/**
 * Command: menu
 * Tampilkan daftar resep tersedia
 */
function cmdMenu() {
    print(PESAN.MENU_HEADER);
    print("");

    // Cari resep bawaan
    const resepDir = resolve(__dirname, "..", "resep");
    if (existsSync(resepDir)) {
        const files = readdirSync(resepDir).filter((f) =>
            f.endsWith(".resep.json"),
        );
        if (files.length > 0) {
            print("Resep bawaan:");
            for (const file of files) {
                const name = basename(file, ".resep.json");
                print(`  - ${name}`);
            }
        }
    }

    // Cari resep di current directory
    const cwdFiles = readdirSync(process.cwd()).filter((f) =>
        f.endsWith(".resep.json"),
    );
    if (cwdFiles.length > 0) {
        print("");
        print("Resep lokal:");
        for (const file of cwdFiles) {
            print(`  - ${file}`);
        }
    }

    if (!existsSync(resepDir) && cwdFiles.length === 0) {
        print(PESAN.MENU_EMPTY);
    }
}

/**
 * Command: gizi
 * Validasi resep
 */
function cmdGizi(flags) {
    const resepPath = flags.resep;
    if (!resepPath) {
        printError(format(PESAN.RESEP_REQUIRED, { command: "gizi" }));
        process.exit(1);
    }

    try {
        const resep = new Resep(resepPath);
        resep.load();

        const hasil = resep.validasi();

        print("");
        print(`Memeriksa resep: ${resepPath}`);
        print("");

        if (hasil.errors.length > 0) {
            print("Masalah ditemukan:");
            for (const err of hasil.errors) {
                print(`  - ${err}`);
            }
            print("");
        }

        if (hasil.warnings.length > 0) {
            print("Peringatan:");
            for (const warn of hasil.warnings) {
                print(`  - ${warn}`);
            }
            print("");
        }

        if (hasil.valid) {
            print(PESAN.GIZI_LULUS);
        } else {
            print("Resep tidak memenuhi standar gizi.");
            process.exit(1);
        }
    } catch (err) {
        printError("");
        printError(`Error: ${err.message}`);
        process.exit(1);
    }
}

/**
 * Command: version
 * Tampilkan versi
 */
function cmdVersion() {
    print(`MBG v${VERSION}`);

    // Easter egg: Jumat sore
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    if (day === 5 && hour >= 16) {
        print(PESAN.JUMAT_SORE);
    }
}

/**
 * Command: help
 * Tampilkan bantuan
 */
function cmdHelp() {
    print(PESAN.HELP);
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
    const args = process.argv.slice(2);
    const parsed = parseArgs(args);

    // Global flags
    if (parsed.flags.help || parsed.command === "help") {
        printBanner();
        print("");
        cmdHelp();
        return;
    }

    if (parsed.flags.version) {
        cmdVersion();
        return;
    }

    // No command
    if (!parsed.command) {
        printBanner();
        print("");
        print('Jalankan "mbg --help" untuk melihat perintah yang tersedia.');
        return;
    }

    // Route command
    switch (parsed.command) {
        case "masak":
            printBanner();
            await cmdMasak(parsed.flags);
            break;

        case "menu":
            printBanner();
            print("");
            cmdMenu();
            break;

        case "gizi":
            printBanner();
            cmdGizi(parsed.flags);
            break;

        case "version":
            cmdVersion();
            break;

        default:
            printError(
                format(PESAN.COMMAND_UNKNOWN, { command: parsed.command }),
            );
            printError(
                'Jalankan "mbg --help" untuk melihat perintah yang tersedia.',
            );
            process.exit(1);
    }
}

main().catch((err) => {
    printError(`Fatal error: ${err.message}`);
    process.exit(1);
});
