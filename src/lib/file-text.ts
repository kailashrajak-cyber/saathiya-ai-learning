const TEXT_EXTENSIONS = [".txt", ".md", ".csv", ".json", ".log", ".rtf"];

export function isReadableTextFile(name: string) {
  return TEXT_EXTENSIONS.some((ext) => name.toLowerCase().endsWith(ext));
}

/** Reads text out of a plain-text style file in the browser. Returns null for binary formats. */
export async function readFileText(file: File): Promise<string | null> {
  if (!isReadableTextFile(file.name) && !file.type.startsWith("text/")) return null;
  try {
    const text = await file.text();
    return text.slice(0, 40000);
  } catch {
    return null;
  }
}

/** Reads a file as base64 (used to send PDFs to the server for analysis). */
export async function readFileBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 8192;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
