import { createClient, SupabaseClient } from "@supabase/supabase-js";
import ws from "ws";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kufyxqggfzotrbckyzld.supabase.co";

export const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Znl4cWdnZnpvdHJiY2t5emxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMDc2NDIsImV4cCI6MjEwNzY4MzY0Mn0.Rbu_qpYfe8quT9vvc2WXsDVF-HaU-q8Al0Bzw7cQLco";

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
      realtime: {
        transport: ws as unknown as typeof WebSocket,
      },
    });
  }
  return supabaseInstance;
}
