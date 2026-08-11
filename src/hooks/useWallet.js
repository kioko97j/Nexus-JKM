import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export function useWallet() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBalance(0);
      setLoading(false);
      return;
    }

    let cancelled = false;

    setLoading(true);
    supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", user.id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) throw error;
        setBalance(Number(data.balance));
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const debit = useCallback(
    async (amount) => {
      const { data, error } = await supabase
        .from("wallets")
        .update({ balance: balance - amount, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .select("balance")
        .single();

      if (error) throw error;

      setBalance(Number(data.balance));
      return Number(data.balance);
    },
    [balance, user]
  );

  return { balance, loading, debit };
}
