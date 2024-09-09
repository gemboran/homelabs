import {useEffect, useState} from "react";
import {supabase} from "@/lib/supabase/client";
import {toast} from "sonner";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const {
        data: {user},
        error,
      } = await supabase.auth.getUser();

      if (error) {
        toast.error("Error loading user: " + error.message);
        setLoading(false);
        return;
      }

      if (user) {
        const {data: profileData, error: profileError} = await supabase
          .from("profiles")
          .select(`full_name, avatar_url`)
          .eq("id", user.id)
          .single();

        if (profileError) {
          toast.error("Error loading user profile: " + profileError.message);
          setLoading(false);
          return;
        }

        setUser({
          id: user.id,
          name: profileData.full_name,
          email: user.email!,
          avatar: profileData.avatar_url,
        });
      }

      setLoading(false);
    };

    // noinspection JSIgnoredPromiseFromCall
    fetchUser();
  }, []);

  return {user, loading};
};