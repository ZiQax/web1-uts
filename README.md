# Toko Buku Online — Tugas UTS Pemrograman Web 1

Aplikasi web *front-end* sederhana untuk pemesanan buku pada toko online. Data tidak diambil dari server/database, melainkan dari variabel JavaScript pada `js/data.js` (format Array JSON).

## Fitur per Halaman

| Halaman | Berkas | Fitur utama |
|---|---|---|
| Login | `index.html` | Validasi email/password, alert jika salah, modal **Lupa Password** dan **Daftar** |
| Dashboard | `dashboard.html` | Greeting sesuai jam lokal (pagi/siang/sore/malam), menu navigasi, modal History Transaksi |
| Stok / Katalog | `stok.html` | Tabel dinamis dari `dataKatalogBuku`, tambah baris stok baru lewat DOM, penanda stok menipis |
| Pemesanan | `checkout.html` | Keranjang dapat ditambah/diubah/dihapus, form pemesan & pembayaran, validasi, nomor DO otomatis |
| Tracking | `tracking.html` | Cari Nomor Delivery Order, tampilkan nama pemesan, status (progress bar + langkah), ekspedisi, tanggal kirim, jenis paket, total |

## Struktur Folder

```
tugas-uts-web1/
|-- index.html        (halaman login)
|-- dashboard.html
|-- stok.html
|-- checkout.html
|-- tracking.html
|-- css/style.css     (CSS eksternal)
|-- js/script.js      (logika aplikasi)
|-- js/data.js        (data dummy)
|-- assets/           (logo, opsional)
|-- img/              (sampul buku)
```

## Cara Menjalankan

1. Ekstrak proyek, lalu buka `index.html` di browser (tidak perlu server).
2. Login dengan akun demo yang tersedia pada file data.js
3. Untuk mencoba tracking, gunakan nomor `DO20260001`, `DO20260002`, atau `DO20260003`. Pesanan baru dari halaman Pemesanan juga mendapat nomor DO yang dapat dilacak.

## Pemetaan ke Indikator & Kriteria Penilaian

- **HTML semantik & valid**: `header`, `nav`, `main`, `section`, `footer`, `label` terhubung ke `input`, atribut `lang` dan `aria-*`.
- **CSS (inline, internal, eksternal)**: eksternal di `css/style.css`; internal pada `<style>` di `index.html`; inline pada beberapa elemen (mis. greeting dan tombol login).
- **JavaScript DOM**: render tabel, tambah baris stok, keranjang interaktif, progress bar, modal box.
- **Validasi form & alert**: `alert()` untuk login/stok/jumlah, pesan error inline untuk form stok dan checkout, validasi nomor telepon dengan regex.
- **Modularitas**: HTML, CSS, data, dan logika dipisah; `script.js` memakai satu fungsi `init...` per halaman, dipilih lewat `data-halaman` pada `<body>`.
- **Kreativitas tambahan**: penanda stok menipis, proteksi halaman (wajib login), tombol Keluar, penyimpanan pesanan di `localStorage`, dukungan layar ponsel dan `prefers-reduced-motion`.

## Catatan Penting

- Halaman login memakai nama `index.html` sesuai struktur folder pada soal (soal juga menyebut `login.html`); `checkout.html` ditulis dengan ejaan benar (pada soal tertulis `chackout.html`).
- Menu **Laporan Pemesanan** mengarah ke halaman Pemesanan, dan **History Transaksi** tampil sebagai modal di dashboard.
- Data buku dan gambar adalah data contoh; ganti isi `js/data.js` dan folder `img/` dengan berkas aset resmi dari dosen jika tersedia.
- Akun yang didaftarkan lewat modal **Daftar** hanya tersimpan selama halaman terbuka.

## Saran Alur Video Penjelasan (maks. 15 menit)

1. Tinjauan struktur folder dan alasan pemisahan berkas (1–2 menit)
2. Struktur HTML semantik tiap halaman (3 menit)
3. Desain CSS: variabel warna, komponen, responsif (3 menit)
4. JavaScript: data, DOM, validasi, modal, localStorage (5 menit)
5. Demo alur lengkap: login → stok → pemesanan → tracking (2 menit)

## Referensi Desain (UI)

Tampilan mengikuti gambar referensi komponen, kombinasi warna, dan tata letak yang diberikan:

| Aspek | Penerapan |
|---|---|
| Font | Inter (Google Fonts), cadangan `Segoe UI` / `system-ui` |
| Warna | Primer indigo `#4f46e5`, aksen oranye `#f97316` (tombol Daftar), latar `#eef2f9`, teks `#1e293b` |
| Kartu statistik | Border kiri berwarna: biru (total stok), hijau (masuk), merah (keluar), kuning (judul) |
| Layout | Sidebar kiri + topbar (breadcrumb, status online, avatar pengguna); menjadi susunan vertikal di layar kecil |
| Komponen | Kartu login berikon, modal Daftar (Role & Departemen/Tenant), tabel dengan badge **IN**/**OUT**, kolom pencarian, penghitung "Total: n records" |

Catatan: gambar referensi memakai label *Username*, sedangkan soal mewajibkan **email** dan password, sehingga formulir login tetap memakai Email. Ikon memakai emoji agar tidak bergantung pada pustaka eksternal.
