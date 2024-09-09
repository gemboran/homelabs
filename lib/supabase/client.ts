import {createBrowserClient} from "@supabase/ssr";
import config from "@/config";

export const supabase = createBrowserClient(config.supabaseUrl, config.supabaseKey);
