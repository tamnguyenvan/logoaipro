import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export const usePrice = () => {
  const [hiresPrice, setHiresPrice] = useState<string | null>(null);
  const [isPriceLoading, setIsPriceLoading] = useState(true);

  useEffect(() => {
    const fetchHiresPrice = async () => {
      try {
        setIsPriceLoading(true);
        const supabase = await createClient();
        const { data: user } = await supabase.auth.getUser();
        if (!user) {
          return null;
        }

        const { data } = await supabase.from("system_configurations").select("config_value").eq("config_key", "HIGH_RES_IMAGE_PRICE").single();

        if (!data || !data.config_value) {
          return null;
        }
        setHiresPrice(data?.config_value as string);
      } catch (error) {
        console.error("Error fetching hires price:", error);
      } finally {
        setIsPriceLoading(false);
      }
    };

    fetchHiresPrice();
  }, []);

  return {
    hiresPrice,
    isPriceLoading
  };
};