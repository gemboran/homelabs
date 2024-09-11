import {z} from "zod";

const configSchema = z.object({
  supabaseUrl: z.string({message: "NEXT_PUBLIC_SUPABASE_URL is required"}).url(),
  supabaseKey: z.string({message: "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"}),
});

const initialConfig: z.infer<typeof configSchema> = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
}

const {error, data: config} = configSchema.safeParse(initialConfig);

if (error) {
  error.errors.map(item => console.error(item.message));
  throw new Error();
}

export default config as z.infer<typeof configSchema>
