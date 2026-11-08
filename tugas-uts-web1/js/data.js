/**
 * data.js — data dummy pengganti database (format Array JSON).
 * Dimuat sebelum script.js pada setiap halaman.
 */

/** Daftar akun yang boleh login. */
const dataPengguna = [
  {
    nama: "Budi Santoso",
    email: "mahasiswa@ut.ac.id",
    password: "123456",
    role: "Admin",
    departemen: "Gudang",
  },
];

/** Katalog buku (dipakai stok.html dan checkout.html). */
const dataKatalogBuku = [
  {
    kode: "BK001",
    judul: "Kepemimpinan",
    penulis: "Hj. Mu'ah dkk.",
    harga: 85000,
    stok: 25,
    gambar: "img/kepemimpinan.jpg",
  },
  {
    kode: "BK002",
    judul: "Manajemen Keuangan",
    penulis: "Erna Chotidjah Suhatmi",
    harga: 92000,
    stok: 18,
    gambar: "img/manajemen_keuangan.jpg",
  },
  {
    kode: "BK003",
    judul: "Mikrobiologi Dasar",
    penulis: "Imam Mishbach dkk.",
    harga: 110000,
    stok: 7,
    gambar: "img/mikrobiologi.jpg",
  },
  {
    kode: "BK004",
    judul: "Perkembangan Anak Usia Dini",
    penulis: "Drs. Ahmad Susanto, M.Pd.",
    harga: 78000,
    stok: 30,
    gambar: "img/paud_perkembangan.jpg",
  },
  {
    kode: "BK005",
    judul: "Ilmu Komunikasi",
    penulis: "Nurudin",
    harga: 69000,
    stok: 12,
    gambar: "img/pengantar_komunikasi.jpg",
  },
];

/** Tahapan status pengiriman (indeks = nilai `status` pada data pesanan). */
const statusPengiriman = [
  "Pesanan diterima",
  "Diproses",
  "Dikirim",
  "Dalam perjalanan",
  "Terkirim",
];

/** Data pengiriman contoh untuk pencarian Nomor Delivery Order. */
const dataTracking = [
  {
    noDO: "DO20260001",
    nama: "Budi Santoso",
    ekspedisi: "JNE",
    tanggalKirim: "2026-11-01",
    jenisPaket: "Reguler",
    total: 177000,
    status: 4,
  },
  {
    noDO: "DO20260002",
    nama: "Siti Aminah",
    ekspedisi: "J&T Express",
    tanggalKirim: "2026-11-05",
    jenisPaket: "Ekspres",
    total: 110000,
    status: 3,
  },
  {
    noDO: "DO20260003",
    nama: "Andi Wijaya",
    ekspedisi: "SiCepat",
    tanggalKirim: "2026-11-07",
    jenisPaket: "Reguler",
    total: 85000,
    status: 1,
  },
];

/** Riwayat transaksi stok: IN = barang masuk, OUT = barang keluar. */
const dataTransaksi = [
  {
    id: "T001",
    doc: "PO-2026-011",
    tanggal: "2026-11-02",
    tipe: "IN",
    qty: 30,
    user: "Budi Santoso",
    ket: "Restok penerbit",
  },
  {
    id: "T002",
    doc: "DO20260001",
    tanggal: "2026-11-03",
    tipe: "OUT",
    qty: 2,
    user: "Budi Santoso",
    ket: "Pesanan online",
  },
  {
    id: "T003",
    doc: "DO20260002",
    tanggal: "2026-11-05",
    tipe: "OUT",
    qty: 1,
    user: "Siti Aminah",
    ket: "Pesanan online",
  },
  {
    id: "T004",
    doc: "PO-2026-012",
    tanggal: "2026-11-06",
    tipe: "IN",
    qty: 12,
    user: "Andi Wijaya",
    ket: "Restok penerbit",
  },
];
