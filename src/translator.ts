import * as fs from "fs/promises"; // Node.js-Dateisystem für asynchrone Operationen
import Papa from "papaparse";

// Typen für die CSV-Daten
interface TranslationRow {
  stringname: string;
  [key: string]: string; // Dynamische Sprachspalten für verschiedene Sprachen
}

// Funktion, um die Systemsprache zu ermitteln
const getSystemLanguage = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().locale.split("-")[0] || "en";
};

/**
 * Lädt eine Übersetzung aus einer CSV-Datei.
 *
 * @param csvFilePath - Pfad zur CSV-Datei
 * @param targetKey - Der Schlüssel für die gewünschte Übersetzung
 * @param langcode - Der Sprachcode, standardmäßig die Systemsprache
 * @returns Die Übersetzung als String oder eine Fehlermeldung
 */
export async function tr(
  csvFilePath: string,
  targetKey: string,
  langcode: string = getSystemLanguage(),
): Promise<string> {
  try {
    // CSV-Datei lesen
    const csvContent = await fs.readFile(csvFilePath, "utf-8");

    // CSV-Daten parsen
    const parsed = Papa.parse<TranslationRow>(csvContent, {
      header: true, // Erste Zeile als Header verwenden
      skipEmptyLines: true, // Leere Zeilen ignorieren
    });

    // Übersetzung anhand des Zielschlüssels suchen
    const entry = parsed.data.find((row) => row.stringname === targetKey);

    if (!entry) {
      return `Missing translation for key: ${targetKey}`;
    }

    // Rückgabe der gewünschten Übersetzung oder der Fallback-Sprache
    if (!entry[langcode] || entry[langcode].trim() === "") {
      return entry.en || `Missing fallback translation for key: ${targetKey}`;
    }

    return entry[langcode];
  } catch (error) {
    console.error("Error reading or parsing CSV file:", error);
    return "Error loading translation.";
  }
}
