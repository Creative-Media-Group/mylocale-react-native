import * as FileSystem from "expo-file-system";
import Papa from "papaparse";

/**
 * Übersetzt einen Schlüssel basierend auf einer CSV-Datei.
 * @param csvFilePath Der Pfad zur CSV-Datei (lokal).
 * @param targetKey Der zu übersetzende Schlüssel.
 * @param langcode Der Sprachcode (z. B. "en", "de").
 * @returns Übersetzter Text oder der englische Fallback.
 */
export async function tr(
  csvFilePath: string,
  targetKey: string,
  langcode: string = "en",
): Promise<string> {
  try {
    // Lade die CSV-Datei aus dem Expo-Dateisystem
    const csvContent = await FileSystem.readAsStringAsync(csvFilePath);

    // Parse die CSV-Datei
    const parsed = Papa.parse(csvContent, { header: true });
    const rows = parsed.data as Record<string, string>[];

    // Suche nach dem Zielschlüssel
    for (const row of rows) {
      if (row["stringname"] === targetKey) {
        return row[langcode] || row["en"] || "";
      }
    }

    // Fallback, falls der Schlüssel nicht gefunden wurde
    return `Missing translation for "${targetKey}"`;
  } catch (error) {
    console.error("Error loading translation:", error);
    return `Error: Unable to load translations`;
  }
}
