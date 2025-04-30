import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dyhngxmdibbtlddqxztd.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5aG5neG1kaWJidGxkZHF4enRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjEzMzgsImV4cCI6MjA2MDk5NzMzOH0.8bcsr_Fjz7cmbCXQPWnPq3c2YJextFuvQPWFnn3GMfg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
