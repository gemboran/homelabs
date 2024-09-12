import {z} from "zod";

const configSchema = z.object({
  supabaseUrl: z.string({message: "NEXT_PUBLIC_SUPABASE_URL is required"}).url(),
  supabaseKey: z.string({message: "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"}),
  appName: z.string({message: "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"}),
  appDesc: z.string().optional(),
  aptabaseAppKey: z.string().optional(),
  signozUrl: z.string().optional(),
  signozAccessToken: z.string().optional(),
});

const initialConfig: z.infer<typeof configSchema> = {
  appName: process.env.NEXT_PUBLIC_APP_NAME!,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  appDesc: process.env.NEXT_PUBLIC_APP_DESC,
  aptabaseAppKey: process.env.NEXT_PUBLIC_APTABASE_APP_KEY,
  signozUrl: process.env.NEXY_PUBLIC_SIGNOZ_URL,
  signozAccessToken: process.env.NEXY_PUBLIC_SIGNOZ_ACCESS_TOKEN,
}

const {error, data: config} = configSchema.safeParse(initialConfig);

if (error) {
  error.errors.map(item => console.error(item.message));
  throw new Error();
}

export default config as z.infer<typeof configSchema>
