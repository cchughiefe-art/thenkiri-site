import { createClient } from "@supabase/supabase-js";

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://fshkagvxvhifsktlqjoi.supabase.co";

const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_pTw8dlgkOMdMFK8_cPnASA_vE4ozBRd";

let client: ReturnType<typeof createClient> | null = null;

export function supabaseBrowser() {
  if (!client) {
    client = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  return client;
}
