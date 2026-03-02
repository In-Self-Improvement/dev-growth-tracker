import { z } from 'zod'

/**
 * Environment variable validation using Zod
 *
 * This file validates environment variables at runtime to catch configuration
 * errors early in development and prevent runtime errors in production.
 *
 * Benefits:
 * - Type-safe environment variables throughout the application
 * - Early validation on startup
 * - Clear error messages for missing or invalid variables
 * - Auto-completion in IDE
 *
 * Usage:
 * import { env } from '@/env'
 * console.log(env.NEXT_PUBLIC_SUPABASE_URL)
 */

const envSchema = z.object({
  // Supabase environment variables
  NEXT_PUBLIC_SUPABASE_URL: z.string().url({
    message: 'NEXT_PUBLIC_SUPABASE_URL must be a valid URL',
  }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, {
    message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required',
  }),

  // Node environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
})

/**
 * Validate and parse environment variables
 * Throws an error if validation fails
 */
function validateEnv() {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NODE_ENV: process.env.NODE_ENV,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((err) => {
        return `  - ${err.path.join('.')}: ${err.message}`
      })

      throw new Error(
        `❌ Invalid environment variables:\n${errorMessages.join('\n')}\n\n` +
          `Please check your .env.local file and ensure all required variables are set.\n` +
          `See .env.local for the template.`
      )
    }
    throw error
  }
}

/**
 * Validated environment variables
 * Import this instead of using process.env directly
 */
export const env = validateEnv()

/**
 * Type for environment variables
 */
export type Env = z.infer<typeof envSchema>
