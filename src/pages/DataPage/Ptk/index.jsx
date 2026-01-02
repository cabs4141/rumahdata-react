// src/components/Ptk.jsx
import React, { useEffect } from "react";
import { usePtkStore } from "../../../stores/usePtkStore";
import PtkTable from "./table";

const Ptk = () => {
  return (
    <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm mt-18">
      <PtkTable />
    </div>
  );
};

export default Ptk;
