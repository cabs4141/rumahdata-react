// src/components/Ptk.jsx
import React, { useEffect } from "react";
import { usePtkStore } from "../../../stores/usePtkStore";
import EnhancedTable from "./table";

const Ptk = () => {
  const ptkData = usePtkStore((state) => state.ptkData);
  const isLoading = usePtkStore((state) => state.isLoading);
  const error = usePtkStore((state) => state.error);
  const fetchPtk = usePtkStore((state) => state.fetchPtk);

  useEffect(() => {
    if (ptkData.length === 0) {
      fetchPtk();
    }
  }, [fetchPtk, ptkData.length]);

  try {
    if (isLoading) {
      return <div>Memuat data PTK...</div>;
    } else if (ptkData.length === 0) {
      return <div>Data tidak ditemukan</div>;
    }
  } catch (e) {
    console.log(e.message);
  }

  return (
    <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
      <EnhancedTable />
    </div>
  );
};

export default Ptk;
