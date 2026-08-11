import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const toRecord = (row) => ({
  id: row.id,
  type: row.type,
  documentType: row.document_type,
  reference: row.reference,
  customerName: row.customer_name,
  status: row.status,
  cost: row.cost,
  result: row.result,
  createdAt: row.created_at,
  date: new Date(row.created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
});

export function useVerifications() {
  const { user } = useAuth();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setVerifications([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    setLoading(true);
    supabase
      .from("verifications")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) throw error;
        setVerifications((data ?? []).map(toRecord));
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const addVerification = useCallback(async (draft) => {
    const { data, error } = await supabase
      .from("verifications")
      .insert({
        type: draft.type,
        document_type: draft.documentType ?? null,
        reference: draft.reference,
        customer_name: draft.customerName,
        status: draft.status,
        cost: draft.cost,
        result: draft.result ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    const record = toRecord(data);
    setVerifications((prev) => [record, ...prev]);
    return record;
  }, []);

  return { verifications, loading, addVerification };
}
