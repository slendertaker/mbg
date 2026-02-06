/**
 * MBG - Database Seeder CLI
 * Public API exports
 */

// Core classes
export { Dapur } from "./Dapur.js";
export { Resep, ResepError, TIPE_BAHAN } from "./Resep.js";
export { Koki } from "./Koki.js";
export { Gizi } from "./Gizi.js";
export { Anggaran } from "./Anggaran.js";

// Catering adapters
export {
    CateringJSON,
    CateringCSV,
    CateringSQL,
    getCatering,
} from "./catering/index.js";

// Bahan (fake data generators)
export * as bahan from "./bahan/index.js";

// Messages
export { PESAN, format } from "./pesan.js";

// Version
export const VERSION = "1.0.0";
