const fs = require('fs');

const ptkColumns = [
  "ptk_id", "semester", "sekolah_id", "ptk_terdaftar_id", "nama", "nip", "jenis_kelamin", "tempat_lahir", "tanggal_lahir", 
  "nik", "no_kk", "niy_nigk", "status_kepegawaian", "jenis_ptk", "pengawas_bidang_studi", "agama", "kewarganegaraan", 
  "alamat_jalan", "rt", "rw", "nama_dusun", "kode_desa_kelurahan", "desa_kelurahan", "kode_kecamatan", "kecamatan", 
  "kode_kabupaten", "kabupaten", "kode_provinsi", "provinsi", "kode_pos", "lintang", "bujur", "no_telepon_rumah", "email", 
  "status_keaktifan", "sk_cpns", "tgl_cpns", "sk_pengangkatan", "tmt_pengangkatan", "lembaga_pengangkat", "pangkat_golongan", 
  "keahlian_laboratorium", "sumber_gaji", "nama_ibu_kandung", "status_perkawinan", "nama_suami_istri", "nip_suami_istri", 
  "tmt_pns", "sudah_lisensi_kepala_sekolah", "jumlah_sekolah_binaan", "pernah_diklat_kepengawasan", "nm_wp", "status_data", 
  "karpeg", "karpas", "mampu_handle_kk", "keahlian_braille", "keahlian_bhs_isyarat", "npwp", "rekening_bank", "rekening_atas_nama", 
  "tahun_ajaran", "nomor_surat_tugas", "tanggal_surat_tugas", "tmt_tugas", "ptk_induk", "jenis_keluar", "tgl_ptk_keluar", 
  "riwayat_kepangkatan_pangkat_golongan", "riwayat_kepangkatan_nomor_sk", "riwayat_kepangkatan_tanggal_sk", "riwayat_kepangkatan_tmt_pangkat", 
  "riwayat_kepangkatan_masa_kerja_gol_tahun", "riwayat_kepangkatan_masa_kerja_gol_bulan", "riwayat_gaji_berkala_pangkat_golongan", 
  "riwayat_gaji_berkala_nomor_sk", "riwayat_gaji_berkala_tanggal_sk", "riwayat_gaji_berkala_tmt_kgb", "riwayat_gaji_berkala_masa_kerja_tahun", 
  "riwayat_gaji_berkala_masa_kerja_bulan", "riwayat_gaji_berkala_gaji_pokok", "inpassing_pangkat_golongan", "inpassing_no_sk_inpassing", 
  "inpassing_tgl_sk_inpassing", "inpassing_tmt_inpassing", "inpassing_angka_kredit", "inpassing_masa_kerja_tahun", "inpassing_masa_kerja_bulan", 
  "riwayat_sertifikasi_bidang_studi", "riwayat_sertifikasi_jenis_sertifikasi", "riwayat_sertifikasi_tahun_sertifikasi", "riwayat_sertifikasi_nomor_sertifikat", 
  "riwayat_sertifikasi_nrg", "riwayat_pendidikan_formal_bidang_studi", "riwayat_pendidikan_formal_jenjang_pendidikan", "riwayat_pendidikan_formal_gelar_akademik", 
  "riwayat_pendidikan_formal_satuan_pendidikan_formal", "riwayat_pendidikan_formal_fakultas", "riwayat_pendidikan_formal_kependidikan", 
  "riwayat_pendidikan_formal_tahun_masuk", "riwayat_pendidikan_formal_tahun_lulus", "riwayat_pendidikan_formal_nim", "jumlah_anak", 
  "tugas_tambahan_jabatan_ptk", "tugas_tambahan_sekolah", "tugas_tambahan_jumlah_jam", "tugas_tambahan_nomor_sk", "tugas_tambahan_tmt_tambahan", 
  "tugas_tambahan_tst_tambahan", "riwayat_struktural_jabatan_ptk", "riwayat_struktural_sk_struktural", "riwayat_struktural_tmt_jabatan", 
  "riwayat_fungsional_jabatan_fungsional", "riwayat_fungsional_sk_jabfung", "riwayat_fungsional_tmt_jabatan", "jabatan_ptk"
];

// PATCH UPLOAD.CONTROLLER.JS
const beFile = '../rumah-data-be/src/features/upload/upload.controller.js';
let beContent = fs.readFileSync(beFile, 'utf8');

// Find the uploadPtk expectedCols array
const expectedColsRegex = /const uploadPtk =[\s\S]*?const expectedCols = \[\s*("ptk_id",[\s\S]*?"jabatan_ptk",?)\s*\];/m;
if (beContent.match(expectedColsRegex)) {
  const newColsArr = `const expectedCols = [\n    ` + ptkColumns.map(c => `"${c}"`).join(",\n    ") + `\n  ];`;
  
  // To replace just the array correctly:
  beContent = beContent.replace(/const expectedCols = \[\s*("ptk_id",[\s\S]*?"jabatan_ptk",?)\s*\];/g, (match, p1, offset, string) => {
    // There are 2 arrays matching this shape implicitly, one for uploadSekolah, one for uploadPtk.
    // wait uploadSekolah ends with "listrik_utama", so it only matches if "jabatan_ptk" is there. Thus safe.
    return newColsArr;
  });

  fs.writeFileSync(beFile, beContent);
  console.log("Backend upload.controller.js patched successfully.");
} else {
  console.error("Could not find uploadPtk expectedCols array.");
}
