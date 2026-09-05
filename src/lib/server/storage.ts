import { createClient } from "@supabase/supabase-js";

export function getStorageClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase Storage is not configured.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function uploadPrivateMemory(file: File, eventId: string) {
  if (!file.type.startsWith("image/")) throw new Error("Only image uploads are supported.");
  if (file.size > 12 * 1024 * 1024) throw new Error("Images must be smaller than 12 MB.");
  const bucket = process.env.SUPABASE_MEDIA_BUCKET ?? "memories";
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const storagePath = `${eventId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await getStorageClient().storage.from(bucket).upload(storagePath, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  return { storagePath, mimeType: file.type };
}

export async function signedMemoryUrl(storagePath: string) {
  const bucket = process.env.SUPABASE_MEDIA_BUCKET ?? "memories";
  const { data, error } = await getStorageClient().storage.from(bucket).createSignedUrl(storagePath, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}
