import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/**
 * Create a Supabase client for use in Client Components and Browser contexts
 *
 * This client:
 * - Automatically manages cookies for authentication
 * - Can be used in Client Components, event handlers, and browser-only code
 * - Maintains authentication state across page navigations
 *
 * @example
 * ```tsx
 * 'use client'
 *
 * import { createClient } from '@/lib/supabase/client'
 *
 * export default function MyComponent() {
 *   const supabase = createClient()
 *
 *   const handleClick = async () => {
 *     const { data } = await supabase.from('todos').select()
 *   }
 * }
 * ```
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check your .env.local file.",
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
