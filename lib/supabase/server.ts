import {createServerClient} from '@supabase/ssr'
import {cookies} from 'next/headers'
import config from "@/config";

function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    config.supabaseUrl,
    config.supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({name, value, options}) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export const supabase = createClient()
