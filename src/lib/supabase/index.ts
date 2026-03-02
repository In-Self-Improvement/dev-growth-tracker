/**
 * Supabase client utilities with TypeScript support
 *
 * This file exports type-safe Supabase clients and utilities.
 * Use these exports throughout your application for consistent typing.
 */

// Export type-safe clients
export { createClient } from './client'
export { createClient as createServerClient } from './server'

// Export database types
export type { Database, Tables, TablesInsert, TablesUpdate, Enums } from './database.types'

// You can add utility functions here as your application grows
// For example:

/**
 * Helper type for Supabase query results
 * Extracts the data type from a Supabase query
 */
export type SupabaseQueryResult<T> = T extends PromiseLike<infer U> ? U : never
export type SupabaseQueryData<T> = T extends PromiseLike<{ data: infer U }>
  ? U
  : never
export type SupabaseQueryError<T> = T extends PromiseLike<{ error: infer U }>
  ? U
  : never

/**
 * Example utility function for handling Supabase errors
 * You can expand this as needed
 */
export function handleSupabaseError(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return 'An unexpected error occurred'
}
