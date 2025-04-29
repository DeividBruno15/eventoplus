
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";

export const useProfileData = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const getUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        throw error;
      }

      const email = user.email || "";
      setUserData({
        ...data,
        email,
      } as UserProfile);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error fetching profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdated = () => {
    getUserData();
    toast.success("Profile updated successfully");
    return true;
  };

  useEffect(() => {
    if (user) {
      getUserData();
    }
  }, [user]);

  return {
    userData,
    loading,
    getUserData,
    handleProfileUpdated
  };
};
