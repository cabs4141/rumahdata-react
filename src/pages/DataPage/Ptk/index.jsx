import PtkTable from "./table";

const Ptk = () => {
  return (
    // Gunakan w-full dan max-w-full untuk mengunci lebar
    <div className="w-full max-w-full flex flex-col h-[calc(100vh-140px)] border border-gray-300 rounded-lg shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
      <PtkTable />
    </div>
  );
};

export default Ptk;
