import { unlink } from "fs/promises";
import path from "path";

export async function deleteUploadedFile(url: string | null | undefined): Promise<void> {
  if (!url || !url.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), "public", url);
  try {
    await unlink(filePath);
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[deleteUploadedFile] Could not delete ${filePath}:`, err);
    }
  }
}

export async function deleteUploadedFiles(urls: (string | null | undefined)[]): Promise<void> {
  await Promise.all(urls.map(deleteUploadedFile));
}
