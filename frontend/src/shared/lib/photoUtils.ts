export interface PhotoEntry {
  url: string;
  uploadedAt?: string;
}

/**
 * Parsea una entrada de foto que puede ser un string URL plano o un JSON con metadata.
 * Es retrocompatible: acepta strings viejos y objetos nuevos.
 */
export function parsePhotoEntry(entry: string | PhotoEntry): PhotoEntry {
  if (typeof entry === 'object' && entry !== null && 'url' in entry) {
    return entry;
  }
  if (typeof entry === 'string') {
    try {
      const parsed = JSON.parse(entry);
      if (parsed && typeof parsed === 'object' && 'url' in parsed) {
        return parsed as PhotoEntry;
      }
    } catch {
      // Es una URL plano, no JSON
    }
    return { url: entry };
  }
  return { url: '' };
}

/**
 * Crea una entrada de foto con timestamp actual.
 */
export function createPhotoEntry(url: string): string {
  return JSON.stringify({ url, uploadedAt: new Date().toISOString() });
}

/**
 * Formatea una fecha ISO a formato local legible.
 */
export function formatPhotoDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}
