import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// icons
import { School, Users, Award, Calendar, Activity, PieChart } from "lucide-react";

// store
import { usePtkStore } from "@/features/ptk/stores/usePtkStore";
import { useSekolahStore } from "@/features/sekolah/stores/useSekolahStore";
import { useUserStore } from "@/features/users/stores/useUserStore";
import { usePpgStore } from "@/features/ppg/stores/usePpgStore";
import { useKegiatanStore } from "@/features/kegiatan/stores/useKegiatanStore";
import { useDeskripsiStore } from "@/features/deskripsi/stores/useDeskripsiStore";

// chart
import { ResizableChart } from "@/pages/DataPage/Statistik/components/SharedComponents";

export default function Dashboard() {
  const { totalData: ptkTotalData, getPtk } = usePtkStore();
  const { sekolahData, fetchSekolah } = useSekolahStore();
  const { userList, getUserLists, token } = useUserStore();
  const { totalPpgStatistik, getStatistikPpg } = usePpgStore();
  const { totalData: kegiatanTotalData, fetchTotalKegiatan } = useKegiatanStore();
  const { deskripsi, getDeskripsi } = useDeskripsiStore();

  useEffect(() => {
    if (token) {
      getPtk();
      fetchSekolah();
      getUserLists();
      getStatistikPpg();
      fetchTotalKegiatan();
      getDeskripsi();
    }
  }, [token, getPtk, fetchSekolah, getUserLists, getStatistikPpg, fetchTotalKegiatan, getDeskripsi]);

  const totalKeseluruhan = (sekolahData?.totalData || 0) + (ptkTotalData || 0) + (totalPpgStatistik || 0) + (kegiatanTotalData || 0);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const stats = [
    {
      title: "Total Sekolah",
      desc: "Lembaga pendidikan terdaftar",
      value: sekolahData?.totalData || 0,
      icon: <School size={28} />,
      color: "bg-blue-100 text-blue-700",
      borderColor: "border-blue-300",
      to: "/sekolah",
    },
    {
      title: "Total PTK",
      desc: "Tenaga pendidik & kependidikan",
      value: ptkTotalData || 0,
      icon: <Users size={28} />,
      color: "bg-green-100 text-green-600",
      borderColor: "border-green-200",
      to: "/ptk",
    },
    {
      title: "Peserta PPG",
      desc: "Guru dalam program profesi",
      value: totalPpgStatistik || 0,
      icon: <Award size={28} />,
      color: "bg-yellow-100 text-yellow-600",
      borderColor: "border-yellow-200",
      to: "/ppg",
    },
    {
      title: "Agenda Kegiatan",
      desc: "Jadwal dan aktivitas dinas",
      value: kegiatanTotalData || 0,
      icon: <Calendar size={28} />,
      color: "bg-purple-100 text-purple-600",
      borderColor: "border-purple-200",
      to: "/kegiatan",
    },
  ];

  // Konfigurasi Chart Komposisi Data
  const chartSeries = [sekolahData?.totalData || 0, ptkTotalData || 0, totalPpgStatistik || 0, kegiatanTotalData || 0];

  const chartOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
        fontFamily: "Outfit, Inter, sans-serif",
        toolbar: { show: false },
      },
      colors: ["#2563EB", "#16A34A", "#CA8A04", "#9333EA"], // Blue, Green, Yellow, Purple (match the stat cards)
      labels: ["Sekolah", "PTK", "PPG", "Kegiatan"],
      plotOptions: {
        pie: {
          donut: {
            size: "70%",
            labels: {
              show: true,
              name: { fontSize: "14px", fontWeight: 600, color: "#64748B" },
              value: {
                fontSize: "24px",
                fontWeight: 800,
                color: "#1E293B",
                formatter: (val) => val.toLocaleString("id-ID"),
              },
              total: {
                show: true,
                showAlways: true,
                label: "Total Data",
                fontSize: "14px",
                fontWeight: 600,
                color: "#64748B",
                formatter: function (w) {
                  const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                  return total.toLocaleString("id-ID");
                },
              },
            },
          },
        },
      },
      dataLabels: { enabled: false },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        markers: { radius: 12 },
        itemMargin: { horizontal: 10, vertical: 5 },
        formatter: (seriesName, opts) => {
          return [seriesName, " - ", opts.w.globals.series[opts.seriesIndex].toLocaleString("id-ID")];
        },
      },
      stroke: { width: 0 },
      tooltip: {
        theme: "light",
        y: { formatter: (val) => val.toLocaleString("id-ID") + " Data" },
      },
    }),
    [],
  );

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen space-y-8">
      {/* HERO PANEL */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white p-8 md:p-10 rounded-3xl shadow-xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white opacity-5 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-blue-400 opacity-10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">Selamat Datang di Rumah Data</h1>
            <p className="text-blue-100 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
              {deskripsi || "Pusat informasi dan statistik terpadu untuk pengelolaan data instansi pendidikan, tenaga pendidik, program sertifikasi, serta agenda kegiatan."}
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              <Calendar size={18} className="text-blue-200" />
              <span className="text-sm font-medium tracking-wide">{today}</span>
            </div>
          </div>

          <div className="flex gap-4 md:gap-6 bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20 shrink-0">
            <div className="text-center px-4">
              <p className="text-blue-200 text-sm font-medium mb-1">Total Data</p>
              <p className="text-3xl font-bold">{totalKeseluruhan.toLocaleString("id-ID")}</p>
            </div>
            {/* <div className="w-px bg-white/20"></div> */}
            {/* <div className="text-center px-4">
              <p className="text-blue-200 text-sm font-medium mb-1">Pengguna</p>
              <p className="text-3xl font-bold">{(userList?.length || 0).toLocaleString('id-ID')}</p>
            </div> */}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* STATISTICS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 px-1">
            <Activity className="text-blue-700" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Ringkasan Statistik</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Link to={item.to} className={`block bg-white p-6 rounded-2xl border ${item.borderColor} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3.5 rounded-xl ${item.color} shadow-inner`}>{item.icon}</div>
                    <div className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100 text-xs font-semibold text-slate-500">Akumulasi</div>
                  </div>
                  <div>
                    <h3 className="text-4xl font-extrabold text-slate-800 mb-1">{item.value.toLocaleString("id-ID")}</h3>
                    <p className="text-base font-bold text-slate-700">{item.title}</p>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">{item.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* DATA COMPOSITION CHART (Ganti Informasi Terbaru) */}
        <div className="space-y-6 flex flex-col">
          <div className="flex items-center gap-2 px-1">
            <PieChart className="text-blue-700" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Komposisi Data</h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex-1 flex flex-col justify-center items-center h-full min-h-[350px]"
          >
            <div className="w-full h-full flex items-center justify-center">
              {totalKeseluruhan > 0 ? <ResizableChart options={chartOptions} series={chartSeries} type="donut" height={320} /> : <div className="text-slate-400 text-sm font-medium">Data belum tersedia</div>}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
