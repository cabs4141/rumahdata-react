const fs = require('fs');

const file = 'src/features/sekolah/components/SekolahList.jsx';
let content = fs.readFileSync(file, 'utf8');

const additionalCols = `
      { header: "NAMA NOMENKLATUR", accessor: "nama_nomenklatur", hide: true },
      { header: "NSS", accessor: "nss", hide: true },
      { header: "RT", accessor: "rt", hide: true },
      { header: "RW", accessor: "rw", hide: true },
      { header: "NAMA DUSUN", accessor: "nama_dusun", hide: true },
      { header: "LINTANG", accessor: "lintang", hide: true },
      { header: "BUJUR", accessor: "bujur", hide: true },
      { header: "NOMOR TELEPON", accessor: "nomor_telepon", hide: true },
      { header: "NOMOR FAX", accessor: "nomor_fax", hide: true },
      { header: "WEBSITE", accessor: "website", hide: true },
      { header: "NO REKENING", accessor: "no_rekening", hide: true },
      { header: "NAMA BANK", accessor: "nama_bank", hide: true },
      { header: "CABANG KCP UNIT", accessor: "cabang_kcp_unit", hide: true },
      { header: "DAYA LISTRIK", accessor: "daya_listrik", hide: true },
      { header: "KONTINUITAS LISTRIK", accessor: "kontinuitas_listrik", hide: true },
      { header: "JARAK LISTRIK", accessor: "jarak_listrik", hide: true },
      { header: "WAKTU PENYELENGGARAAN", accessor: "waktu_penyelenggaraan", hide: true },
      { header: "SUMBER LISTRIK", accessor: "sumber_listrik", hide: true },
      { header: "SERTIFIKASI ISO", accessor: "sertifikasi_iso", hide: true },
      { header: "INTERNET JENIS LAYANAN", accessor: "internet_jenis_layanan", hide: true },
      { header: "INTERNET JENIS KONEKSI", accessor: "internet_jenis_koneksi", hide: true },
      { header: "INTERNET PROVIDER", accessor: "internet_provider", hide: true },
      { header: "INTERNET BANDWIDTH", accessor: "internet_bandwidth", hide: true },
      { header: "INTERNET BANDWIDTH UP", accessor: "internet_bandwidth_up", hide: true },
      { header: "INTERNET BANDWIDTH DOWN", accessor: "internet_bandwidth_down", hide: true },
      { header: "INTERNET LATENCY", accessor: "internet_latency", hide: true },
      { header: "LISTRIK SUMBER", accessor: "listrik_sumber", hide: true },
      { header: "LISTRIK DAYA", accessor: "listrik_daya", hide: true },
      { header: "LISTRIK KONTINUITAS", accessor: "listrik_kontinuitas", hide: true },
      { header: "LISTRIK ID PELANGGAN", accessor: "listrik_id_pelanggan", hide: true },
      { header: "LISTRIK NOMOR METER", accessor: "listrik_nomor_meter", hide: true },
      { header: "LISTRIK JENIS METER", accessor: "listrik_jenis_meter", hide: true },
      { header: "LISTRIK STATUS SAMBUNGAN", accessor: "listrik_status_sambungan", hide: true },
      { header: "LISTRIK UTAMA", accessor: "listrik_utama", hide: true },
`;

content = content.replace('{ header: "ANGKATAN PSP", accessor: "angkatan_psp", hide: true },', '{ header: "ANGKATAN PSP", accessor: "angkatan_psp", hide: true },' + additionalCols);

fs.writeFileSync(file, content);
console.log('SekolahList.jsx updated successfully');
