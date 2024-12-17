import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const supabase = createClient();

export const useGenerations = () => {
  const [generationsRemaining, setGenerationsRemaining] = useState(0);
  const [freeGenerationsRemaining, setFreeGenerationsRemaining] = useState(0);
  const [purchasedGenerationsRemaining, setPurchasedGenerationsRemaining] = useState(0);
  const [generationsLoading, setGenerationsLoading] = useState(true);
  const [lastFreeGenerationsReset, setLastFreeGenerationsReset] = useState<Date | null>(null);
  const [freeGenerationsLimit, setFreeGenerationsLimit] = useState(0);

  const refetchGenerations = async () => {
    setGenerationsLoading(true);
    const user = await supabase.auth.getUser();
    const { data } = await supabase.from("users").select("free_generations_remaining,purchased_generations_remaining,last_free_generations_reset").eq("id", user.data.user?.id).single();
    const { data: freeGenerationsLimitData } = await supabase.from("system_configurations").select("config_key,config_value").eq("config_key", "FREE_GENERATIONS_DAILY_LIMIT").single();
    setGenerationsLoading(false);
    if (!data || !freeGenerationsLimitData) {
      return 0;
    }

    const totalGenerations = Math.max(0, data.free_generations_remaining + data.purchased_generations_remaining);
    setFreeGenerationsRemaining(data.free_generations_remaining);
    setPurchasedGenerationsRemaining(data.purchased_generations_remaining);
    setLastFreeGenerationsReset(data.last_free_generations_reset);
    setFreeGenerationsLimit(freeGenerationsLimitData.config_value);
    setGenerationsRemaining(totalGenerations);
  };

  useEffect(() => {
    const fetchGenerations = async () => {
      setGenerationsLoading(true);
      const user = await supabase.auth.getUser();
      const { data } = await supabase.from("users").select("free_generations_remaining,purchased_generations_remaining,last_free_generations_reset").eq("id", user.data.user?.id).single();
      const { data: freeGenerationsLimitData } = await supabase.from("system_configurations").select("config_key,config_value").eq("config_key", "FREE_GENERATIONS_DAILY_LIMIT").single();
      setGenerationsLoading(false);
      if (!data || !freeGenerationsLimitData) {
        return 0;
      }
      const totalGenerations = Math.max(0, data.free_generations_remaining + data.purchased_generations_remaining);
      setFreeGenerationsRemaining(data.free_generations_remaining);
      setPurchasedGenerationsRemaining(data.purchased_generations_remaining);
      setLastFreeGenerationsReset(data.last_free_generations_reset);
      setFreeGenerationsLimit(freeGenerationsLimitData.config_value);
      setGenerationsRemaining(totalGenerations);
    };
    fetchGenerations();
  }, []);
  return {
    generationsRemaining,
    freeGenerationsRemaining,
    purchasedGenerationsRemaining,
    lastFreeGenerationsReset,
    generationsLoading,
    refetchGenerations,
    freeGenerationsLimit
  };
};

interface GeneratedLogo {
  preview_image_url: string;
  high_res_image_url: string;
  is_high_res_purchased: boolean;
  generation_timestamp: string;
}

export const useGeneratedLogos = () => {
  const [generatedLogos, setGeneratedLogos] = useState<GeneratedLogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeneratedLogos = async () => {
      try {
        setLoading(true);
        const user = await supabase.auth.getUser();
        if (!user?.data?.user?.id) throw new Error("User not logged in");

        const { data, error } = await supabase
          .from("user_generations")
          .select("preview_image_url,high_res_image_url,is_high_res_purchased,generation_timestamp")
          .eq("user_id", user.data.user.id);

        if (error) throw error;
        setGeneratedLogos(data || []);
      } catch (error) {
        console.error("Error fetching generated logos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGeneratedLogos();
  }, []);
  return { generatedLogos, loading };
};