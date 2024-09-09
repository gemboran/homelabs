import {z} from "zod";

const configSchema = z.object({
  supabaseUrl: z.string().url(),
  supabaseKey: z.string(),
});

const initialConfig: z.infer<typeof configSchema> = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
}

const {error, data: config} = configSchema.safeParse(initialConfig);

if (error) {
  console.error(error);
  process.exit(1);
}

export default config as z.infer<typeof configSchema>
