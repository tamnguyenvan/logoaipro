import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const supabase = createClient();

interface Transaction {
  id: string;
  user_id: string;
  transaction_type: string;
  amount: number;
  generation_id: string;
  transaction_timestamp: string;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const user = await supabase.auth.getUser();
        if (!user?.data?.user?.id) throw new Error("User not logged in");

        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.data.user.id);

        if (error) throw error;
        setTransactions(data || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);


  return { transactions, loading };
}